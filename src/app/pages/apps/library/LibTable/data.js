// data.js

import {
  BookOpenIcon,
  ClockIcon,
  ArrowUturnLeftIcon,
  ExclamationTriangleIcon,
  ArchiveBoxIcon,
} from "@heroicons/react/24/outline";
import axios from 'axios';
import {LIBRARY_CATEGORIES} from "constants/apis";

// ✅ Status options for the status dropdown (uses Tailux-supported colors)
export const orderStatusOptions = [
  { value: "available", label: "Available", color: "success", icon: BookOpenIcon },
  { value: "reserved",  label: "Reserved",  color: "warning", icon: ClockIcon },
  { value: "borrowed",  label: "Borrowed",  color: "primary", icon: ArrowUturnLeftIcon },
  { value: "lost",      label: "Lost",      color: "error",   icon: ExclamationTriangleIcon }, // 🔹 fixed here
  { value: "archived",  label: "Archived",  color: "gray",    icon: ArchiveBoxIcon },
];

export async function fetchBooks(){
   try {
    const response = await axios.get(LIBRARY_CATEGORIES);
    const result = response.data.data;
    return result;
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw error; 
  }
}

// ✅ Library dataset
export const libraryList = [
  {
    book_id: "#B101",
    created_at: "1676070562000",
    book: { title: "My First Colors", cover_img: null },
    price: 12.5,
    stock: 40,
    status: "available",
    category: "PreNursery",
    author: "Anita Verma",
    publisher_address: { street: "12 Rose Lane", line: "Block A" },
  },
  {
    book_id: "#B102",
    created_at: "1679082165000",
    book: { title: "Shapes Around Me", cover_img: null },
    price: 15.99,
    stock: 12,
    status: "reserved",
    category: "PreNursery",
    author: "Rahul Menon",
    publisher_address: { street: "45 Maple Ave", line: "Suite 22" },
  },
  {
    book_id: "#B103",
    created_at: "1681204523000",
    book: { title: "ABC Friends", cover_img: null },
    price: 18.0,
    stock: 25,
    status: "borrowed",
    category: "Nursery",
    author: "Priya Sharma",
    publisher_address: { street: "9 Sunrise Park", line: "Tower 3" },
  },
  {
    book_id: "#B104",
    created_at: "1684216123000",
    book: { title: "Numbers 1-10", cover_img: null },
    price: 14.75,
    stock: 30,
    status: "available",
    category: "Nursery",
    author: "Karan Patel",
    publisher_address: { street: "77 Green Street", line: "2nd Floor" },
  },
  {
    book_id: "#B105",
    created_at: "1687327723000",
    book: { title: "Animals & Sounds", cover_img: null },
    price: 16.5,
    stock: 8,
    status: "borrowed",
    category: "K1",
    author: "Sunita Rao",
    publisher_address: { street: "5 Banyan Road", line: "Opp. City Park" },
  },
  {
    book_id: "#B106",
    created_at: "1690339323000",
    book: { title: "My First Words", cover_img: null },
    price: 13.25,
    stock: 18,
    status: "available",
    category: "K1",
    author: "Vikram Singh",
    publisher_address: { street: "101 Lakeview", line: "Apt 5B" },
  },
  {
    book_id: "#B107",
    created_at: "1693450923000",
    book: { title: "Fruits and Vegetables", cover_img: null },
    price: 17.8,
    stock: 5,
    status: "reserved",
    category: "K2",
    author: "Meera Iyer",
    publisher_address: { street: "8 Coral Drive", line: "Phase II" },
  },
  {
    book_id: "#B108",
    created_at: "1696462523000",
    book: { title: "Play & Learn Rhymes", cover_img: null },
    price: 11.9,
    stock: 22,
    status: "available",
    category: "PreNursery",
    author: "Arun Pillai",
    publisher_address: { street: "66 Orchard Rd", line: "Block D" },
  },
  {
    book_id: "#B109",
    created_at: "1699574123000",
    book: { title: "Happy Faces & Emotions", cover_img: null },
    price: 16.0,
    stock: 0,
    status: "archived",
    category: "Nursery",
    author: "Shreya Kulkarni",
    publisher_address: { street: "3 Jasmine Enclave", line: "Wing A" },
  },
  {
    book_id: "#B110",
    created_at: "1702585723000",
    book: { title: "Good Habits for Me", cover_img: null },
    price: 19.5,
    stock: 10,
    status: "available",
    category: "K2",
    author: "Naveen Joshi",
    publisher_address: { street: "24 Horizon Blvd", line: "Suite 5" },
  },
  {
    book_id: "#B111",
    created_at: "1705697323000",
    book: { title: "Story Time: Little Stars", cover_img: null },
    price: 21.0,
    stock: 6,
    status: "lost",
    category: "Nursery",
    author: "Aisha Rahman",
    publisher_address: { street: "55 Pearl Street", line: "Unit 12" },
  },
  {
    book_id: "#B112",
    created_at: "1708708923000",
    book: { title: "Counting Fun", cover_img: null },
    price: 13.9,
    stock: 14,
    status: "borrowed",
    category: "K1",
    author: "Deepak Nair",
    publisher_address: { street: "19 Cedar Court", line: "Block C" },
  },
];
