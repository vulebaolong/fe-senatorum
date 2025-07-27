import type {
    DOMConversionMap,
    DOMConversionOutput,
    DOMExportOutput,
    EditorConfig,
    LexicalNode,
    NodeKey,
    SerializedLexicalNode,
    Spread,
} from "lexical";
import type { JSX } from "react";

// import { HashtagNode } from "@lexical/hashtag";
// import { LinkNode } from "@lexical/link";
import { $applyNodeReplacement, DecoratorNode } from "lexical";
import ImageComponent from "./image-component";
// import * as React from "react";

// import { EmojiNode } from "./emoji-node";
// import { KeywordNode } from "./keyword-node";

// const ImageComponent = React.lazy(() => import("./ImageComponent"));

export interface ImagePayload {
    altText: string;
    height?: number;
    key?: NodeKey;
    maxWidth?: number;
    src: string;
    width?: number;
    //  caption?: LexicalEditor;
    //  showCaption?: boolean;
    //  captionsEnabled?: boolean;
}

function isGoogleDocCheckboxImg(img: HTMLImageElement): boolean {
    return (
        img.parentElement != null &&
        img.parentElement.tagName === "LI" &&
        img.previousSibling === null &&
        img.getAttribute("aria-roledescription") === "checkbox"
    );
}

export function $createImageNode({
    altText,
    height,
    maxWidth = 500,
    src,
    width,
    key,
}: //  showCaption,
//  caption,
//  captionsEnabled,
ImagePayload): ImageNode {
    //  return $applyNodeReplacement(new ImageNode(src, altText, maxWidth, width, height, showCaption, caption, captionsEnabled, key));
    return $applyNodeReplacement(new ImageNode(src, altText, maxWidth, width, height, key));
}

export function $isImageNode(node: LexicalNode | null | undefined): node is ImageNode {
    return node instanceof ImageNode;
}

function $convertImageElement(domNode: Node): null | DOMConversionOutput {
    const img = domNode as HTMLImageElement;
    if (img.src.startsWith("file:///") || isGoogleDocCheckboxImg(img)) {
        return null;
    }
    const { alt: altText, src, width, height } = img;
    const node = $createImageNode({ altText, height, src, width });
    return { node };
}

export type SerializedImageNode = Spread<
    {
        altText: string;
        height?: number;
        maxWidth: number;
        src: string;
        width?: number;
        //   caption: SerializedEditor;
        //   showCaption: boolean;
    },
    SerializedLexicalNode
>;

export class ImageNode extends DecoratorNode<JSX.Element> {
    __src: string;
    __altText: string;
    __width: "inherit" | number;
    __height: "inherit" | number;
    __maxWidth: number;
    //  __showCaption: boolean;
    //  __caption: LexicalEditor;
    //  // Captions cannot yet be used within editor cells
    //  __captionsEnabled: boolean;

    static getType(): string {
        return "image";
    }

    static clone(node: ImageNode): ImageNode {
        return new ImageNode(
            node.__src,
            node.__altText,
            node.__maxWidth,
            node.__width,
            node.__height,
            node.__key
            // node.__showCaption,
            // node.__caption,
            // node.__captionsEnabled,
        );
    }

    static importJSON(serializedNode: SerializedImageNode): ImageNode {
        //   const { altText, height, width, maxWidth, src, showCaption } = serializedNode;
        // return $createImageNode({
        //    altText,
        //    height,
        //    maxWidth,
        //    showCaption,
        //    src,
        //    width,
        // }).updateFromJSON(serializedNode);
        const { altText, height, width, maxWidth, src } = serializedNode;
        return $createImageNode({
            altText,
            height,
            maxWidth,
            src,
            width,
        }).updateFromJSON(serializedNode);
    }

    //  updateFromJSON(serializedNode: LexicalUpdateJSON<SerializedImageNode>): this {
    //      const node = super.updateFromJSON(serializedNode);
    //      const { caption } = serializedNode;

    //      const nestedEditor = node.__caption;
    //      const editorState = nestedEditor.parseEditorState(caption.editorState);
    //      if (!editorState.isEmpty()) {
    //          nestedEditor.setEditorState(editorState);
    //      }
    //      return node;
    //  }

    static importDOM(): DOMConversionMap | null {
        return {
            img: () => ({
                conversion: $convertImageElement,
                priority: 0,
            }),
        };
    }

    constructor(
        src: string,
        altText: string,
        maxWidth: number,
        width?: "inherit" | number,
        height?: "inherit" | number,
        //   showCaption?: boolean,
        //   caption?: LexicalEditor,
        //   captionsEnabled?: boolean,
        key?: NodeKey
    ) {
        super(key);
        this.__src = src;
        this.__altText = altText;
        this.__maxWidth = maxWidth;
        this.__width = width || "inherit";
        this.__height = height || "inherit";
        //   this.__showCaption = showCaption || false;
        //   this.__caption =
        //       caption ||
        //       createEditor({
        //           namespace: "Playground/ImageNodeCaption",
        //           nodes: [RootNode, TextNode, LineBreakNode, ParagraphNode, LinkNode, EmojiNode, HashtagNode, KeywordNode],
        //       });
        //   this.__captionsEnabled = captionsEnabled || captionsEnabled === undefined;
    }

    exportJSON(): SerializedImageNode {
        return {
            ...super.exportJSON(),
            altText: this.getAltText(),
            height: this.__height === "inherit" ? 0 : this.__height,
            maxWidth: this.__maxWidth,
            src: this.getSrc(),
            width: this.__width === "inherit" ? 0 : this.__width,
            // showCaption: this.__showCaption,
            // caption: this.__caption.toJSON(),
        };
    }

    setWidthAndHeight(width: "inherit" | number, height: "inherit" | number): void {
        const writable = this.getWritable();
        writable.__width = width;
        writable.__height = height;
    }

    //  setShowCaption(showCaption: boolean): void {
    //      const writable = this.getWritable();
    //      writable.__showCaption = showCaption;
    //  }

    // View

    createDOM(config: EditorConfig): HTMLElement {
        const span = document.createElement("span");
        const theme = config.theme;
        const className = theme.image;
        if (className !== undefined) {
            span.className = className;
        }
        return span;
    }

    exportDOM(): DOMExportOutput {
        const element = document.createElement("img");
        element.setAttribute("src", this.__src);
        element.setAttribute("alt", this.__altText);
        element.setAttribute("width", this.__width.toString());
        element.setAttribute("height", this.__height.toString());
        return { element };
    }

    updateDOM(): false {
        return false;
    }

    getSrc(): string {
        return this.__src;
    }

    getAltText(): string {
        return this.__altText;
    }

    decorate(): JSX.Element {
        return (
            <ImageComponent
                src={this.__src}
                altText={this.__altText}
                width={this.__width}
                height={this.__height}
                maxWidth={this.__maxWidth}
                nodeKey={this.getKey()}
                resizable={true}
                //  showCaption={this.__showCaption}
                //  caption={this.__caption}
                //  captionsEnabled={this.__captionsEnabled}
            />
        );
    }
}
