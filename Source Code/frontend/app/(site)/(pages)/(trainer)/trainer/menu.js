"use client";

import { IoSettingsOutline } from "react-icons/io5";
import { IoIosPersonAdd } from "react-icons/io";
import { FaNutritionix, FaUserGroup } from "react-icons/fa6";
import { MdAssignmentAdd, MdDateRange } from "react-icons/md";
import { VscBellDot } from "react-icons/vsc";
import { PiPasswordBold } from "react-icons/pi";
import { FaBloggerB } from "react-icons/fa6";

export const buildMenuItems = () => ([
  {
    id: 1,
    name: "Trainer Dashboard",
    href: "/trainer",
    icon: <IoSettingsOutline />,
  },
  {
    id: 2,
    name: "Attendance",
    href: "/trainer/attendance",
    icon: <MdDateRange />,
  },
  {
    id: 3,
    name: "Account Setting",
    href: "/trainer/account-setting",
    icon: <IoIosPersonAdd />,
  },
  {
    id: 4,
    name: "Messages",
    href: "/trainer/message",
    icon: <FaUserGroup />,
  },
  {
    id: 5,
    name: "Group",
    href: "/trainer/group",
    icon: <FaUserGroup />,
  },
  {
    id: 6,
    name: "Assigned Workout",
    href: "/trainer/assigned-workout",
    icon: <MdAssignmentAdd />,
  },
  {
    id: 7,
    name: "Notice",
    href: "/trainer/notice",
    icon: <VscBellDot />,
  },
  {
    id: 8,
    name: "Nutrition Schedule",
    href: "/trainer/nutrition-schedule",
    icon: <FaNutritionix />,
  },
  {
    id: 9,
    name: "Blog",
    href: "/trainer/blog",
    icon: <FaBloggerB />,
  },
  {
    id: 10,
    name: "Change Password",
    href: "/trainer/change-password",
    icon: <PiPasswordBold />,
  },
]);
