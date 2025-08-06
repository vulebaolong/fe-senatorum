/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { Separator } from "@/components/ui/separator";
import { CODE_LANGUAGE_MAP } from "@lexical/code";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $findMatchingParent } from "@lexical/utils";
import { $isRootOrShadowRoot, LexicalNode } from "lexical";
import { useRef, useState } from "react";
import { blockTypeToBlockName, useToolbarState } from "../../context/toolbar-context";
import BlockFormatDropDown from "../block-format-dropdown";
import ImagesPlugin from "../images-plugin";
import TextAlignPlugin from "../text-align-plungin";
import TextFormatControls from "../text-format-plugin";
import UndoRedoPlugin from "../undo-redo-plugin";
import CodeHighlightPrismPlugin from "../code-highlight-prism-plugin";

export function normalizeCodeLang(lang: string) {
    return CODE_LANGUAGE_MAP[lang] || lang;
}

export function $findTopLevelElement(node: LexicalNode) {
    let topLevelElement =
        node.getKey() === "root"
            ? node
            : $findMatchingParent(node, (e) => {
                  const parent = e.getParent();
                  return parent !== null && $isRootOrShadowRoot(parent);
              });

    if (topLevelElement === null) {
        topLevelElement = node.getTopLevelElementOrThrow();
    }
    return topLevelElement;
}

export const rootTypeToRootName = {
    root: "Root",
    table: "Table",
};

export default function ToolbarPlugin() {
    const { toolbarState } = useToolbarState();
    const toolbarRef = useRef(null);

    return (
        <div
            className="flex items-center gap-0.5 rounded-tl-xl rounded-tr-2xl p-0.5 sticky top-0 z-10 bg-background border-b"
            ref={toolbarRef}
        >
            <UndoRedoPlugin />

            {toolbarState.blockType in blockTypeToBlockName &&  <BlockFormatDropDown />}
            <CodeHighlightPrismPlugin />

            <Separator orientation="vertical" className="h-[20px!important]" />

            <TextFormatControls />

            <Separator orientation="vertical" className="h-[20px!important]" />

            <TextAlignPlugin />

            <ImagesPlugin />
        </div>
    );
}
