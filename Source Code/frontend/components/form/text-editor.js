"use client"

import dynamic from "next/dynamic";
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { useEffect, useState } from "react";

const Editor = dynamic(
    () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
    {
        ssr: false,
        loading: () => <div className="h-20 rounded bg-gray-100 animate-pulse" />,
    }
);

const DraftEditor = ({ value, onChange }) => {
    const [editorState, setEditorState] = useState(EditorState.createEmpty())
    useEffect(() => {
        const contentBlock = htmlToDraft(value || "");
        if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
            setEditorState(EditorState.createWithContent(contentState))
        }
    }, [])

    const onEditorStateChange = (editorState) => {
        setEditorState(editorState)
        if (onChange) {
            onChange(draftToHtml(convertToRaw(editorState.getCurrentContent())))
        }
    }

   
    return (
        <Editor
            editorState={editorState}
            toolbarClassName="toolbarClassName"
            wrapperClassName=""
            editorClassName="tw-h-20 p-2"
            onEditorStateChange={onEditorStateChange}
            
        />
    )
}
export default DraftEditor
