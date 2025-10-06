import axios from "axios";

// ✅ Hardcoded constants
const baseUrl = "https://localhost:7202";
const tenantId = 1;
const branchId = 1;

export async function fetchEnquiryData() {
  try {
    const response = await axios.get(
      `${baseUrl}/api/StudentEnquiry/student-enquiry-new/tenant/${tenantId}/branch/${branchId}/display`
    );

    // API returns { statusCode, message, data }
    return response.data.data;
  } catch (error) {
    console.error("Error fetching enquiry data:", error);
    return [];
  }
}






// export const enquiryData = [
//   {
//     id: 101, // enquiry id
//     tenant_id: 1, // ✅ always keep tenant context

//     student_first_name: "Ravi",
//     student_middle_name: null,
//     student_last_name: "Kumar",
//     dob: "2018-06-15",
//     gender: { id: 1, name: "Male" },

//     admissionCourse: { id: 3, name: "LKG" },
//     branch: { id: 2, name: "Hyderabad Branch" },
//     status: { id: 1, name: "New" },

//     created_on: "2025-10-01T09:45:00Z",

//     parentContact: {
//       id: 201,
//       tenant_id: 1,
//       relationship_id: 1, // ✅ father
//       name: "Raj Kumar",
//       pri_number: "9876543210",
//       sec_number: "9123456780",
//       email: "raj.kumar@example.com",
//       address_1: "12-34, MG Road",
//       address_2: "Near City Mall",
//       state: "Telangana",
//       city: "Hyderabad",
//       pincode: "500001",
//       created_on: "2025-09-01T08:00:00Z",
//       created_by: 1,
//       updated_on: null,
//       updated_by: null,
//       is_deleted: false,
//       contact_person: "Father",
//       contact_type: "Parent",
//       qualification: "MBA",
//       profession: "Manager",
//       user_id: null,
//     },

//     motherContact: {
//       id: 202,
//       tenant_id: 1,
//       relationship_id: 2, // ✅ mother
//       name: "Anita Kumar",
//       pri_number: "9988776655",
//       sec_number: null,
//       email: "anita.kumar@example.com",
//       address_1: "12-34, MG Road",
//       address_2: "Near City Mall",
//       state: "Telangana",
//       city: "Hyderabad",
//       pincode: "500001",
//       created_on: "2025-09-01T08:00:00Z",
//       created_by: 1,
//       updated_on: null,
//       updated_by: null,
//       is_deleted: false,
//       contact_person: "Mother",
//       contact_type: "Parent",
//       qualification: "B.Sc",
//       profession: "Teacher",
//       user_id: null,
//     },
//   },
//   {
//     id: 102,
//     tenant_id: 1,
//     student_first_name: "Sita",
//     student_middle_name: "Devi",
//     student_last_name: "Sharma",
//     dob: "2017-09-21",
//     gender: { id: 2, name: "Female" },

//     admissionCourse: { id: 4, name: "UKG" },
//     branch: { id: 1, name: "Bangalore Branch" },
//     status: { id: 2, name: "In Progress" },

//     created_on: "2025-09-28T11:30:00Z",

//     parentContact: {
//       id: 203,
//       tenant_id: 1,
//       relationship_id: 1, // father
//       name: "Ramesh Sharma",
//       pri_number: "9090909090",
//       email: "ramesh.sharma@example.com",
//       address_1: "123, Residency Road",
//       address_2: "Apt 45",
//       state: "Karnataka",
//       city: "Bangalore",
//       pincode: "560025",
//       created_on: "2025-09-01T08:00:00Z",
//       created_by: 1,
//       is_deleted: false,
//       contact_person: "Father",
//       contact_type: "Parent",
//       qualification: "B.Tech",
//       profession: "Engineer",
//     },
//   },
// ];
