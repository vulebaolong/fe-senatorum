import { Button } from "@/components/ui/button";
import { INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND } from "@lexical/list";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import React, { JSX } from "react";

export default function ListToolbarPlugin(): JSX.Element {
    const [editor] = useLexicalComposerContext();

    const headingTags: ("ul" | "ol")[] = ["ul", "ol"];

    const onClick = (tag: "ul" | "ol") => {
        if (tag === "ul") {
            editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
            return;
        }

        if (tag === "ol") {
            editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
            return;
        }
    };

    return (
        <div>
            {headingTags.map((tag: "ul" | "ol") => {
                return (
                    <Button
                        type="button"
                        key={tag}
                        onClick={() => {
                            onClick(tag);
                        }}
                    >
                        {tag}
                    </Button>
                );
            })}
        </div>
    );
}
