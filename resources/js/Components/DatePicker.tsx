import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/Components/ui/button";
import { Calendar } from "@/Components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";
import { SelectSingleEventHandler } from "react-day-picker";

interface PropsType {
    placeholder?: string;
    defaultValue?: Date;
    onValueChange?: (value: Date) => void;
    className?: string;
}

export function DatePicker({
    placeholder = "Pick a date",
    defaultValue,
    onValueChange,
    className,
}: PropsType) {
    const [date, setDate] = React.useState<Date>();

    const handleChange: SelectSingleEventHandler = (value) => {
        if (value) {
            setDate(value);
            onValueChange && onValueChange(value);
        }
    };

    React.useEffect(() => {
        if (defaultValue) {
            setDate(defaultValue);
        }
    }, [defaultValue]);

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={
                        cn(
                            " justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                        ) +
                        " " +
                        className
                    }
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>{placeholder}</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleChange}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    );
}
