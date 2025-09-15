import axios from "axios";

/**
 * Fetches parent and linked students from API and normalizes
 * into psLinkData shape that PsLink expects.
 */
export async function fetchPsLinkData(userId, tenantId) {
  try {
    const res = await axios.get(
      `https://localhost:7202/api/ParentStudents/user/${userId}/tenant/${tenantId}/full-details`
    );

    if (res.data.statusCode !== 200) {
      throw new Error(res.data.message || "Failed to fetch parent-student data");
    }

    const { parent, students } = res.data.data;

    // 🔄 Normalize API response to match PsLinkData.js shape
    return [
      {
        id: parent.parentId,
        parent: {
          id: parent.parentId,
          name: parent.firstName ?? parent.parentName,
          gender: parent.gender ?? "unknown",
          image: parent.userImageUrl ?? "/default-avatar.png",
        },
        kids: students.map((s) => ({
          id: s.studentId,
          name: s.name,
          gender: s.gender === "M" ? "male" : "female",
          image: s.studentImageUrl ?? "/default-student.png",
          studentId: s.studentId,
          admissionNumber: s.admissionNumber,
          class: s.courseName,
          section: s.section ?? null, // API doesn’t give section yet
          academicYear: "2025-2026", // 🔹 fallback if API doesn’t provide
          courseId: null, // API doesn’t return courseId
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
