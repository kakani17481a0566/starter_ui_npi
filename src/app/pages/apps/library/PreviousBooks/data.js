// data.js
import axios from "axios";
import { LIBRARYAPI } from "constants/apis";
export const books = [
  { name: "John Doe", title: "Learning React", author: "Alex Smith", status: "Available" },
  { name: "Jane Smith", title: "Mastering JavaScript", author: "Chris Brown", status: "Issued" },
  { name: "Amit Kumar", title: "Python for Kids", author: "Priya Verma", status: "Available" },
  { name: "Sara Khan", title: "Web Development Basics", author: "Michael Lee", status: "Pending" },
  { name: "David Rao", title: "AI and You", author: "Rohan Patel", status: "Available" },
];
export async function fetchPreviousBooks(studentId){
   try {
    const response = await axios.get(`LIBRARYAPI?studentId=${studentId}`);
    const result = response.data.data;
    return result;
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw error;
  }
}
export function checkoutBook({studentId,bookIds}){
  const payLoad={
    studentId,
    bookIds
  };
  const response=axios.put(LIBRARYAPI,payLoad);
  console.log("response is",response.data);


}
