import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { useEffect } from "react";
import { editorConfig } from "./editor";
import CodeHighlightPrismPlugin from "./plugin/code-highlight-prism-plugin";

function LoadContentPlugin({ json }: { json: string }) {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        try {
            setTimeout(() => {
                const parsed = JSON.parse(json);
                const editorState = editor.parseEditorState(parsed);
                editor.setEditorState(editorState);
            });
        } catch (err) {
            console.error("Invalid editor state JSON", err);
        }
    }, [json, editor]);

    return null;
}

export default function EditorViewer({ json }: { json: string }) {
    return (
        <LexicalComposer initialConfig={{ ...editorConfig, editable: false }}>
            <div className="editor-viewer">
                <RichTextPlugin
                    contentEditable={<ContentEditable className="editor-input pointer-events-none" />}
                    placeholder={null}
                    ErrorBoundary={() => null}
                />
                <LoadContentPlugin json={json} />
                <CodeHighlightPrismPlugin />
            </div>
        </LexicalComposer>
    );
}
