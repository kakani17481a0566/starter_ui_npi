import axios from "axios";

// Import fallback avatars
import parentAvatar from "app/pages/dashboards/ParentStudent/Perfomance/avatar-16.jpg";
import kidBoyAvatar from "assets/kidav.jpg";
import kidGirlAvatar from "assets/kidav2.jpg";
import {setSelectedCourseId,setSelectedStudentId} from "utils/sessionStorage";

/**
 * Fetches parent and linked students from API and normalizes
 * into psLinkData shape that PsLink expects.
 */
export async function fetchPsLinkData(userId, tenantId) {
  try {
    const res = await axios.get(
      `https://neuropi-fhafe3gchabde0gb.canadacentral-01.azurewebsites.net/api/ParentStudents/user/${userId}/tenant/${tenantId}/full-details`
    );

    if (res.data.statusCode !== 200) {
      throw new Error(res.data.message || "Failed to fetch parent-student data");
    }

    const { parent, students } = res.data.data;
    const courseId=students[0].courseId;
    const studentId=students[0].studentId;
    setSelectedStudentId(studentId);
    setSelectedCourseId(courseId);    
    // 🔄 Normalize API response to match PsLinkData.js shape
    return [
      {
        id: parent.parentId,
        parent: {
          id: parent.parentId,
          name:
            [parent.firstName, parent.lastName].filter(Boolean).join(" ") ||
            parent.parentName,
          gender: parent.gender ?? "unknown",
          image: parent.userImageUrl || parentAvatar, // 👈 parent fallback
        },
        kids: students.map((s) => ({
          id: s.studentId,
          name: s.name,
          gender:
            s.gender === "M"
              ? "male"
              : s.gender === "F"
              ? "female"
              : "unknown",
          image:
            s.studentImageUrl ||
            (s.gender === "M" ? kidBoyAvatar : kidGirlAvatar), // 👈 gender-based fallback
          studentId: s.studentId,
          admissionNumber: s.admissionNumber,
          class: s.courseName,
          section: s.section ?? null, // API doesn’t give section yet
          academicYear: s.academicYear ?? "2025-2026", // fallback
          courseId: s.courseId, // API doesn’t return courseId
          dob: s.dob,
          age: s.age,
          bloodGroup: s.bloodGroup,
          branch: s.branchName,
          nationality: s.nationality ?? null,
          religion: s.religion ?? null,
          motherTongue: s.motherTongue ?? null,
          progress: 0, // UI-only placeholder
          presenceStatus: "offline", // default
          badges: [],
          workingHours: { start: null, end: null },
        })),
      },
    ];
  } catch (err) {
    console.error("❌ Error fetching psLinkData:", err.message);
    return [];
  }
}
