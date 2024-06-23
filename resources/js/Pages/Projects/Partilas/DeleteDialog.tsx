import { Button } from "@/Components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";

interface PropsType {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
}

export default function DeleteDialog({
    open,
    onOpenChange,
    onConfirm,
}: PropsType) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Project</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    Are you sure you want to delete this project?
                </DialogDescription>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant={"default"} size={"sm"}>
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button
                        variant={"destructive"}
                        size={"sm"}
                        onClick={onConfirm}
                    >
                        Yes, delete it
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
