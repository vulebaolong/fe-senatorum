import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { LexicalEditor } from "lexical";
import React, { RefObject, useEffect } from "react";

type TProps = {
    editorRef?: RefObject<LexicalEditor | null>;
};

export default function EditorRefPlugin({ editorRef }: TProps) {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        if (editorRef) {
            editorRef.current = editor;
        }
    }, [editor, editorRef]);
    return <></>;
}
