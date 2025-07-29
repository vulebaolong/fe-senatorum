import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { Bold, Italic, Underline, Strikethrough } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToolbarState } from "../context/toolbar-context";
import { useEffect } from "react";
import { $isTableSelection } from "@lexical/table";

export default function TextFormatControls() {
    const [editor] = useLexicalComposerContext();
    const { toolbarState, updateToolbarState } = useToolbarState();

    useEffect(() => {
        return editor.registerUpdateListener(({ editorState }) => {
            editorState.read(() => {
                const selection = $getSelection();
                if ($isRangeSelection(selection) || $isTableSelection(selection)) {
                    updateToolbarState("isBold", selection.hasFormat("bold"));
                    updateToolbarState("isItalic", selection.hasFormat("italic"));
                    updateToolbarState("isUnderline", selection.hasFormat("underline"));
                    updateToolbarState("isStrikethrough", selection.hasFormat("strikethrough"));
                }
            });
        });
    }, [editor, updateToolbarState]);

    return (
        <>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                className={cn("size-8", toolbarState.isBold && "bg-border")}
                onClick={() => {
                    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
                }}
            >
                <Bold color={toolbarState.isBold ? "var(--primary)" : "#ccc"} />
            </Button>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                className={cn("size-8", toolbarState.isItalic && "bg-border")}
                onClick={() => {
                    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
                }}
            >
                <Italic color={toolbarState.isItalic ? "var(--primary)" : "#ccc"} />
            </Button>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                className={cn("size-8", toolbarState.isUnderline && "bg-border")}
                onClick={() => {
                    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
                }}
            >
                <Underline color={toolbarState.isUnderline ? "var(--primary)" : "#ccc"} />
            </Button>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                className={cn("size-8", toolbarState.isStrikethrough && "bg-border")}
                onClick={() => {
                    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
                }}
            >
                <Strikethrough color={toolbarState.isStrikethrough ? "var(--primary)" : "#ccc"} />
            </Button>
        </>
    );
}
