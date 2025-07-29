import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RotateCcw, RotateCw } from "lucide-react";
import { CAN_REDO_COMMAND, CAN_UNDO_COMMAND, REDO_COMMAND, UNDO_COMMAND, COMMAND_PRIORITY_LOW } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

export default function UndoRedoPlugin() {
    const [editor] = useLexicalComposerContext();
    const [canUndo, setCanUndo] = useState(false);
    const [canRedo, setCanRedo] = useState(false);

    useEffect(() => {
        return editor.registerCommand(
            CAN_UNDO_COMMAND,
            (payload) => {
                setCanUndo(payload);
                return false;
            },
            COMMAND_PRIORITY_LOW
        );
    }, [editor]);

    useEffect(() => {
        return editor.registerCommand(
            CAN_REDO_COMMAND,
            (payload) => {
                setCanRedo(payload);
                return false;
            },
            COMMAND_PRIORITY_LOW
        );
    }, [editor]);

    return (
        <>
            <Button
                disabled={!canUndo}
                type="button"
                variant="ghost"
                size="icon"
                className={cn("size-8")}
                onClick={() => {
                    editor.dispatchCommand(UNDO_COMMAND, undefined);
                }}
            >
                <RotateCcw />
            </Button>
            <Button
                disabled={!canRedo}
                type="button"
                variant="ghost"
                size="icon"
                className={cn("size-8")}
                onClick={() => {
                    editor.dispatchCommand(REDO_COMMAND, undefined);
                }}
            >
                <RotateCw />
            </Button>
        </>
    );
}
