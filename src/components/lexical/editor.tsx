import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import {
    $isTextNode,
    DOMConversionMap,
    DOMExportOutput,
    DOMExportOutputMap,
    EditorState,
    isHTMLElement,
    Klass,
    LexicalEditor,
    LexicalNode,
    ParagraphNode,
    TextNode,
} from "lexical";

import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { TRANSFORMERS } from "@lexical/markdown";
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";
import { HorizontalRuleNode } from "@lexical/react/LexicalHorizontalRuleNode";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { RefObject } from "react";
import { ToolbarContext } from "./context/toolbar-context";
import { ImageNode } from "./nodes/ImageNode";
import CodeHighlightPrismPlugin from "./plugin/code-highlight-prism-plugin";
import EditorRefPlugin from "./plugin/editor-ref-plugin";
import FooterMetaPlugin from "./plugin/footer-meta";
import LoadEditorContentPlugin from "./plugin/load-editor-content-plugin";
import ToolbarPlugin from "./plugin/toolbar-plugin/toolbar-plugin";
import { parseAllowedColor, parseAllowedFontSize } from "./style-config";
import { theme } from "./theme/theme";

const placeholder = "Enter some rich text...";

const removeStylesExportDOM = (editor: LexicalEditor, target: LexicalNode): DOMExportOutput => {
    const output = target.exportDOM(editor);
    if (output && isHTMLElement(output.element)) {
        // Remove all inline styles and classes if the element is an HTMLElement
        // Children are checked as well since TextNode can be nested
        // in i, b, and strong tags.
        for (const el of [output.element, ...output.element.querySelectorAll('[style],[class],[dir="ltr"]')]) {
            el.removeAttribute("class");
            el.removeAttribute("style");
            if (el.getAttribute("dir") === "ltr") {
                el.removeAttribute("dir");
            }
        }
    }
    return output;
};

const exportMap: DOMExportOutputMap = new Map<Klass<LexicalNode>, (editor: LexicalEditor, target: LexicalNode) => DOMExportOutput>([
    [ParagraphNode, removeStylesExportDOM],
    [TextNode, removeStylesExportDOM],
]);

const getExtraStyles = (element: HTMLElement): string => {
    // Parse styles from pasted input, but only if they match exactly the
    // sort of styles that would be produced by exportDOM
    let extraStyles = "";
    const fontSize = parseAllowedFontSize(element.style.fontSize);
    const backgroundColor = parseAllowedColor(element.style.backgroundColor);
    const color = parseAllowedColor(element.style.color);
    if (fontSize !== "" && fontSize !== "15px") {
        extraStyles += `font-size: ${fontSize};`;
    }
    if (backgroundColor !== "" && backgroundColor !== "rgb(255, 255, 255)") {
        extraStyles += `background-color: ${backgroundColor};`;
    }
    if (color !== "" && color !== "rgb(0, 0, 0)") {
        extraStyles += `color: ${color};`;
    }
    return extraStyles;
};

const constructImportMap = (): DOMConversionMap => {
    const importMap: DOMConversionMap = {};

    // Wrap all TextNode importers with a function that also imports
    // the custom styles implemented by the playground
    for (const [tag, fn] of Object.entries(TextNode.importDOM() || {})) {
        importMap[tag] = (importNode) => {
            const importer = fn(importNode);
            if (!importer) {
                return null;
            }
            return {
                ...importer,
                conversion: (element) => {
                    const output = importer.conversion(element);
                    if (output === null || output.forChild === undefined || output.after !== undefined || output.node !== null) {
                        return output;
                    }
                    const extraStyles = getExtraStyles(element);
                    if (extraStyles) {
                        const { forChild } = output;
                        return {
                            ...output,
                            forChild: (child, parent) => {
                                const textNode = forChild(child, parent);
                                if ($isTextNode(textNode)) {
                                    textNode.setStyle(textNode.getStyle() + extraStyles);
                                }
                                return textNode;
                            },
                        };
                    }
                    return output;
                },
            };
        };
    }

    return importMap;
};

export const editorConfig = {
    html: {
        export: exportMap,
        import: constructImportMap(),
    },
    namespace: "React.js Demo",
    nodes: [
        LinkNode,
        AutoLinkNode,
        ListNode,
        ListItemNode,
        ParagraphNode,
        TextNode,
        HorizontalRuleNode,
        CodeNode,
        CodeHighlightNode,
        HeadingNode,
        QuoteNode,
        TableNode,
        TableCellNode,
        TableRowNode,
        ImageNode,
    ],
    onError(error: Error) {
        throw error;
    },
    theme: theme,
};

type TProps = {
    onChange?: (contentString: string, editorState: EditorState) => void;
    initialContentJSON?: string;
    editorRef?: RefObject<LexicalEditor | null>;
    isViewOnly?: boolean;
};

export default function Editor({ onChange, initialContentJSON, editorRef, isViewOnly }: TProps) {
    const onChangeEditor = (editorState: EditorState) => {
        const editorStateJSON = editorState.toJSON();
        if (onChange) onChange(JSON.stringify(editorStateJSON), editorState);
    };
    return (
        <LexicalComposer initialConfig={{ ...editorConfig, editable: !isViewOnly }}>
            <EditorRefPlugin editorRef={editorRef} />
            <ToolbarContext>
                <div className="editor-container">
                    {!isViewOnly && <ToolbarPlugin />}
                    <div className="editor-inner">
                        <RichTextPlugin
                            contentEditable={
                                <ContentEditable
                                    className="editor-input"
                                    aria-placeholder={placeholder}
                                    placeholder={<div className="editor-placeholder">{placeholder}</div>}
                                />
                            }
                            ErrorBoundary={LexicalErrorBoundary}
                        />
                        {!isViewOnly && <FooterMetaPlugin />}
                        <LoadEditorContentPlugin json={initialContentJSON} />
                        <HistoryPlugin />
                        <AutoFocusPlugin />
                        {/* <TreeViewPlugin /> */}
                        <OnChangePlugin onChange={onChangeEditor} />
                        <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
                        <CodeHighlightPrismPlugin />
                        <ListPlugin hasStrictIndent={false} />
                        <CheckListPlugin />
                    </div>
                </div>
            </ToolbarContext>
        </LexicalComposer>
    );
}
