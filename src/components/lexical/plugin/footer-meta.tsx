import React from "react";
import { MaxLengthPlugin } from "./MaxLengthPlugin";
import ImagePolicyIndicator from "./ImagePolicyIndicator";
import { Separator } from "@radix-ui/react-separator";
import { useAppSelector } from "@/redux/store";
import DragDropPaste from "./DragDropPastePlugin";

export default function FooterMetaPlugin() {
    const info = useAppSelector((state) => state.user.info);
    return (
        <div className="text-[10px] flex items-center gap-3 p-[10px] sticky -bottom-5 bg-background rounded-2xl">
            <MaxLengthPlugin maxCharacters={info?.maxCharacters || 0} />
            <Separator orientation="vertical" className="!w-[1px] !h-[15px] bg-border" />
            <ImagePolicyIndicator maxSizeImage={info?.maxSizeImage || 0} maxImagesCount={info?.maxImagesCount || 0} />
            <DragDropPaste />
        </div>
    );
}
