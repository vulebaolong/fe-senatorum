import { useUploadImageDraft } from "@/api/tantask/image.tanstack";
import ImageCustom from "@/components/custom/image-custom/ImageCustom";
import { Button } from "@/components/ui/button";
import { ButtonLoading } from "@/components/ui/button-loading";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NEXT_PUBLIC_BASE_DOMAIN_CLOUDINARY } from "@/constant/app.constant";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $wrapNodeInElement, mergeRegister } from "@lexical/utils";
import { $createParagraphNode, $insertNodes, $isRootOrShadowRoot, COMMAND_PRIORITY_EDITOR, createCommand, LexicalCommand } from "lexical";
import { Image as LucideImage, Trash } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { $createImageNode, ImageNode, ImagePayload } from "../nodes/image-node";

export type InsertImagePayload = Readonly<ImagePayload>;

export const INSERT_IMAGE_COMMAND: LexicalCommand<InsertImagePayload> = createCommand("INSERT_IMAGE_COMMAND");

export default function ImagesPlugin() {
    const [editor] = useLexicalComposerContext();

    const uploadImageDraft = useUploadImageDraft();

    const [open, setOpen] = useState(false);

    const [url, setUrl] = useState("");
    const [file, setFile] = useState<File>();
    const inputRef = useRef<HTMLInputElement>(null);
    const [tab, setTab] = useState("file");

    const onAddImage = async () => {
        let src = "";
        if (tab === "link") {
            if (url) {
                src = url;
            } else {
                toast.warning("Please enter image URL");
            }
        } else {
            if (file) {
                const formData = new FormData();
                formData.append("draft", file);
                const publicId = await uploadImageDraft.mutateAsync(formData);
                src = `${NEXT_PUBLIC_BASE_DOMAIN_CLOUDINARY}/${publicId}`;
            } else {
                toast.warning("Please select image");
            }
        }

        editor.dispatchCommand(INSERT_IMAGE_COMMAND, { src, altText: "image" });
        setUrl("");
        setFile(undefined);
        setOpen(false);
    };

    useEffect(() => {
        if (!editor.hasNodes([ImageNode])) {
            throw new Error("ImagesPlugin: ImageNode not registered on editor");
        }

        return mergeRegister(
            editor.registerCommand<InsertImagePayload>(
                INSERT_IMAGE_COMMAND,
                (payload) => {
                    const imageNode = $createImageNode(payload);
                    $insertNodes([imageNode]);
                    if ($isRootOrShadowRoot(imageNode.getParentOrThrow())) {
                        $wrapNodeInElement(imageNode, $createParagraphNode).selectEnd();
                    }

                    return true;
                },
                COMMAND_PRIORITY_EDITOR
            )
        );
    }, [editor]);

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button type="button" aria-label="Image" variant="ghost" size="icon" className="size-8">
                        <LucideImage className="h-4 w-4" />
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Insert Image</DialogTitle>
                        <DialogDescription>Insert Image</DialogDescription>
                    </DialogHeader>
                    <div>
                        <Tabs value={tab} onValueChange={setTab}>
                            <TabsList>
                                <TabsTrigger value="file">File</TabsTrigger>
                                <TabsTrigger value="link">Link</TabsTrigger>
                            </TabsList>
                            <TabsContent value={"file"}>
                                <div
                                    onClick={() => {
                                        inputRef.current?.click();
                                    }}
                                    className="relative aspect-video w-full h-max rounded-lg p-1 border border-dashed border-sidebar-border"
                                >
                                    {file ? (
                                        <ImageCustom src={URL.createObjectURL(file)} alt="image link" className="rounded-md" fallbackSrc="" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <p className="text-muted-foreground text-xs">Please select image</p>
                                        </div>
                                    )}
                                    {file && (
                                        <Button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setFile(undefined);
                                            }}
                                            variant="outline"
                                            size="icon"
                                            className="size-8 absolute top-2 right-2"
                                        >
                                            <Trash color="red" />
                                        </Button>
                                    )}
                                </div>
                            </TabsContent>
                            <TabsContent value={"link"}>
                                <div className="flex flex-col gap-2">
                                    <div className="aspect-video w-full h-max rounded-lg p-1 border border-dashed border-sidebar-border">
                                        {url ? (
                                            <ImageCustom src={url} alt="image link" className="rounded-md" fallbackSrc="" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <p className="text-muted-foreground text-xs">Please type image link</p>
                                            </div>
                                        )}
                                    </div>
                                    <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Image link" />
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                    <DialogFooter className="sm:justify-start">
                        <ButtonLoading loading={uploadImageDraft.isPending} disabled={!url && !file} onClick={onAddImage} className="min-w-[120px]">
                            Add Image
                        </ButtonLoading>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <input
                type="file"
                ref={inputRef}
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setFile(file);
                    e.target.value = "";
                }}
            />
        </>
    );
}
