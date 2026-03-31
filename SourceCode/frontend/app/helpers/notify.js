"use client";

const TOAST_CONTAINER_ID = "codex-toast-container";

const ensureContainer = () => {
  if (typeof document === "undefined") {
    return null;
  }

  let container = document.getElementById(TOAST_CONTAINER_ID);
  if (!container) {
    container = document.createElement("div");
    container.id = TOAST_CONTAINER_ID;
    container.style.position = "fixed";
    container.style.top = "20px";
    container.style.right = "20px";
    container.style.zIndex = "9999";
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.gap = "10px";
    document.body.appendChild(container);
  }
  return container;
};

const palette = {
  success: { background: "#16a34a", color: "#ffffff" },
  error: { background: "#dc2626", color: "#ffffff" },
  info: { background: "#1d4ed8", color: "#ffffff" },
};

export const notify = (type = "info", message = "") => {
  if (!message || typeof document === "undefined") {
    return;
  }

  const container = ensureContainer();
  if (!container) {
    return;
  }

  const toast = document.createElement("div");
  const colors = palette[type] || palette.info;

  toast.textContent = message;
  toast.style.background = colors.background;
  toast.style.color = colors.color;
  toast.style.padding = "12px 16px";
  toast.style.borderRadius = "10px";
  toast.style.boxShadow = "0 10px 25px rgba(15, 23, 42, 0.18)";
  toast.style.fontSize = "14px";
  toast.style.fontWeight = "600";
  toast.style.maxWidth = "320px";
  toast.style.opacity = "0";
  toast.style.transform = "translateY(-8px)";
  toast.style.transition = "opacity 160ms ease, transform 160ms ease";

  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translateY(0)";
  });

  window.setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(-8px)";
    window.setTimeout(() => {
      toast.remove();
    }, 180);
  }, 2800);
};

export const notifySuccess = (message) => notify("success", message);
export const notifyError = (message) => notify("error", message);
export const notifyInfo = (message) => notify("info", message);
