/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import {
    $getSelection,
    $isRangeSelection,
    CAN_REDO_COMMAND,
    CAN_UNDO_COMMAND,
    COMMAND_PRIORITY_CRITICAL,
    COMMAND_PRIORITY_LOW,
    FORMAT_ELEMENT_COMMAND,
    FORMAT_TEXT_COMMAND,
    REDO_COMMAND,
    SELECTION_CHANGE_COMMAND,
    UNDO_COMMAND,
} from "lexical";
import { AlignCenter, AlignJustify, AlignLeft, AlignRight, Bold, Italic, RotateCcw, RotateCw, Strikethrough, Underline } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { blockTypeToBlockName, useToolbarState } from "../../context/toolbar-context";
import ImagesPlugin from "../images-plugin";
import BlockFormatDropDown from "./block-format-drop-down";

export const rootTypeToRootName = {
    root: "Root",
    table: "Table",
};

export default function ToolbarPlugin() {
    const [editor] = useLexicalComposerContext();

    const { toolbarState } = useToolbarState();
    const [isEditable] = useState(() => editor.isEditable());

    const [activeEditor, setActiveEditor] = useState(editor);
    const toolbarRef = useRef(null);
    const [canUndo, setCanUndo] = useState(false);
    const [canRedo, setCanRedo] = useState(false);
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderline, setIsUnderline] = useState(false);
    const [isStrikethrough, setIsStrikethrough] = useState(false);

    const $updateToolbar = useCallback(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
            // Update text format
            setIsBold(selection.hasFormat("bold"));
            setIsItalic(selection.hasFormat("italic"));
            setIsUnderline(selection.hasFormat("underline"));
            setIsStrikethrough(selection.hasFormat("strikethrough"));
        }
    }, []);

    useEffect(() => {
        return editor.registerCommand(
            SELECTION_CHANGE_COMMAND,
            (_payload, newEditor) => {
                setActiveEditor(newEditor);
                $updateToolbar();
                return false;
            },
            COMMAND_PRIORITY_CRITICAL
        );
    }, [editor, $updateToolbar, setActiveEditor]);

    useEffect(() => {
        activeEditor.getEditorState().read(() => {
            $updateToolbar();
        });
    }, [activeEditor, $updateToolbar]);

    useEffect(() => {
        return mergeRegister(
            editor.registerUpdateListener(({ editorState }) => {
                editorState.read(() => {
                    $updateToolbar();
                });
            }),
            editor.registerCommand(
                SELECTION_CHANGE_COMMAND,
                () => {
                    $updateToolbar();
                    return false;
                },
                COMMAND_PRIORITY_LOW
            ),
            editor.registerCommand(
                CAN_UNDO_COMMAND,
                (payload) => {
                    setCanUndo(payload);
                    return false;
                },
                COMMAND_PRIORITY_LOW
            ),
            editor.registerCommand(
                CAN_REDO_COMMAND,
                (payload) => {
                    setCanRedo(payload);
                    return false;
                },
                COMMAND_PRIORITY_LOW
            )
        );
    }, [editor, $updateToolbar]);

    return (
        <div className="flex items-center gap-0.5 rounded-tl-md rounded-tr-md p-0.5" ref={toolbarRef}>
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
            {/* <ToggleGroup variant="default" type="multiple" size="sm">
                <ToggleGroupItem
                    value="Undo"
                    disabled={!canUndo}
                    onClick={() => {
                        editor.dispatchCommand(UNDO_COMMAND, undefined);
                    }}
                    aria-label="Undo"
                >
                    <RotateCcw className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem
                    disabled={!canRedo}
                    onClick={() => {
                        editor.dispatchCommand(REDO_COMMAND, undefined);
                    }}
                    value="Redo"
                    aria-label="Redo"
                >
                    <RotateCw className="h-4 w-4" />
                </ToggleGroupItem>
            </ToggleGroup> */}

            <Separator orientation="vertical" className="h-[20px!important]" />

            <Button
                type="button"
                variant="ghost"
                size="icon"
                className={cn("size-8", isBold && "bg-border")}
                onClick={() => {
                    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
                }}
            >
                <Bold color={isBold ? "var(--primary)" : "#ccc"} />
            </Button>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                className={cn("size-8", isItalic && "bg-border")}
                onClick={() => {
                    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
                }}
            >
                <Italic color={isItalic ? "var(--primary)" : "#ccc"} />
            </Button>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                className={cn("size-8", isUnderline && "bg-border")}
                onClick={() => {
                    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
                }}
            >
                <Underline color={isUnderline ? "var(--primary)" : "#ccc"} />
            </Button>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                className={cn("size-8", isStrikethrough && "bg-border")}
                onClick={() => {
                    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
                }}
            >
                <Strikethrough color={isStrikethrough ? "var(--primary)" : "#ccc"} />
            </Button>

            <Separator orientation="vertical" className="h-[20px!important]" />

            <Button
                type="button"
                onClick={() => {
                    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left");
                }}
                aria-label="Left Align"
                variant="ghost"
                size="icon"
                className="size-8"
            >
                <AlignLeft className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                onClick={() => {
                    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center");
                }}
                aria-label="Center Align"
                variant="ghost"
                size="icon"
                className="size-8"
            >
                <AlignCenter className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                onClick={() => {
                    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right");
                }}
                aria-label="Right Align"
                variant="ghost"
                size="icon"
                className="size-8"
            >
                <AlignRight className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                onClick={() => {
                    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify");
                }}
                aria-label="justify Align"
                variant="ghost"
                size="icon"
                className="size-8"
            >
                <AlignJustify className="h-4 w-4" />
            </Button>

            {toolbarState.blockType in blockTypeToBlockName && activeEditor === editor && (
                <>
                    <BlockFormatDropDown
                        disabled={!isEditable}
                        blockType={toolbarState.blockType}
                        rootType={toolbarState.rootType}
                        editor={activeEditor}
                    />
                </>
            )}

            <ImagesPlugin />
        </div>
    );
}
