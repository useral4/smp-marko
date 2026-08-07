import type { CSSProperties } from "react";
import type { CmsPage } from "./runtime-content";
import type { VisualOverride } from "../app/components/PageVisualOverrides";

export type PageBlock = {
  id: string;
  type: "text" | "image-left" | "image-right" | "cta";
  eyebrow: string;
  heading: string;
  text: string;
  image: string;
  buttonText: string;
  buttonHref: string;
  background: string;
  textColor: string;
  borderColor: string;
  radius: number;
};

export type StoryFrame = {
  title: string;
  text: string;
  image: string;
};

function value(page: CmsPage | null, key: string, fallback: string) {
  return typeof page?.[key] === "string" && page[key]
    ? String(page[key])
    : fallback;
}

function numeric(page: CmsPage | null, key: string, fallback: number) {
  const result = Number(page?.[key]);
  return Number.isFinite(result) ? result : fallback;
}

function hexToRgba(hex: string, opacity: number) {
  const normalized = hex.replace("#", "");
  const expanded = normalized.length === 3
    ? normalized.split("").map((part) => part + part).join("")
    : normalized;
  if (!/^[0-9a-f]{6}$/i.test(expanded)) return `rgba(244,247,247,${opacity})`;
  const number = Number.parseInt(expanded, 16);
  return `rgba(${number >> 16},${(number >> 8) & 255},${number & 255},${opacity})`;
}

export function pageThemeStyle(page: CmsPage | null): CSSProperties {
  const heroBackground = value(page, "heroBackground", "#edf5f6");
  const heroImage = value(page, "heroBackgroundImage", "");
  const overlay = Math.min(1, Math.max(0, numeric(page, "heroOverlay", 0.82)));
  return {
    "--page-bg": value(page, "pageBackground", "#ffffff"),
    "--page-hero-bg": heroBackground,
    "--page-hero-text": value(page, "heroTextColor", "#11232c"),
    "--page-accent": value(page, "accentColor", "#087e9b"),
    "--page-card-radius": `${numeric(page, "cardRadius", 18)}px`,
    "--page-section-spacing": `${numeric(page, "sectionSpacing", 110)}px`,
    "--page-hero-image": heroImage ? `url(${JSON.stringify(heroImage)})` : "none",
    "--page-hero-overlay": hexToRgba(heroBackground, overlay),
    "--page-hero-position": value(page, "heroImagePosition", "center"),
  } as CSSProperties;
}

export function pageBlocks(page: CmsPage | null): PageBlock[] {
  if (!Array.isArray(page?.customBlocks)) return [];
  return page.customBlocks.map((entry, index) => {
    const block = entry && typeof entry === "object" ? entry as Record<string, unknown> : {};
    const type = ["text", "image-left", "image-right", "cta"].includes(String(block.type))
      ? String(block.type) as PageBlock["type"]
      : "text";
    return {
      id: String(block.id || `block-${index + 1}`),
      type,
      eyebrow: String(block.eyebrow || ""),
      heading: String(block.heading || ""),
      text: String(block.text || ""),
      image: String(block.image || ""),
      buttonText: String(block.buttonText || ""),
      buttonHref: String(block.buttonHref || ""),
      background: String(block.background || "#ffffff"),
      textColor: String(block.textColor || "#11232c"),
      borderColor: String(block.borderColor || "#dbe3e5"),
      radius: Number(block.radius) || 0,
    };
  });
}

export function pageVisualOverrides(page: CmsPage | null): VisualOverride[] {
  if (!Array.isArray(page?.visualOverrides)) return [];
  return page.visualOverrides.flatMap((entry) => {
    if (!entry || typeof entry !== "object") return [];
    const value = entry as Record<string, unknown>;
    const selector = typeof value.selector === "string" ? value.selector : "";
    if (!selector) return [];
    const override: VisualOverride = { selector };
    if (typeof value.label === "string") override.label = value.label;
    if (typeof value.text === "string") override.text = value.text;
    if (typeof value.background === "string") override.background = value.background;
    if (typeof value.color === "string") override.color = value.color;
    if (typeof value.borderColor === "string") override.borderColor = value.borderColor;
    if (typeof value.href === "string") override.href = value.href;
    if (typeof value.image === "string") override.image = value.image;
    for (const key of ["borderRadius", "paddingTop", "paddingBottom"] as const) {
      const number = Number(value[key]);
      if (Number.isFinite(number)) override[key] = number;
    }
    return [override];
  });
}

export function storyFrames(page: CmsPage | null, fallback: StoryFrame[]) {
  if (!Array.isArray(page?.storyFrames)) return fallback;
  const frames = page.storyFrames.map((entry) => {
    const frame = entry && typeof entry === "object" ? entry as Record<string, unknown> : {};
    return {
      title: String(frame.title || ""),
      text: String(frame.text || ""),
      image: String(frame.image || ""),
    };
  }).filter((frame) => frame.title || frame.text || frame.image);
  return frames.length ? frames : fallback;
}
