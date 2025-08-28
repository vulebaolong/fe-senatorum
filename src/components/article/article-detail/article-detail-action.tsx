import { useDeleteArticle } from "@/api/tantask/article.tanstack";
import ConfirmDialog from "@/components/dialog/dialog-confirm";
import DialogSubmitDelete from "@/components/dialog/dialog-submit-delete";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { TResAction } from "@/types/app.type";
import { TArticle } from "@/types/article.type";
import { EllipsisVertical, Pencil, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

type TProps = {
    detailArticle: TArticle;
};

export default function ArticleDetailAction({ detailArticle }: TProps) {
    const router = useRouter();
    const [openDelete, setOpenDelete] = useState(false);

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
                    {/* KHÔNG gắn onClick điều hướng ở Trigger */}
                    <Button variant="ghost" size="icon" className="size-6 outline-0">
                        <EllipsisVertical />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent side="bottom" align="end">
                    <DropdownMenuItem onClick={() => router.push(`/article/${detailArticle.slug}/edit`)}>
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
