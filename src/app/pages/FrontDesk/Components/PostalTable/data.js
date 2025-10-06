// src/app/pages/FrontDesk/Components/PostalTable/data.js

// 📦 Dummy Postal Data
export const postalData = [
  {
    parcel_id: "PCL-1001",
    created_on: "2025-10-01T10:30:00Z",
    sender_name: "Ravi Kumar",
    receiver_name: "Anita Sharma",
    postal_item: "Letter",
    amount: 50,
    status: "Delivered",
  },
  {
    parcel_id: "PCL-1002",
    created_on: "2025-10-02T12:15:00Z",
    sender_name: "Sunil Mehta",
    receiver_name: "Priya Singh",
    postal_item: "Parcel",
    amount: 250,
    status: "In Transit",
  },
  {
    parcel_id: "PCL-1003",
    created_on: "2025-10-03T09:45:00Z",
    sender_name: "Kiran Patel",
    receiver_name: "Rahul Verma",
    postal_item: "Document",
    amount: 120,
    status: "Pending",
  },
  {
    parcel_id: "PCL-1004",
    created_on: "2025-10-03T16:00:00Z",
    sender_name: "Amit Sharma",
    receiver_name: "Sneha Reddy",
    postal_item: "Package",
    amount: 480,
    status: "Delivered",
  },
  {
    parcel_id: "PCL-1005",
    created_on: "2025-10-04T11:10:00Z",
    sender_name: "Deepak Joshi",
    receiver_name: "Neha Kapoor",
    postal_item: "Parcel",
    amount: 300,
    status: "In Transit",
  },
];

// 📌 Status Options for Postal Table (similar to orderStatusOptions)
export const postalStatusOptions = [
  {
    value: "Delivered",
    label: "Delivered",
    color: "success",
  },
  {
    value: "In Transit",
    label: "In Transit",
    color: "info",
  },
  {
    value: "Pending",
    label: "Pending",
    color: "warning",
  },
];
