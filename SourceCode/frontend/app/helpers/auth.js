"use client";

import Cookies from "js-cookie";

export const clearAuthStorage = () => {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem("token");
  sessionStorage.removeItem("token");
  Cookies.remove("token");
  Cookies.remove("auth");
  Cookies.remove("access_token");
};

