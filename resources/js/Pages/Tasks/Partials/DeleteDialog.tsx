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
import { count } from "console";

interface PropsType {
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    open: boolean;
    count?: number
}

export default function DeleteDialog({
    open,
    onOpenChange,
    onConfirm,
    count,
}: PropsType) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete {count ? 'Tasks' : 'Task'  }</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    Are you sure you want to delete this {count ? 'Tasks' : 'Task'  }?
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
