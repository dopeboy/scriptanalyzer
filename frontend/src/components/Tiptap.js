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

import "./Editor.scss";


const Tiptap = () => {
  const [comments, setComments] = useState([])

  const [activeCommentId, setActiveCommentId] = useState(null)

  const commentsSectionRef = useRef(null)

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
    placeholder: "Paste your script here"
  })

  const lol = () => {
    console.log(editor.getText())
  }

  return (
    <>
      <div className="flex">
        <div className="w-3/5">
          <input type="text" className="front-extrabold text-gray-900 md:text-4xl block w-full sm:text-md focus:ring-blue-500 focus:border-blue-500 outline-none" autoFocus placeholder='Type your script name here' />
        </div>
        <div className="w-2/5">
          <div className="px-16 grid grid-cols-2 gap-4">
            <div className="text-center">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-48" onClick={lol}>
                Save
              </button>
            </div>
            <div className="text-center">
              <button type="button" className="w-48 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50" disabled>
                Process
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex">
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

                          <input
                            value={comment.content || ''}
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