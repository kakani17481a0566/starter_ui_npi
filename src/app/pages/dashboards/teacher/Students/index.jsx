// src/app/pages/dashboards/teacher/Students/index.jsx

import { useEffect, useState } from "react";
import { StudentCard } from "./StudentCard";
import { fetchStudentsData } from "./studentdata";
import {
  UsersIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

export function Students() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetchStudentsData().then((res) => {
      setStudents(res.students);
    });
  }, []);

  return (
    <div className="sm:col-span-2 lg:col-span-1">
      <div className="flex h-8 items-center justify-between">
        <h2 className="flex items-center gap-2 font-medium tracking-wide text-gray-800 dark:text-dark-100">
          <UsersIcon className="size-5 text-primary-500" />
          Students
        </h2>
        <a
          href="##"
          className="group flex items-center gap-1 border-b border-dotted border-current pb-0.5 text-xs-plus font-medium text-primary-600 outline-hidden transition-colors duration-300 hover:text-primary-600/70 focus:text-primary-600/70 dark:text-primary-400 dark:hover:text-primary-400/70 dark:focus:text-primary-400/70"
        >
          View All
          <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
        </a>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-x-5 lg:grid-cols-1">
        {students.map((student) => (
          <StudentCard
            key={student.id}
            name={student.name}
            avatar={null}
            isOnline={true}
            progress={Math.floor(Math.random() * 100)} // Placeholder progress
            messagesCount={null}
          />
        ))}
      </div>
    </div>
  );
}
