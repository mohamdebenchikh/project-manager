import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
    SortingState,
    getSortedRowModel,
    getFilteredRowModel,
    ColumnFiltersState,
    VisibilityState,
    Table as TableType,
} from "@tanstack/react-table";

import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { ComponentType, useEffect, useState } from "react";
import { Settings2Icon, SearchIcon } from "lucide-react";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    searchable?: boolean;
    searchBy?: string;
    searchPlaceholder?: string;
    customActions?: ComponentType;
    customFilters?: ComponentType<{ table: TableType<TData> }>;
    onSelectChange?:(rows:Object) => void;

}
export function DataTable<TData, TValue>({
    columns,
    data,
    searchable = false,
    searchBy = "name",
    searchPlaceholder = "Search ...",
    customActions: CustomActions,
    customFilters: CustomFilters,
    onSelectChange,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
        {}
    );
    const [rowSelection, setRowSelection] = useState<any>({});

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,

        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

    useEffect(() => {

        const keys = Object.keys(rowSelection).filter(key => rowSelection[key]);
        const filteredData = keys.map(key => data[Number(key)]);
        onSelectChange?.(filteredData);
    },[rowSelection]);

    return (
        <div>
            <div className="flex  flex-col md:flex-row items-start gap-2 md:items-center py-4">
                <div className="flex flex-1 md:flex-grow-0 gap-2 ">
                    {searchable && (
                        <div className="relative flex items-center">
                            <SearchIcon className="absolute h-4 w-4 left-2 text-slate-400" />
                            <Input
                                placeholder={searchPlaceholder}
                                value={
                                    (table
                                        .getColumn(searchBy)
                                        ?.getFilterValue() as string) ?? ""
                                }
                                onChange={(event: { target: { value: any } }) =>
                                    table
                                        .getColumn(searchBy)
                                        ?.setFilterValue(event.target.value)
                                }
                                className="min-w-[300px] pl-8"
                            />
                        </div>
                    )}
                    {CustomFilters && <CustomFilters table={table} />}
                </div>
                <div className="flex gap-2 md:ml-auto">
                    {CustomActions && <CustomActions />}

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant={"outline"}
                                size={"sm"}
                                className="ml-auto"
                            >
                                <Settings2Icon className="mr-2 h-4 w-4" />
                                View
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {table
                                .getAllColumns()
                                .filter((column) => column.getCanHide())
                                .map((column) => {
                                    return (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="capitalize"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) =>
                                                column.toggleVisibility(!!value)
                                            }
                                        >
                                            {column.id.replace(/_/g, " ")}
                                        </DropdownMenuCheckboxItem>
                                    );
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext()
                                                  )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && "selected"
                                    }
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-between py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}
