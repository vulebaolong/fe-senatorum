import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $setBlocksType } from "@lexical/selection";
import {
    $createParagraphNode,
    $getSelection,
    $isRangeSelection,
    COMMAND_PRIORITY_EDITOR,
    COMMAND_PRIORITY_LOW,
    createCommand,
    EditorConfig,
    ElementNode,
    LexicalEditor,
    LexicalNode,
    NodeKey,
    RangeSelection,
} from "lexical";
import { JSX } from "react";

export class BannerNode extends ElementNode {
    // constructor(key?: NodeKey) {
    //     super();
    // }

    static getType(): string {
        return "banner";
    }

    static clone(node: BannerNode): BannerNode {
        return new BannerNode(node.__key);
    }

    createDOM(_config: EditorConfig, _editor: LexicalEditor): HTMLElement {
        const element = document.createElement("div");
        element.className = _config.theme.banner;
        return element;
    }

    updateDOM(_prevNode: unknown, _dom: HTMLElement, _config: EditorConfig): boolean {
        return false;
    }

    insertNewAfter(selection: RangeSelection, restoreSelection?: boolean): null | LexicalNode {
        const newBlock = $createParagraphNode();
        const direction = this.getDirection();
        newBlock.setDirection(direction);
        this.insertAfter(newBlock, restoreSelection);
        return newBlock;
    }

    collapseAtStart(): boolean {
        const paragraph = $createParagraphNode();
        const children = this.getChildren();
        children.forEach((child) => paragraph.append(child));
        this.replace(paragraph);
        return true;
    }
}

export function $createBannerNode(): BannerNode {
    return new BannerNode();
}

export function $isBannerNode(node: LexicalNode): node is BannerNode {
    return node instanceof BannerNode;
}

export const INSERT_BANNER_COMMAND = createCommand("insert-banner");

export function BannerPlugin(): null {
    const [editor] = useLexicalComposerContext();
    if (!editor.hasNodes([BannerNode])) {
        throw new Error("BannerPlugin: BannerNode not registered on editor");
    }
    editor.registerCommand(
        INSERT_BANNER_COMMAND,
        () => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                $setBlocksType(selection, $createBannerNode);
            }
            return true;
        },
        COMMAND_PRIORITY_LOW
    );

    return null;
}
