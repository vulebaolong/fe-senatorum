import { Button } from "@/components/ui/button";
import { $createCodeNode, registerCodeHighlighting } from "@lexical/code";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $wrapNodes } from "@lexical/selection";
import { $getSelection, $isRangeSelection } from "lexical";
import { Code } from "lucide-react";
import React, { useEffect } from "react";

export default function CodeBlockPlugin() {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        registerCodeHighlighting(editor);

        return () => {};
    }, []);

    const onAddCodeBlock = () => {
        editor.update(() => {
            const selection = $getSelection();

            if ($isRangeSelection(selection)) {
                $wrapNodes(selection, () => $createCodeNode());
            }
        });
    };

    return (
        <Button type="button" onClick={onAddCodeBlock} aria-label="Add Code Block" variant="ghost" size="icon" className="size-8">
            <Code className="h-4 w-4" />
        </Button>
    );
}
