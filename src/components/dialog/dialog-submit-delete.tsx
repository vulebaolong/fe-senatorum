import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type TProps = {
    openDelete: boolean;
    setOpenDelete: (open: boolean) => void;
    handleConfirmDelete: () => void;
    title: string;
    description: string;
};

export default function DialogSubmitDelete({ openDelete, setOpenDelete, handleConfirmDelete, title, description }: TProps) {
    return (
        <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
            <AlertDialogContent  onEscapeKeyDown={() => setOpenDelete(false)}>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleConfirmDelete}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
