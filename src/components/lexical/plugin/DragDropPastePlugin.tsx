/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { DRAG_DROP_PASTE } from "@lexical/rich-text";
import { isMimeType, mediaFileReader } from "@lexical/utils";
import { COMMAND_PRIORITY_LOW } from "lexical";
import { useEffect } from "react";

import { toast } from "sonner";
import { useImageCount } from "../hooks/useImageCount";
import { INSERT_IMAGE_COMMAND } from "./ImagesPlugin";
import { useAppSelector } from "@/redux/store";

export const ACCEPTABLE_IMAGE_TYPES = ["image/", "image/heic", "image/heif", "image/gif", "image/webp"];

export default function DragDropPaste(): null {
    const info = useAppSelector((state) => state.user.info);
    const [editor] = useLexicalComposerContext();
    const imageCount = useImageCount();

    useEffect(() => {
        if (!info?.maxImagesCount) return;
        if (!info?.maxSizeImage) return;

        return editor.registerCommand(
            DRAG_DROP_PASTE,
            (files) => {
                (async () => {
                    // chặn nếu quá số ảnh
                    if (imageCount >= info.maxImagesCount) {
                        toast.error(`You can only add up to ${info.maxImagesCount} images`);
                        return true;
                    }

                    const filesResult = await mediaFileReader(
                        files,
                        [ACCEPTABLE_IMAGE_TYPES].flatMap((x) => x)
                    );
                    for (const { file, result } of filesResult) {
                        if (imageCount >= info.maxImagesCount) {
                            toast.error(`You can only add up to ${info.maxImagesCount} images`);
                            break;
                        }

                        if (file.size > info.maxSizeImage * 1024 * 1024) {
                            toast.error(`Image ${file.name.slice(0, 10)}... size must be less than ${info.maxSizeImage}MB`);
                            continue;
                        } // chặn size

                        if (!isMimeType(file, ACCEPTABLE_IMAGE_TYPES)) {
                            toast.error(`Image ${file.name.slice(0, 10)}... type must be ${ACCEPTABLE_IMAGE_TYPES.join(", ")}`);
                            continue;
                        }

                        // chỗ này có thể gọi api up ảnh rồi gắn vào src

                        if (isMimeType(file, ACCEPTABLE_IMAGE_TYPES)) {
                            editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
                                altText: file.name,
                                src: result,
                            });
                        }
                    }
                })();
                return true;
            },
            COMMAND_PRIORITY_LOW
        );
    }, [editor, imageCount, info?.maxImagesCount, info?.maxSizeImage]);

    return null;
}
