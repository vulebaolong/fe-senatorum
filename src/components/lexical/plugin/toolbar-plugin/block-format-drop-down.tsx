import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LexicalEditor } from "lexical";
import { AudioLines } from "lucide-react";
import { JSX } from "react";
import { blockTypeToBlockName } from "../../context/toolbar-context";
import { rootTypeToRootName } from "./toolbar-plugin";
import { formatBulletList, formatCheckList, formatCode, formatHeading, formatNumberedList, formatParagraph, formatQuote } from "./utils";

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

type TProps = {
    blockType: keyof typeof blockTypeToBlockName;
    rootType: keyof typeof rootTypeToRootName;
    editor: LexicalEditor;
    disabled?: boolean;
};

export default function BlockFormatDropDown({ editor, blockType }: TProps): JSX.Element {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                    <AudioLines /> {blockTypeToBlockName[blockType] ?? "Formatting"}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
                <DropdownMenuLabel>Formatting</DropdownMenuLabel>

                <DropdownMenuItem onClick={() => formatParagraph(editor)}>
                    Normal
                    <DropdownMenuShortcut>{SHORTCUTS.NORMAL}</DropdownMenuShortcut>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => formatHeading(editor, blockType, "h1")}>
                    Heading 1<DropdownMenuShortcut>{SHORTCUTS.HEADING1}</DropdownMenuShortcut>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => formatHeading(editor, blockType, "h2")}>
                    Heading 2<DropdownMenuShortcut>{SHORTCUTS.HEADING2}</DropdownMenuShortcut>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => formatHeading(editor, blockType, "h3")}>
                    Heading 3<DropdownMenuShortcut>{SHORTCUTS.HEADING3}</DropdownMenuShortcut>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => formatNumberedList(editor, blockType)}>
                    Numbered List
                    <DropdownMenuShortcut>{SHORTCUTS.NUMBERED_LIST}</DropdownMenuShortcut>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => formatBulletList(editor, blockType)}>
                    Bullet List
                    <DropdownMenuShortcut>{SHORTCUTS.BULLET_LIST}</DropdownMenuShortcut>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => formatCheckList(editor, blockType)}>
                    Check List
                    <DropdownMenuShortcut>{SHORTCUTS.CHECK_LIST}</DropdownMenuShortcut>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => formatQuote(editor, blockType)}>
                    Quote
                    <DropdownMenuShortcut>{SHORTCUTS.QUOTE}</DropdownMenuShortcut>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => formatCode(editor, blockType)}>
                    Code Block
                    <DropdownMenuShortcut>{SHORTCUTS.CODE_BLOCK}</DropdownMenuShortcut>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
