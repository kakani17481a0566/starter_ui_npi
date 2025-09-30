// Import Dependencies
import { createColumnHelper } from "@tanstack/react-table";

// Local Imports
import {
    SelectCell,
    SelectHeader,
} from "components/shared/table/SelectCheckbox"
// import { RowActions } from "./RowActions";
import {
    DiscountCell,
    NameCell,
    AnnualFeeCell,
    TermFeeCell,
    MonthlyFeeCell,
} from "./rows";

// ----------------------------------------------------------------------

const columnHelper = createColumnHelper();

export const columns = [
    
    columnHelper.accessor((row) => row.name, {
        id: "name",
        header: "Fee Name",
        cell: NameCell,
    }),
    columnHelper.accessor((row) => row.monthly_fee, {
        id: "monthly_fee",
        header: "Monthly Fee",
        cell: MonthlyFeeCell,
    }),
    columnHelper.accessor((row) => row.term_fee, {
        id: "term_fee",
        header: "Term Fee",
        cell: TermFeeCell,
    }),
    columnHelper.accessor((row) => row.annual_fee, {
        id: "annual_fee",
        header: "Annual Fee",
        cell: AnnualFeeCell,
    }),
     columnHelper.display({
        id: "select",
        header: SelectHeader,
        cell: SelectCell,
    }),
    columnHelper.accessor((row) => row.discount, {
        id: "discount",
        header: "Discount",
        cell: DiscountCell,
    }),
   
    // columnHelper.display({
    //     id: "actions",
    //     header: "",
    //     cell: RowActions,
    // }),
]
