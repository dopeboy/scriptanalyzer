import React from "react";
import classNames from "classnames";
import {
  RiBold,
  RiItalic,
  RiStrikethrough,
  RiH1,
  RiH2,
  RiH3,
  RiH4,
  RiH5,
  RiH6,
  RiParagraph,
  RiListOrdered,
  RiListUnordered,
  RiLink,
  RiLinkUnlink,
  RiUnderline,
  RiTextWrap,
  RiFormatClear,
  RiArrowGoBackLine,
  RiArrowGoForwardLine
} from "react-icons/ri";

import { setLink } from "./helper";

import "./Toolbar.scss";

function Toolbar({ editor }) {
  if (!editor) {
    return null;
  }
  const isCursorOverLink = editor?.getAttributes("link").href;

  return (
    <div className={classNames("ToolbarContainer")}>
      <div className="Toolbar">
        <div
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={classNames(
            "icon",
            editor.isActive("bold") ? "is-active" : ""
          )}
        >
          <RiBold />
        </div>
        <div
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={classNames(
            "icon",
            editor.isActive("italic") ? "is-active" : ""
          )}
        >
          <RiItalic />
        </div>
        <div
          className={classNames(
            "icon",
            editor.isActive("underline") ? "is-active" : ""
          )}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <RiUnderline />
        </div>
        <div
          className={classNames(
            "icon",
            editor.isActive("strike") ? "is-active" : ""
          )}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <RiStrikethrough />
        </div>
        <div className="divider"></div>
        <div
          className={classNames(
            "icon",
            editor.isActive("heading", { level: 1 }) ? "is-active" : ""
          )}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
        >
          <RiH1 />
        </div>
        <div
          className={classNames(
            "icon",
            editor.isActive("heading", { level: 2 }) ? "is-active" : ""
          )}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          <RiH2 />
        </div>
        <div
          className={classNames(
            "icon",
            editor.isActive("heading", { level: 3 }) ? "is-active" : ""
          )}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
        >
          <RiH3 />
        </div>
        <div
          className={classNames(
            "icon",
            editor.isActive("heading", { level: 4 }) ? "is-active" : ""
          )}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 4 }).run()
          }
        >
          <RiH4 />
        </div>
        <div
          className={classNames(
            "icon",
            editor.isActive("heading", { level: 5 }) ? "is-active" : ""
          )}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 5 }).run()
          }
        >
          <RiH5 />
        </div>
        <div
          className={classNames(
            "icon",
            editor.isActive("heading", { level: 6 }) ? "is-active" : ""
          )}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 6 }).run()
          }
        >
          <RiH6 />
        </div>
        <div
          className={classNames(
            "icon",
            editor.isActive("paragraph") ? "is-active" : ""
          )}
          onClick={() => editor.chain().focus().setParagraph().run()}
        >
          <RiParagraph />
        </div>
        <div
          className={classNames(
            "icon",
            editor.isActive("bulletList") ? "is-active" : ""
          )}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <RiListUnordered />
        </div>
        <div
          className={classNames(
            "icon",
            editor.isActive("orderedList") ? "is-active" : ""
          )}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <RiListOrdered />
        </div>
        <div className="divider"></div>
        <div className="icon" onClick={() => setLink(editor)}>
          <RiLink />
        </div>
        <div
          className={classNames("icon", { disabled: !isCursorOverLink })}
          onClick={() => setLink(editor)}
        >
          <RiLinkUnlink />
        </div>
        <div className="divider"></div>
        <div
          className="icon"
          onClick={() => editor.chain().focus().setHardBreak().run()}
        >
          <RiTextWrap />
        </div>
        <div
          className="icon"
          onClick={() =>
            editor.chain().focus().unsetAllMarks().clearNodes().run()
          }
        >
          <RiFormatClear />
        </div>
        <div className="divider"></div>
        <div
          className="icon"
          onClick={() => editor.chain().focus().undo().run()}
        >
          <RiArrowGoBackLine />
        </div>
        <div
          className="icon"
          onClick={() => editor.chain().focus().redo().run()}
        >
          <RiArrowGoForwardLine />
        </div>
      </div>
    </div>
  );
}

export { Toolbar };