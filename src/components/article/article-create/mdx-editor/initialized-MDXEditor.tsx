"use client";
// InitializedMDXEditor.tsx
import {
    BlockTypeSelect,
    BoldItalicUnderlineToggles,
    ChangeCodeMirrorLanguage,
    codeBlockPlugin,
    codeMirrorPlugin,
    CodeToggle,
    ConditionalContents,
    CreateLink,
    diffSourcePlugin,
    DiffSourceToggleWrapper,
    headingsPlugin,
    imagePlugin,
    InsertCodeBlock,
    InsertImage,
    InsertSandpack,
    InsertTable,
    InsertThematicBreak,
    linkDialogPlugin,
    linkPlugin,
    listsPlugin,
    ListsToggle,
    markdownShortcutPlugin,
    MDXEditor,
    quotePlugin,
    SandpackConfig,
    sandpackPlugin,
    ShowSandpackInfo,
    tablePlugin,
    thematicBreakPlugin,
    toolbarPlugin,
    UndoRedo,
    type MDXEditorMethods,
    type MDXEditorProps,
} from "@mdxeditor/editor";
import { useTheme } from "next-themes";
import type { ForwardedRef } from "react";

const defaultSnippetContent = `
export default function App() {
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
    </div>
  );
}
`.trim();

const simpleSandpackConfig: SandpackConfig = {
    defaultPreset: "react",
    presets: [
        {
            label: "React",
            name: "react",
            meta: "live react",
            sandpackTemplate: "react",
            sandpackTheme: "light",
            snippetFileName: "/App.js",
            snippetLanguage: "jsx",
            initialSnippetContent: defaultSnippetContent,
        },
    ],
};

const ToolbarDivider = () => <div className="w-px h-5 bg-gray-300" />;

export default function InitializedMDXEditor({ editorRef, ...props }: { editorRef: ForwardedRef<MDXEditorMethods> | null } & MDXEditorProps) {
    const { theme } = useTheme();

    return (
        <MDXEditor
            className={`${theme === "dark" && "dark-theme dark-editor"} dark:bg-zinc-900 border border-input rounded-md h-full pb-2.5`}
            plugins={[
                // Example Plugin Usage
                headingsPlugin(),
                listsPlugin(),
                quotePlugin(),
                markdownShortcutPlugin(),
                diffSourcePlugin(),
                linkDialogPlugin(),
                linkPlugin(),
                tablePlugin(),
                thematicBreakPlugin(),

                codeBlockPlugin({ defaultCodeBlockLanguage: "js" }),
                sandpackPlugin({ sandpackConfig: simpleSandpackConfig }),
                codeMirrorPlugin({ codeBlockLanguages: { js: "JavaScript", css: "CSS" } }),

                imagePlugin({
                    imageUploadHandler: async (image: File) => {
                        const formData = new FormData();
                        formData.append("image", image);
                        // send the file to your server and return
                        // the URL of the uploaded image in the response
                        const response = await fetch("/uploads/new", {
                            method: "POST",
                            body: formData,
                        });
                        const json = (await response.json()) as { url: string };
                        return json.url;
                    },
                    imageAutocompleteSuggestions: ["https://picsum.photos/200/300", "https://picsum.photos/200"],
                }),
                toolbarPlugin({
                    toolbarContents: () => (
                        <DiffSourceToggleWrapper>
                            <UndoRedo />
                            <ToolbarDivider />

                            <BoldItalicUnderlineToggles />
                            <CodeToggle />
                            <ToolbarDivider />

                            <ListsToggle />
                            <ToolbarDivider />

                            <BlockTypeSelect />
                            <ToolbarDivider />

                            <CreateLink />
                            <InsertImage />
                            <ToolbarDivider />

                            <InsertTable />
                            <InsertThematicBreak />
                            <ToolbarDivider />

                            <ConditionalContents
                                options={[
                                    { when: (editor) => editor?.editorType === "codeblock", contents: () => <ChangeCodeMirrorLanguage /> },
                                    { when: (editor) => editor?.editorType === "sandpack", contents: () => <ShowSandpackInfo /> },
                                    {
                                        fallback: () => (
                                            <>
                                                <InsertCodeBlock />
                                                <InsertSandpack />
                                            </>
                                        ),
                                    },
                                ]}
                            />
                        </DiffSourceToggleWrapper>
                    ),
                }),
            ]}
            {...props}
            ref={editorRef}
        />
    );
}
