"use client";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { HeadingNode } from "@lexical/rich-text";
import ToolbarPlugin from "./plugin/toolbar/toolbar-plugin";
import { ListItemNode, ListNode } from "@lexical/list";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { BannerNode, BannerPlugin } from "./plugin/banner/banner-plugin";

const theme = {
    // Theme styling goes here
    //...
    banner: 'test-editor-banner',
};

function onError(error: Error): void {
    console.error(error);
}

export default function Editor() {
    const initialConfig = {
        namespace: "MyEditor",
        theme,
        onError,
        nodes: [HeadingNode, ListNode, ListItemNode, BannerNode],
    };

    return (
        <LexicalComposer initialConfig={initialConfig}>
            <RichTextPlugin
                contentEditable={
                    <ContentEditable
                        className="relative h-[500px] w-full border border-cyan-300"
                        aria-placeholder={"Enter some text..."}
                        placeholder={<div className="absolute top-1 left-1">Enter some text...</div>}
                    />
                }
                ErrorBoundary={LexicalErrorBoundary}
            />
            {/* giúp ctrl + z sẽ quay lại */}
            <HistoryPlugin />
            <ToolbarPlugin />
            <ListPlugin />
            <BannerPlugin />
        </LexicalComposer>
    );
}
