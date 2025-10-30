// Local in-memory cache
let jwtToken = null;
let tenantId = null;
let userId = null;
let user = null;
let role = null;
let department = null;
let week = null;
let branch = null;
let term = null;
let course = null;
let imageUrl = null;
let selectedStudentId=null;
let selectedCourseId=null;

// ✅ Safe JSON parse utility
function safeParse(value) {
  try {
    if (!value || value === "undefined") return null;
    return JSON.parse(value);
  } catch {
    return null;
  }
}

// ✅ Set all session data
export const setSessionData = ({
  token,
  tid,
  uid,
  userName,
  roleName,
  departmentId,
  branchId,
  weekId,
  termId,
  courses,
  userImageUrl,
  userProfile,
  // studentId,
  // courseId
}) => {
  // Set in-memory
  jwtToken = token;
  tenantId = tid;
  userId = uid;
  user = userName;
  role = roleName;
  department = departmentId;
  branch = branchId;
  week = weekId;
  term = termId;
  course = courses;
  imageUrl = userImageUrl;
  // selectedStudentId=studentId;
  // selectedCourseId=courseId;

  // Set in localStorage
  localStorage.setItem("authToken", token ?? "");
  localStorage.setItem("tenantId", tid ?? "");
  localStorage.setItem("userId", uid ?? "");
  localStorage.setItem("user", userName ?? "");
  localStorage.setItem("role", roleName ?? "");
  localStorage.setItem("department", departmentId ?? "");
  localStorage.setItem("weekId", weekId ?? "");
  localStorage.setItem("termId", termId ?? "");
  localStorage.setItem("branchId", branchId ?? "");
  localStorage.setItem("courses", JSON.stringify(courses ?? []));
  localStorage.setItem("userImageUrl", userImageUrl ?? "");
  // localStorage.setItem("selectedStudentId",selectedStudentId??0);
  // localStorage.setItem("selectedCourseId",selectedCourseId??0);

  // ✅ Save userProfile safely
  if (userProfile && typeof userProfile === "object") {
    localStorage.setItem("userProfile", JSON.stringify(userProfile));
  }
};

// ✅ Get session data (from memory or fallback to localStorage)
export const getSessionData = () => ({
  token: jwtToken || localStorage.getItem("authToken"),
  tenantId: tenantId || localStorage.getItem("tenantId"),
  userId: userId || localStorage.getItem("userId"),
  user: user || localStorage.getItem("user"),
  role: role || localStorage.getItem("role"),
  department: department || localStorage.getItem("department"),
  week: week || localStorage.getItem("weekId"),
  term: term || localStorage.getItem("termId"),
  branch: branch || localStorage.getItem("branchId"),
  course: course || safeParse(localStorage.getItem("courses")),
  imageUrl: imageUrl || localStorage.getItem("userImageUrl"),
  userProfile: safeParse(localStorage.getItem("userProfile")),
  selectedStudentId:selectedStudentId||localStorage.getItem("selectedStudentId"),
  selectedCourseId:selectedCourseId||localStorage.getItem("selectedCourseId"),


});

// ✅ Clear session data
export const clearSessionData = () => {
  jwtToken = null;
  tenantId = null;
  userId = null;
  user = null;
  role = null;
  department = null;
  week = null;
  term = null;
  course = null;
  branch = null;
  imageUrl = null;
  selectedCourseId=null;
  selectedStudentId=null;

  localStorage.removeItem("authToken");
  localStorage.removeItem("tenantId");
  localStorage.removeItem("userId");
  localStorage.removeItem("user");
  localStorage.removeItem("role");
  localStorage.removeItem("department");
  localStorage.removeItem("weekId");
  localStorage.removeItem("termId");
  localStorage.removeItem("branchId");
  localStorage.removeItem("courses");
  localStorage.removeItem("userImageUrl");
  localStorage.removeItem("userProfile");
  localStorage.removeItem("courseId");
  localStorage.removeItem("studentId");
};

// ... after your setSessionData function ...

// ✅ Set selectedStudentId separately
export const setSelectedStudentId = (studentId) => {
  const idToSet = studentId ?? 0;
  // Set in-memory
  selectedStudentId = idToSet;
  // Set in localStorage
  localStorage.setItem("selectedStudentId", idToSet);
};

// ✅ Set selectedCourseId separately
export const setSelectedCourseId = (courseId) => {
  const idToSet = courseId ?? 0;
  // Set in-memory
  selectedCourseId = idToSet;
  // Set in localStorage
  localStorage.setItem("selectedCourseId", idToSet);
};

// ... your existing getSessionData and clearSessionData functions ...
