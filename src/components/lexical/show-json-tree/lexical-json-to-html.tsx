import { createEditor } from "lexical";
import { $generateHtmlFromNodes } from "@lexical/html";
import { useEffect, useState } from "react";
import { editorConfig } from "../editor";
import CodeHighlightPrismPlugin from "../plugin/code-highlight-prism-plugin";

type TProps = {
    lexicalJson: string;
};

export default function LexicalJsonToHtml({ lexicalJson }: TProps) {
    const [htmlContent, setHtmlContent] = useState("");

    useEffect(() => {
        const editor = createEditor(editorConfig);

        // Set editorState từ JSON tree bạn lấy từ API
        const editorState = editor.parseEditorState(lexicalJson);
        editor.setEditorState(editorState);

        // Convert sang HTML
        editor.update(() => {
            const html = $generateHtmlFromNodes(editor);
            setHtmlContent(html);
        });
    }, [lexicalJson]);

    return (
        <>
            <div className="lexical-readonly-view" dangerouslySetInnerHTML={{ __html: htmlContent }} />;
        </>
    );
}
