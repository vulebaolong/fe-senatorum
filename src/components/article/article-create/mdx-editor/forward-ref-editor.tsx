"use client";

import { forwardRef } from "react";
import type { MDXEditorMethods, MDXEditorProps } from "@mdxeditor/editor";
import InitializedMDXEditor from "./initialized-MDXEditor";

export const ForwardRefEditor = forwardRef<MDXEditorMethods, MDXEditorProps>((props, ref) => {
    return <InitializedMDXEditor {...props} editorRef={ref} />;
});

ForwardRefEditor.displayName = "ForwardRefEditor";
