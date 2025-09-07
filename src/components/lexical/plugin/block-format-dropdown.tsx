import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { $isCodeNode } from "@lexical/code";
import { $isListNode } from "@lexical/list";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $isHeadingNode } from "@lexical/rich-text";
import { $getSelection, $isNodeSelection, $isRangeSelection } from "lexical";
import { JSX, useEffect } from "react";
import { blockTypeToBlockName, useToolbarState } from "../context/toolbar-context";
import { $findTopLevelElement } from "./toolbar-plugin/toolbar-plugin";
import {
    formatBulletList,
    formatCheckList,
    formatCode,
    formatHeading,
    formatNumberedList,
    formatParagraph,
    formatQuote,
} from "./toolbar-plugin/utils";

const SHORTCUTS = {
    NORMAL: "⌘+Opt+0",
    HEADING1: "⌘+Opt+1",
    HEADING2: "⌘+Opt+2",
    HEADING3: "⌘+Opt+3",
    NUMBERED_LIST: "⌘+⇧+7",
    BULLET_LIST: "⌘+⇧+8",
    CHECK_LIST: "⌘+⇧+9",
    QUOTE: "⇧+⌘+Q",
    CODE_BLOCK: "⌘+Opt+C",
};

export default function BlockFormatDropDown(): JSX.Element {
    const [editor] = useLexicalComposerContext();
    const { toolbarState, updateToolbarState } = useToolbarState();

    useEffect(() => {
        return editor.registerUpdateListener(({ editorState }) => {
            editorState.read(() => {
                const selection = $getSelection();

                if ($isRangeSelection(selection)) {
                    const anchorNode = selection.anchor.getNode();
                    const element = $findTopLevelElement(anchorNode);

                    if ($isListNode(element)) {
                        const type = element.getListType();
                        updateToolbarState("blockType", type);
                    } else if ($isHeadingNode(element)) {
                        updateToolbarState("blockType", element.getTag());
                    } else if ($isCodeNode(element)) {
                        updateToolbarState("blockType", "code");
                        updateToolbarState("codeLanguage", element.getLanguage() ?? "");
                    } else {
                        updateToolbarState("blockType", element.getType() as keyof typeof blockTypeToBlockName);
                    }
                }

                if ($isNodeSelection(selection)) {
                    const nodes = selection.getNodes();
                    for (const node of nodes) {
                        const element = $findTopLevelElement(node);
                        if ($isListNode(element)) {
                            updateToolbarState("blockType", element.getListType());
                        } else if ($isHeadingNode(element)) {
                            updateToolbarState("blockType", element.getTag());
                        } else if ($isCodeNode(element)) {
                            updateToolbarState("blockType", "code");
                            updateToolbarState("codeLanguage", element.getLanguage() ?? "");
                        } else {
                            updateToolbarState("blockType", element.getType() as keyof typeof blockTypeToBlockName);
                        }
                    }
                }
            });
        });
    }, [editor, updateToolbarState]);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                    {/* <AudioLines /> {blockTypeToBlockName[toolbarState.blockType] ?? "Formatting"} */}
                    {blockTypeToBlockName[toolbarState.blockType] ?? "Formatting"}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
                <DropdownMenuLabel>Formatting</DropdownMenuLabel>

                <DropdownMenuItem onClick={() => formatParagraph(editor)}>Normal</DropdownMenuItem>

                <DropdownMenuItem onClick={() => formatHeading(editor, toolbarState.blockType, "h1")}>Heading 1</DropdownMenuItem>

                <DropdownMenuItem onClick={() => formatHeading(editor, toolbarState.blockType, "h2")}>Heading 2</DropdownMenuItem>

                <DropdownMenuItem onClick={() => formatHeading(editor, toolbarState.blockType, "h3")}>Heading 3</DropdownMenuItem>

                <DropdownMenuItem onClick={() => formatHeading(editor, toolbarState.blockType, "h4")}>Heading 4</DropdownMenuItem>

                <DropdownMenuItem onClick={() => formatHeading(editor, toolbarState.blockType, "h5")}>Heading 5</DropdownMenuItem>

                <DropdownMenuItem onClick={() => formatHeading(editor, toolbarState.blockType, "h6")}>Heading 6</DropdownMenuItem>

                <DropdownMenuItem onClick={() => formatNumberedList(editor, toolbarState.blockType)}>Numbered List</DropdownMenuItem>

                <DropdownMenuItem onClick={() => formatBulletList(editor, toolbarState.blockType)}>Bullet List</DropdownMenuItem>

                <DropdownMenuItem onClick={() => formatCheckList(editor, toolbarState.blockType)}>Check List</DropdownMenuItem>

                <DropdownMenuItem onClick={() => formatQuote(editor, toolbarState.blockType)}>Quote</DropdownMenuItem>

                <DropdownMenuItem onClick={() => formatCode(editor, toolbarState.blockType)}>Code Block</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
