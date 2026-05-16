"use client";

const getProductLabel = (value) => {
  if (!value) {
    return "";
  }

  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "object") {
    return value.en || Object.values(value).find(Boolean) || "";
  }

  return "";
};

export const createProductSlug = (product) => {
  if (product?.slug) {
    return product.slug;
  }

  const label = getProductLabel(product?.name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");

  return label || "";
};

export const isMongoObjectId = (value = "") => /^[a-f\d]{24}$/i.test(String(Array.isArray(value) ? value[0] : value));
