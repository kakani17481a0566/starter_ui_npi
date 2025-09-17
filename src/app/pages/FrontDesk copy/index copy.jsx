// src/app/pages/FrontDesk/index.jsx
import {
  UsersIcon,
  AcademicCapIcon,
  UserGroupIcon,
  BanknotesIcon,
  ClipboardDocumentListIcon,
  UserCircleIcon,
  CalendarDaysIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";

import { useState } from "react";

import StatCard from "./StatCard";
import CardSection from "./CardSection";

// ✅ Import from StudentAttendance
import AttendanceStatusDisplayTable from "./StudentAttendence/index";
import { StudentAttedenceList } from "./StudentAttendence/data";

// ✅ Import from TeacherAttendance
import TeacherAttendanceStatusDisplayTable from "./TeacherAttendence/index";
import { teachersList } from "./TeacherAttendence/data";

// ✅ Import Transactions instead of PaymentsTable
import { Transactions } from "./Transactions";

import { visitors, transactions } from "./data"; // ⬅️ removed payments import
import { AppointmentsRequestsCard } from "./AppointmentsRequestsCard";

// ✅ Import DatePicker
import { DatePicker } from "components/shared/form/Datepicker";

// ----------------------------------------------------------------------
// 🔹 Safe date formatter (handles missing/invalid dates)
const formatDate = (date) => {
  if (!date) return null;
  const d = new Date(date);
  return isNaN(d) ? null : d.toISOString().split("T")[0];
};

// ----------------------------------------------------------------------
// Custom Disabled Calendar Component
const Disabled = ({ selectedDate, setSelectedDate }) => {
  return (
    <div className="max-w-xs text-primary-500">
      <DatePicker
        options={{
          disable: [
            function (date) {
              // Disable weekends (Sunday=0, Saturday=6)
              return date.getDay() === 0 || date.getDay() === 6;
            },
          ],
          locale: {
            firstDayOfWeek: 1, // Monday as the first day
          },
          defaultDate: new Date(), // ✅ default today
        }}
        value={selectedDate}
        onChange={(dates) => {
          if (dates && dates[0]) setSelectedDate(dates[0]);
        }}
        placeholder="Choose date..."
      />
    </div>
  );
};

export default function FrontDeskDashboard() {
  // ✅ Track selected date
  const [selectedDate, setSelectedDate] = useState(new Date());

  // ✅ Filter data by selected date (safe)
  const studentsForDate = StudentAttedenceList.filter(
    (s) => formatDate(s.date) === formatDate(selectedDate),
  );
  const teachersForDate = teachersList.filter(
    (t) => formatDate(t.date) === formatDate(selectedDate),
  );
  const visitorsForDate = visitors.filter(
    (v) => formatDate(v.date) === formatDate(selectedDate),
  );
  const transactionsForDate = transactions.filter(
    (t) => formatDate(t.date) === formatDate(selectedDate),
  );

  // ✅ derive stats dynamically
  const totalStudents = studentsForDate.length;
  const totalTeachers = teachersForDate.length;
  const totalVisitors = visitorsForDate.length;

  // 🔹 Collections come from transactions
  const totalCollections = transactionsForDate.reduce(
    (sum, t) => sum + (t.amount || 0),
    0,
  );

  // helper: scroll to section by id
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="dark:from-dark-900 dark:to-dark-800 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="mx-auto max-w-7xl">
        {/* ---------- Header Row ---------- */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Title */}
          <h1 className="text-primary-600 dark:text-primary-400 flex items-center gap-2 text-3xl font-extrabold tracking-tight">
            <AcademicCapIcon className="text-primary-600 dark:text-primary-400 h-8 w-8" />
            School Front Desk
          </h1>

          {/* Disabled Calendar */}
          <Disabled
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />
        </div>

        {/* ---------- Top Stats ---------- */}
        <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-4">
          <div
            className="cursor-pointer"
            onClick={() => scrollToSection("student-attendance")}
          >
            <StatCard
              title="Total Students"
              value={totalStudents}
              gradient="from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/30"
              icon={
                <UsersIcon className="text-primary-600 dark:text-primary-400 h-6 w-6" />
              }
            />
          </div>

          <div
            className="cursor-pointer"
            onClick={() => scrollToSection("teacher-attendance")}
          >
            <StatCard
              title="Teaching Staff"
              value={totalTeachers}
              gradient="from-green-100 to-green-200 dark:from-green-900/40 dark:to-green-800/30"
              icon={
                <AcademicCapIcon className="text-primary-600 dark:text-primary-400 h-6 w-6" />
              }
            />
          </div>

          <div
            className="cursor-pointer"
            onClick={() => scrollToSection("visitors-appointments")}
          >
            <StatCard
              title="Visitors Today"
              value={totalVisitors}
              gradient="from-purple-100 to-purple-200 dark:from-purple-900/40 dark:to-purple-800/30"
              icon={
                <UserGroupIcon className="text-primary-600 dark:text-primary-400 h-6 w-6" />
              }
            />
          </div>

          <div
            className="cursor-pointer"
            onClick={() => scrollToSection("transactions")}
          >
            <StatCard
              title="Today's Collections"
              value={`$${totalCollections.toLocaleString()}`}
              gradient="from-amber-100 to-amber-200 dark:from-amber-900/40 dark:to-amber-800/30"
              icon={
                <BanknotesIcon className="text-primary-600 dark:text-primary-400 h-6 w-6" />
              }
            />
          </div>
        </div>

        {/* ---------- Student + Teacher Attendance ---------- */}
        <div className="mb-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <CardSection
            id="student-attendance"
            title="Student Attendance"
            color="blue"
            icon={
              <ClipboardDocumentListIcon className="text-primary-600 dark:text-primary-400 h-5 w-5" />
            }
          >
            <AttendanceStatusDisplayTable data={studentsForDate} />
          </CardSection>

          <CardSection
            id="teacher-attendance"
            title="Teacher Attendance"
            color="green"
            icon={
              <UserCircleIcon className="text-primary-600 dark:text-primary-400 h-5 w-5" />
            }
          >
            <TeacherAttendanceStatusDisplayTable data={teachersForDate} />
          </CardSection>
        </div>

        {/* ---------- Visitors + Transactions ---------- */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <CardSection
            id="visitors-appointments"
            title="Visitors & Appointments"
            color="purple"
            icon={
              <CalendarDaysIcon className="text-primary-600 dark:text-primary-400 h-5 w-5" />
            }
          >
            {/* 🔹 Horizontal scroll container */}
            <div className="flex space-x-4 overflow-x-auto pb-2">
              {visitorsForDate.map((v, idx) => (
                <AppointmentsRequestsCard
                  key={idx}
                  name={v.visitor}
                  avatar={null}
                  request={`Meeting with ${v.person}`}
                  date={formatDate(v.date) || "N/A"}
                  time={v.time}
                />
              ))}
            </div>
          </CardSection>

          <CardSection
            id="transactions"
            title="Transactions"
            color="amber"
            icon={
              <CurrencyDollarIcon className="text-primary-600 dark:text-primary-400 h-5 w-5" />
            }
          >
            <div className="max-h-80 overflow-y-auto pr-2">
              <Transactions data={transactionsForDate} />
            </div>
          </CardSection>
        </div>
      </div>
    </div>
  );
}
