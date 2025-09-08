/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { cn } from "@/lib/utils";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $trimTextContentFromAnchor } from "@lexical/selection";
import { $restoreEditorState } from "@lexical/utils";
import { $getSelection, $isRangeSelection, EditorState, RootNode } from "lexical";
import { JSX, useEffect } from "react";
import { useTextLength } from "../hooks/useTextLength";
import { Progress } from "@/components/ui/progress";

type TProps = {
    maxCharacters: number;
};

export function MaxLengthPlugin({ maxCharacters }: TProps): JSX.Element {
    const [editor] = useLexicalComposerContext();
    const textLen = useTextLength();

    useEffect(() => {
        let lastRestoredEditorState: EditorState | null = null;

        return editor.registerNodeTransform(RootNode, (rootNode: RootNode) => {
            const selection = $getSelection();
            if (!$isRangeSelection(selection) || !selection.isCollapsed()) {
                return;
            }
            const prevEditorState = editor.getEditorState();
            const prevTextContentSize = prevEditorState.read(() => rootNode.getTextContentSize());
            const textContentSize = rootNode.getTextContentSize();
            if (prevTextContentSize !== textContentSize) {
                const delCount = textContentSize - maxCharacters;
                const anchor = selection.anchor;

                if (delCount > 0) {
                    // Restore the old editor state instead if the last
                    // text content was already at the limit.
                    if (prevTextContentSize === maxCharacters && lastRestoredEditorState !== prevEditorState) {
                        lastRestoredEditorState = prevEditorState;
                        $restoreEditorState(editor, prevEditorState);
                    } else {
                        $trimTextContentFromAnchor(editor, anchor, delCount);
                    }
                }
            }
        });
    }, [editor, maxCharacters]);

    // UI tone + progress like your image counter
    const percent = maxCharacters > 0 ? Math.min(100, Math.round((textLen / maxCharacters) * 100)) : 0;

    const textTone = textLen >= maxCharacters ? "destructive" : textLen >= Math.floor(maxCharacters * 0.8) ? "warning" : "default";

    const progressTone =
        textTone === "destructive"
            ? "bg-red-100 [&>div]:bg-red-500"
            : textTone === "warning"
            ? "bg-amber-100 [&>div]:bg-amber-500"
            : "bg-muted [&>div]:bg-primary";

    return (
        <div>
            <p className={cn(textTone === "destructive" ? "text-red-500" : textTone === "warning" ? "text-amber-500" : "text-primary")}>
                {textLen}/<span className="text-[8px] text-muted-foreground">{maxCharacters <= 0 ? "??" : maxCharacters} characters</span>
            </p>

            <Progress value={percent} className={cn("h-[1px] w-full", progressTone)} />
        </div>
    );
}
