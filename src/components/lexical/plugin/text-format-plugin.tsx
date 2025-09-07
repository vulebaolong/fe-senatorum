import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { $isCodeNode } from "@lexical/code";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import { $getSelection, $isRangeSelection, COMMAND_PRIORITY_CRITICAL, FORMAT_TEXT_COMMAND, SELECTION_CHANGE_COMMAND } from "lexical";
import { Bold, Italic, Strikethrough, Underline } from "lucide-react";
import { useCallback, useEffect } from "react";
import { useToolbarState } from "../context/toolbar-context";
// nếu có TableSelection:

export default function TextFormatControls() {
    const [editor] = useLexicalComposerContext();
    const { toolbarState, updateToolbarState } = useToolbarState();

    const update = useCallback(() => {
        editor.getEditorState().read(() => {
            const selection = $getSelection();

            // mặc định: không format được
            let canFormat = false;
            let isBold = false;
            let isItalic = false;
            let isUnderline = false;
            let isStrikethrough = false;

            if ($isRangeSelection(selection)) {
                // với RangeSelection ta mới kiểm định dạng
                canFormat = true;

                // nếu caret nằm trong Code block -> không cho format inline
                const anchor = selection.anchor.getNode();
                const top = anchor.getTopLevelElementOrThrow();
                if ($isCodeNode(top)) {
                    canFormat = false;
                }

                if (canFormat) {
                    isBold = selection.hasFormat("bold");
                    isItalic = selection.hasFormat("italic");
                    isUnderline = selection.hasFormat("underline");
                    isStrikethrough = selection.hasFormat("strikethrough");
                }
            } else {
                // NodeSelection / TableSelection -> disable format
                canFormat = false;
            }

            // cập nhật context
            updateToolbarState("canFormat", canFormat);
            updateToolbarState("isBold", isBold);
            updateToolbarState("isItalic", isItalic);
            updateToolbarState("isUnderline", isUnderline);
            updateToolbarState("isStrikethrough", isStrikethrough);
        });
    }, [editor, updateToolbarState]);

    useEffect(() => {
        return mergeRegister(
            // chạy khi editorState thay đổi
            editor.registerUpdateListener(() => {
                update();
            }),
            // chạy ngay khi đổi selection/caret
            editor.registerCommand(
                SELECTION_CHANGE_COMMAND,
                () => {
                    update();
                    return false;
                },
                COMMAND_PRIORITY_CRITICAL
            )
        );
    }, [editor, update]);

    // helper giữ focus trong editor (tránh blur khi click)
    const keepFocus = (e: React.MouseEvent) => e.preventDefault();

    return (
        <>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                onMouseDown={keepFocus}
                aria-pressed={toolbarState.isBold}
                data-state={toolbarState.isBold ? "on" : "off"}
                disabled={!toolbarState.canFormat}
                className="size-8"
                title="Bold (⌘/Ctrl+B)"
                onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}
            >
                <Bold className={cn("h-4 w-4", toolbarState.isBold ? "text-primary" : "text-muted-foreground")} />
            </Button>

            <Button
                type="button"
                variant="ghost"
                size="icon"
                onMouseDown={keepFocus}
                aria-pressed={toolbarState.isItalic}
                data-state={toolbarState.isItalic ? "on" : "off"}
                disabled={!toolbarState.canFormat}
                className="size-8"
                title="Italic (⌘/Ctrl+I)"
                onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}
            >
                <Italic className={cn("h-4 w-4", toolbarState.isItalic ? "text-primary" : "text-muted-foreground")} />
            </Button>

            <Button
                type="button"
                variant="ghost"
                size="icon"
                onMouseDown={keepFocus}
                aria-pressed={toolbarState.isUnderline}
                data-state={toolbarState.isUnderline ? "on" : "off"}
                disabled={!toolbarState.canFormat}
                className="size-8"
                title="Underline (⌘/Ctrl+U)"
                onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")}
            >
                <Underline className={cn("h-4 w-4", toolbarState.isUnderline ? "text-primary" : "text-muted-foreground")} />
            </Button>

            <Button
                type="button"
                variant="ghost"
                size="icon"
                onMouseDown={keepFocus}
                aria-pressed={toolbarState.isStrikethrough}
                data-state={toolbarState.isStrikethrough ? "on" : "off"}
                disabled={!toolbarState.canFormat}
                className="size-8"
                title="Strikethrough (⌘/Ctrl+Shift+S)"
                onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough")}
            >
                <Strikethrough className={cn("h-4 w-4", toolbarState.isStrikethrough ? "text-primary" : "text-muted-foreground")} />
            </Button>
        </>
    );
}
