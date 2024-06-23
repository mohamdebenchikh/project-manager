import * as React from "react";
import {
    ArrowUpCircle,
    CheckCircle2,
    Circle,
    LucideIcon,
    MinusCircle,
    PlusCircle,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/Components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/Components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";

type FilterOption = {
    value: string;
    label: string;
    icon: LucideIcon;
};

const statuses: FilterOption[] = [
    { value: "", label: "All Status", icon: MinusCircle },
    { value: "pending", label: "Pending", icon: Circle },
    { value: "in_progress", label: "In Progress", icon: ArrowUpCircle },
    { value: "completed", label: "Completed", icon: CheckCircle2 },
];

const priorities: FilterOption[] = [
    { value: "", label: "All Priorities", icon: MinusCircle },
    { value: "low", label: "Low", icon: Circle },
    { value: "medium", label: "Medium", icon: ArrowUpCircle },
    { value: "high", label: "High", icon: CheckCircle2 },
];

function FilterDropdown({
    options,
    placeholder,
    onValueChange,
}: {
    options: FilterOption[];
    placeholder: string;
    onValueChange: (value: string) => void;
}) {
    const [open, setOpen] = React.useState(false);
    const [selectedOption, setSelectedOption] =
        React.useState<FilterOption | null>(null);

    React.useEffect(() => {
        onValueChange(selectedOption?.value || "");
    }, [selectedOption]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" className="w-[150px] justify-start">
                    {selectedOption ? (
                        <>
                            <selectedOption.icon className="mr-2 h-4 w-4 shrink-0" />
                            {selectedOption.label}
                        </>
                    ) : (
                        <>
                            <PlusCircle className="mr-2 h-4 w-4 shrink-0" />
                            {placeholder}
                        </>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0" side="bottom" align="start">
                <Command>
                    <CommandInput
                        placeholder={`Change ${placeholder.toLowerCase()}...`}
                    />
                    <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup>
                            {options.map((option) => (
                                <CommandItem
                                    key={option.value}
                                    value={option.value}
                                    onSelect={(value) => {
                                        setSelectedOption(
                                            options.find(
                                                (opt) => opt.value === value
                                            ) || null
                                        );
                                        setOpen(false);
                                    }}
                                >
                                    <option.icon
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            option.value ===
                                                selectedOption?.value
                                                ? "opacity-100"
                                                : "opacity-40"
                                        )}
                                    />
                                    <span>{option.label}</span>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}

export function FilterByStatus({
    onValueChange,
}: {
    onValueChange: (value: string) => void;
}) {
    return (
        <FilterDropdown
            options={statuses}
            placeholder="Status"
            onValueChange={onValueChange}
        />
    );
}

export function FilterByPriority({
    onValueChange,
}: {
    onValueChange: (value: string) => void;
}) {
    return (
        <FilterDropdown
            options={priorities}
            placeholder="Priority"
            onValueChange={onValueChange}
        />
    );
}
