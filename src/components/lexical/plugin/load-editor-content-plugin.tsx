import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";

type TProps = {
    json: string | undefined;
};

export default function LoadEditorContentPlugin({ json }: TProps) {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        if (!json) return;

        const parsed = JSON.parse(json);
        const editorState = editor.parseEditorState(parsed);

        editor.update(() => {
            editor.setEditorState(editorState);
        });

    }, [json]);

    return <></>
}
