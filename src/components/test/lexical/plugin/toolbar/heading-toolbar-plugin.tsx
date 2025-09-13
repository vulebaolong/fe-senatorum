import { Button } from "@/components/ui/button";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createHeadingNode } from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";
import { $getSelection, $isRangeSelection } from "lexical";

export default function HeadingToolbarPlugin() {
    const [editor] = useLexicalComposerContext();

    const onClick = () => {
        editor.update(() => {
            const selection = $getSelection();

            if ($isRangeSelection(selection)) {
                $setBlocksType(selection, () => {
                    return $createHeadingNode("h1")
                });
            }
        });
    };

    return (
        <Button type="button" onClick={onClick}>
            heading
        </Button>
    );
}
