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
import "./style.css";

import { HorizontalRuleNode } from "@lexical/react/LexicalHorizontalRuleNode";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { MyOnChangePlugin } from "./plugin/my-onchange-plugin";
import ToolbarPlugin from "./plugin/toolbar-plugin/toolbar-plugin";
import TreeViewPlugin from "./plugin/tree-view-plugin";
import { parseAllowedColor, parseAllowedFontSize } from "./style-config";
import { theme } from "./theme";
import { CodeNode } from "@lexical/code";
import { LinkNode, AutoLinkNode } from "@lexical/link";
import { ListNode, ListItemNode } from "@lexical/list";
import { TableNode, TableCellNode, TableRowNode } from "@lexical/table";
import { TRANSFORMERS } from "@lexical/markdown";
import { ToolbarContext } from "./context/toolbar-context";
import { Separator } from "../ui/separator";
import { ImageNode } from "./nodes/image-node";

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

const editorConfig = {
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
        HeadingNode,
        QuoteNode,
        TableNode,
        TableCellNode,
        TableRowNode,
        ImageNode
    ],
    onError(error: Error) {
        throw error;
    },
    theme: theme,
};

type TProps = {
    onChange: (contentString: string, editorState: EditorState) => void;
};

export default function Editor({ onChange }: TProps) {
    const onChangeEditor = (editorState: EditorState) => {
        // Call toJSON on the EditorState object, which produces a serialization safe string
        const editorStateJSON = editorState.toJSON();
        // However, we still have a JavaScript object, so we need to convert it to an actual string with JSON.stringify
        onChange(JSON.stringify(editorStateJSON), editorState);
    };
    return (
        <LexicalComposer initialConfig={editorConfig}>
            <ToolbarContext>
                <div className="editor-container">
                    <ToolbarPlugin />
                    <Separator orientation="horizontal" />
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
                        <HistoryPlugin />
                        <AutoFocusPlugin />
                        <TreeViewPlugin />
                        <MyOnChangePlugin onChange={onChangeEditor} />
                        <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
                    </div>
                </div>
            </ToolbarContext>
        </LexicalComposer>
    );
}
