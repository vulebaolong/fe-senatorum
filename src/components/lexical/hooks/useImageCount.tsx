import { useEffect, useRef, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import { ImageNode } from "../nodes/ImageNode";

export function useImageCount() {
    const [editor] = useLexicalComposerContext();
    const keysRef = useRef<Set<string>>(new Set());
    const [count, setCount] = useState(0);

    useEffect(() => {
        return mergeRegister(
            editor.registerMutationListener(
                ImageNode,
                (mutations) => {
                    for (const [key, type] of mutations) {
                        if (type === "created") keysRef.current.add(key);
                        else if (type === "destroyed") keysRef.current.delete(key);
                    }
                    setCount(keysRef.current.size);
                },
                // NEW: lấy cả các ImageNode đang có sẵn ngay khi register
                { skipInitialization: false }
            )
        );
    }, [editor]);

    return count;
}
