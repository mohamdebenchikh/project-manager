import { Card, CardHeader, CardTitle, CardContent } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { useEffect, useState } from "react";
import { ChecklistIem } from "@/types";
import { Edit2Icon, AlignJustify, Plus, XCircle } from "lucide-react";
import axios, { AxiosError } from "axios";
import InputError from "@/Components/InputError";
import { Checkbox } from "@/Components/ui/checkbox";
import Spinner from "@/Components/Spinner";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

interface PropsType {
    taskId: number;
    checklist: ChecklistIem[] | any;
}

const ItemType = "CHECKLIST_ITEM";

const ChecklistIemComponent = ({
    item,
    onChange,
    onDelete,
    index,
    moveItem,
    onDrop
}: {
    item: ChecklistIem;
    onChange: (item: ChecklistIem) => void;
    onDelete: (item: ChecklistIem) => void;
    index: number;
    moveItem: (dragIndex: number, hoverIndex: number) => void;
    onDrop: () => void;
}) => {
    const [editing, setEditing] = useState(false);
    const [title, setTitle] = useState(item.title);

    const editItem = () => {
        setEditing(true);
    };

    const saveChange = () => {
        if (title.trim() !== "") {
            onChange({ ...item, title });
            setEditing(false);
        }
    };

    const [{ isDragging }, drag] = useDrag({
        type: ItemType,
        item: { index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
        end:onDrop
    });

    const [, drop] = useDrop({
        accept: ItemType,
        hover: (draggedItem: { index: number }) => {
            if (draggedItem.index !== index) {
                moveItem(draggedItem.index, index);
                draggedItem.index = index;
            }
        },
    });

    if (editing) {
        return (
            <li className="flex items-center gap-2">
                <Input
                    className="flex-1"
                    value={title}
                    autoFocus={editing}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <Button type="button" onClick={saveChange} size={"sm"}>
                    Save
                </Button>
            </li>
        );
    }

    return (
        <li
            ref={(node) => drag(drop(node))}
            className={`flex items-center cursor-pointer rounded-lg p-4 hover:bg-primary-foreground w-full  ${
                isDragging ? "opacity-50" : ""
            }`}
        >
            <AlignJustify className="h-5 w-5 mr-4 cursor-move" />
            <div className={`flex flex-1 justify-between items-center`}>
                <Label className="flex items-center gap-2">
                    <Checkbox
                        checked={item.completed ? true : false}
                        onCheckedChange={() => {
                            item.completed = !item.completed;
                            onChange(item);
                        }}
                    />
                    <p
                        className={
                            item.completed
                                ? "line-through text-muted-foreground"
                                : "text-primary"
                        }
                    >
                        {item.title}
                    </p>
                </Label>
                <div className="flex items-center gap-4">
                    <button
                        className="text-muted-foreground hover:text-primary"
                        type="button"
                        onClick={editItem}
                    >
                        <Edit2Icon className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => onDelete(item)}
                        className="text-muted-foreground hover:text-primary"
                        type="button"
                    >
                        <XCircle className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </li>
    );
};

export default function Checklist({ taskId, checklist }: PropsType) {
    const [newChecklistItem, setNewChecklistItem] = useState("");
    const [checklistItems, setChecklistItems] = useState<ChecklistIem[]>([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const addNewChecklistItem = async () => {
        setLoading(true);
        try {
            const response = await axios.post(
                route("checklist.store", taskId),
                {
                    title: newChecklistItem,
                    completed: false,
                }
            );

            const newItem = response.data;

            setChecklistItems([...checklistItems, newItem]);
            setNewChecklistItem("");
        } catch (error: AxiosError | any) {
            setError(error?.response.data.message);
        } finally {
            setLoading(false);
        }
    };

    const updateChecklistItem = async (item: ChecklistIem) => {
        setLoading(true);
        try {
            const response = await axios.put(
                route("checklist.update", [taskId, item.id]),
                {
                    title: item.title,
                    completed: item.completed,
                    position: item.position,
                }
            );
            const updatedItem = response.data;
            setChecklistItems([
                ...checklistItems.map((i) =>
                    i.id === item.id ? updatedItem : i
                ),
            ]);
        } catch (error: AxiosError | any) {
            setError(error?.response.data.message);
        } finally {
            setLoading(false);
        }
    };

    const deleteChecklistItem = async (item: ChecklistIem) => {
        setLoading(true);
        try {
            await axios.delete(route("checklist.destroy", [taskId, item.id]));
            setChecklistItems(checklistItems.filter((i) => i.id !== item.id));
        } catch (error: AxiosError | any) {
            setError(error?.response.data.message);
        } finally {
            setLoading(false);
        }
    };

    const moveItem = (dragIndex: number, hoverIndex: number) => {
        const draggedItem = checklistItems[dragIndex];
        const updatedItems = [...checklistItems];
        updatedItems.splice(dragIndex, 1);
        updatedItems.splice(hoverIndex, 0, draggedItem);
        setChecklistItems(updatedItems);
    };

    const updateChecklistPosition = async () => {
        setLoading(true);
        try {
            const items = checklistItems.map((item, index) => {
                return {
                    id: item.id,
                    position: index,
                };
            });

            const response = await axios.put(
                route("checklist.update.position", taskId),
                { items }
            );
            console.log(response.data);
        } catch (error: AxiosError | any) {
            if (error?.response?.data?.message) {
                setError(error?.response.data.message);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setChecklistItems(checklist ?? []);
    }, []);

    return (
        <DndProvider backend={HTML5Backend}>
            <Card>
                <CardHeader>
                    <CardTitle>Checklist</CardTitle>
                </CardHeader>

                <CardContent className="space-y-6">
                    <div>
                        <Label htmlFor="checklist_item">
                            Add checklist item
                        </Label>
                        <div className="flex items-center gap-2 mt-2">
                            <Input
                                placeholder="Checklist item title"
                                value={newChecklistItem}
                                className="w-full"
                                onChange={(e) =>
                                    setNewChecklistItem(e.target.value)
                                }
                                onKeyPress={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        addNewChecklistItem();
                                    }
                                }}
                            />
                            <Button
                                variant="default"
                                type="button"
                                onClick={() => addNewChecklistItem()}
                                size="sm"
                                disabled={loading}
                            >
                                {loading ? (
                                    <Spinner />
                                ) : (
                                    <>
                                        <Plus className="h-4 w-4 me-2" />
                                        Add
                                    </>
                                )}
                            </Button>
                        </div>
                        <InputError className="mt-2" message={error} />
                    </div>
                    <div>
                        {checklistItems.length > 0 && (
                            <ul className="space-y-2">
                                {checklistItems.map((item, index) => {
                                    return (
                                        <ChecklistIemComponent
                                            key={item.id}
                                            item={item}
                                            onChange={(item) =>
                                                updateChecklistItem(item)
                                            }
                                            onDelete={(item) =>
                                                deleteChecklistItem(item)
                                            }
                                            index={index}
                                            onDrop={updateChecklistPosition}
                                            moveItem={moveItem}
                                        />
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                </CardContent>
            </Card>
        </DndProvider>
    );
}
