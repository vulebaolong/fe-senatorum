import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { EditorState } from "lexical";
import { useEffect } from "react";

type TProps = {
    onChange: (editorState: EditorState) => void;
};

export default function MyOnchangePlugin({ onChange }: TProps): null {
    const [editor] = useLexicalComposerContext();
    useEffect(() => {
        return editor.registerUpdateListener(({ editorState }) => {
            onChange(editorState);
        });
    }, [onChange, editor]);
    return null;
}
