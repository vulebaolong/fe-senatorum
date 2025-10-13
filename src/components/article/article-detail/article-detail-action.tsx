import { useDeleteArticle } from "@/api/tantask/article.tanstack";
import ConfirmDialog from "@/components/dialog/dialog-confirm";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SET_POST_SLUG_UPDATE } from "@/redux/slices/article.slice";
import { SET_OPEN_EDIT_POST_DIALOG } from "@/redux/slices/setting.slice";
import { useAppDispatch } from "@/redux/store";
import { TArticle } from "@/types/article.type";
import { EArticleVariant } from "@/types/enum/article.enum";
import { EllipsisVertical, Pencil, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type TProps = {
    detailArticle: TArticle;
    type: EArticleVariant;
};

export default function ArticleDetailAction({ detailArticle, type }: TProps) {
    const router = useRouter();
    const [openDelete, setOpenDelete] = useState(false);
    const dispatch = useAppDispatch();

    const deleteArticle = useDeleteArticle();

    const handleConfirmDelete = async () => {
        deleteArticle.mutate(
            { id: detailArticle.id },
            {
                onSuccess: () => {
                    // 1) đóng dialog để gỡ overlay/focus-lock
                    setOpenDelete(false);
                    router.replace("/");

                    // 2) đợi 1 tick cho Radix cleanup xong rồi điều hướng
                    // setTimeout(() => {
                    //     router.replace("/"); // replace để không giữ lại history trang đã xoá
                    // }, 5000);
                },
            }
        );
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button size="icon" className="size-6" variant={"ghost"}>
                        <EllipsisVertical className="transition-transform text-muted-foreground" />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent side="bottom" align="end">
                    <DropdownMenuItem
                        onClick={() => {
                            if (type === EArticleVariant.ARTICLE) {
                                router.push(`/article/${detailArticle.slug}/edit`);
                            }
                            if (type === EArticleVariant.POST) {
                                dispatch(SET_POST_SLUG_UPDATE(detailArticle.slug));
                                dispatch(SET_OPEN_EDIT_POST_DIALOG(true));
                            }
                        }}
                    >
                        <Pencil className="mr-2 h-4 w-4" />
                        <span>Edit</span>
                    </DropdownMenuItem>

                    {/* Mở dialog qua state, không lồng dialog trong menu */}
                    <DropdownMenuItem
                        onClick={(e) => {
                            e.preventDefault(); // tránh menu "nuốt" select và đóng sai thời điểm
                            setOpenDelete(true);
                        }}
                    >
                        <Trash className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Dialog xác nhận tái sử dụng */}
            <ConfirmDialog
                open={openDelete}
                onOpenChange={setOpenDelete}
                title="Delete article"
                description="Are you sure you want to delete this article? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                variant="destructive"
                loading={deleteArticle.isPending}
                onConfirm={handleConfirmDelete}
            />
        </>
    );
}
