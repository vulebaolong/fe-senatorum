import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { $isCodeNode } from "@lexical/code";
import { $isListNode } from "@lexical/list";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $isHeadingNode } from "@lexical/rich-text";
import { $getSelection, $isNodeSelection, $isRangeSelection } from "lexical";
import { AudioLines } from "lucide-react";
import { JSX, useEffect } from "react";
import { blockTypeToBlockName, useToolbarState } from "../context/toolbar-context";
import { $findTopLevelElement, rootTypeToRootName } from "./toolbar-plugin/toolbar-plugin";
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
                    <AudioLines /> {blockTypeToBlockName[toolbarState.blockType] ?? "Formatting"}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
                <DropdownMenuLabel>Formatting</DropdownMenuLabel>

                <DropdownMenuItem onClick={() => formatParagraph(editor)}>
                    Normal
                    <DropdownMenuShortcut>{SHORTCUTS.NORMAL}</DropdownMenuShortcut>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => formatHeading(editor, toolbarState.blockType, "h1")}>
                    Heading 1<DropdownMenuShortcut>{SHORTCUTS.HEADING1}</DropdownMenuShortcut>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => formatHeading(editor, toolbarState.blockType, "h2")}>
                    Heading 2<DropdownMenuShortcut>{SHORTCUTS.HEADING2}</DropdownMenuShortcut>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => formatHeading(editor, toolbarState.blockType, "h3")}>
                    Heading 3<DropdownMenuShortcut>{SHORTCUTS.HEADING3}</DropdownMenuShortcut>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => formatNumberedList(editor, toolbarState.blockType)}>
                    Numbered List
                    <DropdownMenuShortcut>{SHORTCUTS.NUMBERED_LIST}</DropdownMenuShortcut>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => formatBulletList(editor, toolbarState.blockType)}>
                    Bullet List
                    <DropdownMenuShortcut>{SHORTCUTS.BULLET_LIST}</DropdownMenuShortcut>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => formatCheckList(editor, toolbarState.blockType)}>
                    Check List
                    <DropdownMenuShortcut>{SHORTCUTS.CHECK_LIST}</DropdownMenuShortcut>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => formatQuote(editor, toolbarState.blockType)}>
                    Quote
                    <DropdownMenuShortcut>{SHORTCUTS.QUOTE}</DropdownMenuShortcut>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => formatCode(editor, toolbarState.blockType)}>
                    Code Block
                    <DropdownMenuShortcut>{SHORTCUTS.CODE_BLOCK}</DropdownMenuShortcut>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
