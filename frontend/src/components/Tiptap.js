'use client'

import StarterKit from '@tiptap/starter-kit'
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import { Toolbar } from "./Toolbar";
import CommentExtension from "@sereneinserenade/tiptap-comment-extension";
import { useEffect, useRef, useState } from 'react'
import { CommentIcon } from './CommentIcon'
import { BubbleMenu, EditorContent, JSONContent, useEditor } from '@tiptap/react'
import { v4 } from 'uuid'
import Placeholder from '@tiptap/extension-placeholder'
import { useRouter } from 'next/navigation'
import { getAPIURL } from '@/lib/api';
import Image from 'next/image'



import "./Editor.scss";
import { Skeleton } from './Skeleton';


const Tiptap = ({ id }) => {
  const [comments, setComments] = useState([])
  const [activeCommentId, setActiveCommentId] = useState(null)
  const commentsSectionRef = useRef(null)
  const [name, setName] = useState()
  const [text, setText] = useState()
  const [rawComments, setRawComments] = useState([])
  const router = useRouter()
  const [isLoading, setLoading] = useState(id ? true : false)
  const [saveDisabled, setSaveDisabled] = useState(true)
  const [processDisabled, setProcessDisabled] = useState(false)

  if (id) {
    useEffect(() => {
      fetch(`${getAPIURL()}/scripts/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setName(data.name)
          setText(data.structured_text)
          setRawComments(data.comments)
          setLoading(false)
        })
    }, [])
  }

  const focusCommentWithActiveId = (id) => {
    if (!commentsSectionRef.current) return
    const commentInput = commentsSectionRef.current.querySelector(`input#${id}`)
    if (!commentInput) return

    commentInput.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center'
    })
  }

  useEffect(
    () => {
      if (!activeCommentId) return
      focusCommentWithActiveId(activeCommentId)
    }
    , [activeCommentId]
  )

  const setComment = () => {
    const newComment = getNewComment('')
    setComments([...comments, newComment])
    editor?.commands.setComment(newComment.id)
    setActiveCommentId(newComment.id)
    setTimeout(focusCommentWithActiveId)
  }

  const programaticallySetComment = (content) => {
    const newComment = getNewComment(content)
    //setComments([...comments, newComment])
    editor?.commands.setComment(newComment.id)
    return newComment
    //setActiveCommentId(newComment.id)
    //setTimeout(focusCommentWithActiveId)
  }

  const getNewComment = (content) => {
    return {
      id: `a${v4()}a`,
      content,
      replies: [],
      createdAt: new Date()
    }
  }

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link,
      Underline,
      CommentExtension.configure(
        {
          HTMLAttributes: {
            class: 'my-comment'
          },
          onCommentActivated: (commentId) => {
            setActiveCommentId(commentId)

            if (commentId) setTimeout(() => focusCommentWithActiveId(commentId))
          }
        }
      ),
      Placeholder.configure({
        placeholder: 'Paste your script here...',
      }),
    ],
    editorProps: {
      attributes: {
        class: "prose prose-gray prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none"

      },
    },
    placeholder: "Paste your script here",
    content: text,
    onUpdate: ({ editor }) => {
      setText(editor.getHTML())
      setSaveDisabled(false)
    }
  })

  const save = () => {
    setSaveDisabled(true)

    // If we are editing a script
    if (id) {
      fetch(`${getAPIURL()}/scripts/${id}`, {
        method: 'PATCH',
        body:
          JSON.stringify({ name: name, structured_text: JSON.stringify(editor.getJSON()), unstructured_text: editor.getText() }),

        headers: { "Content-Type": "application/json" },
      })
        .then((res) => res.json())
        .then((data) => {
          setName(data.name)
          setText(data.text)
          setLoading(false)
        })
    }

    // If a new script
    else {
      fetch(`${getAPIURL()}/scripts`, {
        method: 'POST',
        body:
          JSON.stringify({ name: name, text: JSON.stringify(editor.getJSON()) }),
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => res.json())
        .then((data) => {
          router.push(`/script/${data.id}`, undefined, { shallow: true })
        })
    }
  }

  const process = () => {
    if (!id) return

    setProcessDisabled(true)

    fetch(`${getAPIURL()}/scripts/${id}/process`, {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => setProcessDisabled(false))
  }

  // If we are loading an existing script
  useEffect(() => {
    if (editor && !isLoading && id && !editor.getText()) {
      editor.commands.setContent(JSON.parse(text))
     
      let newComments = []
      for (let comment of rawComments) {
        editor.commands.setTextSelection({ from: comment.start_index, to: comment.end_index })
        const newComment = programaticallySetComment(comment.text)
        newComments.push(newComment)
      }
      
      setComments(newComments)
    }
  }, [editor, isLoading]);

  if (isLoading) {
    return <Skeleton />
  }
  
  return (
    <>
      {processDisabled &&
        <div>
          <span>Processing...</span>
          <img
            src="https://i.imgur.com/4ip4GN1.gif"
          />
        </div >
      }
      <div className="flex">
        <div className="w-3/5">
          <input
            value={name}
            onChange={(e) => { setSaveDisabled(false); setName(e.target.value) }}
            type="text" className="front-extrabold text-gray-900 md:text-4xl block w-full sm:text-md focus:ring-blue-800 focus:border-blue-700 outline-none" autoFocus placeholder='Type your script name here' />
        </div>
        <div className="w-2/5">
          <div className="px-16 grid grid-cols-2 gap-4">
            <div className="text-center">
              <button disabled={saveDisabled}
                className="w-48 bg-blue-700 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50" onClick={save}>
                Save
              </button>
            </div>
            <div className="text-center">
              <button type="button" className="w-48 bg-blue-700 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50" disabled={processDisabled} onClick={process}>
                Process
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex pt-4">
        <div className="w-3/5">
          <Toolbar editor={editor} />
        </div>
      </div>
      <div className="flex">
        <div className="w-3/5">
          <EditorContent editor={editor} />
        </div>
        <div className="w-2/5">
          {
            editor && (
              <>
                <section className='flex flex-col gap-2 p-2 rounded-lg border-black-900' ref={commentsSectionRef}>
                  {
                    comments.length ? (
                      comments.map(comment => (
                        <div
                          key={comment.id}
                          className={`flex flex-col gap-4 p-2 border rounded-lg border-black-900 ${comment.id === activeCommentId ? 'border-blue-400 border-2' : ''} box-border`}
                        >
                          <span className='flex items-end gap-2'>
                            <a href='https://google.com' className='font-semibold border-b border-black-900'>
                              @marshallmathers
                            </a>

                            <span className='text-xs text-slate-400'>
                              {comment.createdAt.toLocaleDateString()}
                            </span>
                          </span>

                          <textarea
                            value={comment.content || ''}
                            rows="4"
                            disabled={comment.id !== activeCommentId}
                            className={`p-2 rounded-lg text-inherit bg-transparent focus:outline-none ${comment.id === activeCommentId ? 'bg-slate-600' : ''}`}
                            id={comment.id}
                            onInput={
                              (event) => {
                                const value = (event.target).value

                                setComments(comments.map(comment => {
                                  if (comment.id === activeCommentId) {
                                    return {
                                      ...comment,
                                      content: value
                                    }
                                  }

                                  return comment
                                }))
                              }
                            }
                            onKeyDown={
                              (event) => {
                                if (event.key !== 'Enter') return

                                setActiveCommentId(null)
                              }
                            }
                          />

                          {
                            comment.id === activeCommentId && (
                              <button
                                className='rounded-md bg-white/10 px-2.5 py-1.5 text-sm font-semibold border-solid border-2 border-black text-black shadow-sm hover:bg-black/20'
                                onClick={() => {
                                  setActiveCommentId(null)
                                  editor.commands.focus()
                                }}
                              >
                                Save
                              </button>
                            )
                          }
                        </div>
                      ))
                    ) : (
                      <>
                      </>
                    )
                  }
                </section>


                <BubbleMenu editor={editor} className='p-1 border rounded-lg border-black'>
                  <button
                    className='rounded-md bg-white/10 px-2.5 py-1.5 text-sm font-semibold text-black shadow-sm hover:bg-black/20'
                    onClick={setComment}
                  >
                    <CommentIcon />
                  </button>
                </BubbleMenu>
              </>
            )
          }
        </div>
      </div>
    </>
  )
}

export default Tiptap