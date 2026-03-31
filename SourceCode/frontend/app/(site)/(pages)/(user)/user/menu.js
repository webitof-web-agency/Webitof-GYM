"use client";

import { IoIosPersonAdd } from "react-icons/io";
import { FaCartShopping, FaNutritionix, FaPeopleGroup, FaUserGroup } from "react-icons/fa6";
import { HiChat } from "react-icons/hi";
import { MdOutlineSportsGymnastics } from "react-icons/md";
import { PiPasswordBold, PiQuotesThin } from "react-icons/pi";
import { VscBellDot } from "react-icons/vsc";
import { IoIosFitness } from "react-icons/io";

export const buildBaseMenuItems = () => ([
  { id: 1, name: "Account Setting", href: "/user", icon: <IoIosPersonAdd /> },
  { id: 2, name: "Membership Level", href: "/user/membership-level", icon: <FaPeopleGroup /> },
  { id: 3, name: "Fitness History", href: "/user/fitness-history", icon: <IoIosFitness /> },
  { id: 4, name: "Order History", href: "/user/order", icon: <FaCartShopping /> },
  { id: 5, name: "Message", href: "/user/message", icon: <HiChat /> },
]);

export const buildSubscriptionMenuItems = (hasActiveSubscription) => {
  const target = hasActiveSubscription ? "" : "/pricing-plan";
  return [
    { id: 6, name: "Group", href: `${target || "/user/group"}`, icon: <FaUserGroup /> },
    { id: 7, name: "Nutrition Schedule", href: `${target || "/user/nutrition-schedule"}`, icon: <FaNutritionix /> },
    { id: 8, name: "Workout", href: `${target || "/user/workout"}`, icon: <MdOutlineSportsGymnastics /> },
    { id: 9, name: "Notice", href: `${target || "/user/notice"}`, icon: <VscBellDot /> },
    { id: 10, name: "Testimonial", href: `${target || "/user/testimonial"}`, icon: <PiQuotesThin /> },
    { id: 11, name: "Change Password", href: "/user/change-password", icon: <PiPasswordBold /> },
  ];
};
