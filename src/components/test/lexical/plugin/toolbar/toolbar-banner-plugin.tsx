import { Button } from "@/components/ui/button";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import React, { JSX } from "react";
import { INSERT_BANNER_COMMAND } from "../banner/banner-plugin";

export default function ToolbarBannerPlugin(): JSX.Element {
    const [editor] = useLexicalComposerContext();

    const onClick = (e: React.MouseEvent): void => {
        editor.dispatchCommand(INSERT_BANNER_COMMAND, undefined);
    };

    return <Button onClick={onClick}>Banner</Button>;
}
