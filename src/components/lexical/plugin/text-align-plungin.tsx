import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, $isElementNode, $isNodeSelection, $isRangeSelection, FORMAT_ELEMENT_COMMAND } from "lexical";
import { AlignCenter, AlignJustify, AlignLeft, AlignRight } from "lucide-react";
import { useEffect } from "react";
import { useToolbarState } from "../context/toolbar-context";
import { $findTopLevelElement } from "./toolbar-plugin/toolbar-plugin";

export default function TextAlignPlugin() {
    const [editor] = useLexicalComposerContext();
    const { toolbarState, updateToolbarState } = useToolbarState();

    useEffect(() => {
        return editor.registerUpdateListener(({ editorState }) => {
            editorState.read(() => {
                const selection = $getSelection();

                if ($isRangeSelection(selection)) {
                    const node = selection.anchor.getNode();
                    const topElement = $findTopLevelElement(node);
                    if ($isElementNode(topElement)) {
                        updateToolbarState("elementFormat", topElement.getFormatType());
                    }
                }

                if ($isNodeSelection(selection)) {
                    const nodes = selection.getNodes();
                    for (const selectedNode of nodes) {
                        const topElement = $findTopLevelElement(selectedNode);
                        if ($isElementNode(topElement)) {
                            updateToolbarState("elementFormat", topElement.getFormatType());
                        }
                    }
                }
            });
        });
    }, [editor, updateToolbarState]);

    return (
        <>
            <Button
                type="button"
                onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left")}
                aria-label="Left Align"
                variant="ghost"
                size="icon"
                className={cn("size-8", toolbarState.elementFormat === "left" && "bg-border")}
            >
                <AlignLeft className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center")}
                aria-label="Center Align"
                variant="ghost"
                size="icon"
                className={cn("size-8", toolbarState.elementFormat === "center" && "bg-border")}
            >
                <AlignCenter className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right")}
                aria-label="Right Align"
                variant="ghost"
                size="icon"
                className={cn("size-8", toolbarState.elementFormat === "right" && "bg-border")}
            >
                <AlignRight className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify")}
                aria-label="Justify Align"
                variant="ghost"
                size="icon"
                className={cn("size-8", toolbarState.elementFormat === "justify" && "bg-border")}
            >
                <AlignJustify className="h-4 w-4" />
            </Button>
        </>
    );
}
