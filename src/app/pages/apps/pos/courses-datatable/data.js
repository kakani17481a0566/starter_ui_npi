// ----------------------------------------------------------------------
// Imports
// ----------------------------------------------------------------------
import axios from "axios";
import { POS_ITEMS } from "constants/apis";

// ----------------------------------------------------------------------
// Toolbar Filter Selector Options
// Defines which filters appear in the Toolbar
// ----------------------------------------------------------------------
export const filtersOptions = [
  { value: "category", label: "Category" },
  { value: "status", label: "Status" },
  { value: "size", label: "Size" },
  { value: "price", label: "Price" },
];

// ----------------------------------------------------------------------
// API Call: Fetch all POS Items + Dynamic Filters
// ----------------------------------------------------------------------
export async function fetchItemsData() {
  try {
    const response = await axios.get(POS_ITEMS);
    const data = response.data?.data;

    if (!data) throw new Error("Empty API response");

    // ------------------------------------------------------------------
    // ✅ Normalize Items for Table Usage
    // ------------------------------------------------------------------
    const items = (data.items || []).map((item) => ({
      id: item.id,
      name: item.name?.trim() ?? "Unnamed Item",
      image: item.image?.startsWith("/") ? item.image : `/${item.image}`,
      categoryId: item.categoryId,
      categoryName: item.categoryName?.trim() ?? "Uncategorized",
      status: item.status?.toLowerCase().trim() ?? "unknown", // normalize for filters
      size:
        item.size && item.size > 0
          ? String(item.size)
          : "N/A", // convert to string for dropdowns
      price: Number(item.price) || 0,
      itemQuantity: item.itemQuantity ?? 0,
    }));

    // ------------------------------------------------------------------
    // ✅ Extract and Normalize Filters
    // ------------------------------------------------------------------
    const filters = data.filters || {};

    // 🔹 Category Filter (using only category names for matching)
    const categoryOptions = Object.values(filters.categories || {}).map(
      (name) => ({
        value: name?.trim(),
        label: name,
      })
    );

    // 🔹 Status Filter
    const statusOptions = (filters.statusList || []).map((status) => {
      const normalized = status.toLowerCase().trim();
      return {
        value: normalized,
        label: status,
        color: normalized.includes("not") ? "error" : "success",
      };
    });

    // 🔹 Size Filter
    const sizeOptions = (filters.sizes || []).map((size) => ({
      value: String(size),
      label: String(size),
    }));

    // 🔹 Price Filter (for range filtering)
    const priceOptions = (filters.priceList || []).map((price) => ({
      value: Number(price),
      label: `₹${price}`,
    }));

    // ------------------------------------------------------------------
    // ✅ Bundle All Dropdowns for Toolbar Filters
    // ------------------------------------------------------------------
    const dropdowns = {
      categoryOptions,
      statusOptions,
      sizeOptions,
      priceOptions,
    };

    // ✅ Return Combined Data and Dropdown Filters
    return { items, dropdowns };
  } catch (error) {
    console.error("❌ Error fetching POS items:", error);
    throw error;
  }
}
