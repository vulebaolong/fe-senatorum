import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import { $getRoot } from "lexical";
import { useEffect, useState } from "react";

export function useTextLength() {
    const [editor] = useLexicalComposerContext();
    const [len, setLen] = useState(0);

    useEffect(() => {
        return mergeRegister(
            editor.registerUpdateListener(({ editorState }) => {
                editorState.read(() => {
                    setLen($getRoot().getTextContentSize());
                });
            })
        );
    }, [editor]);

    return len;
}
