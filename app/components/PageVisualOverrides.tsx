"use client";

import { useEffect, useRef } from "react";

export type VisualOverride = {
  selector: string;
  label?: string;
  text?: string;
  background?: string;
  color?: string;
  borderColor?: string;
  borderRadius?: number;
  paddingTop?: number;
  paddingBottom?: number;
  href?: string;
  image?: string;
};

function safeLink(value: string) {
  return /^(?:https?:\/\/|\/|#|mailto:|tel:)/i.test(value);
}

function safeImage(value: string) {
  return /^(?:https?:\/\/|\/)/i.test(value);
}

function replaceDirectText(element: Element, value: string) {
  const node = Array.from(element.childNodes).find(
    (child) => child.nodeType === Node.TEXT_NODE && child.textContent?.trim(),
  );
  if (node) node.textContent = `${value} `;
  else element.insertBefore(document.createTextNode(`${value} `), element.firstChild);
}

export function applyVisualOverride(root: ParentNode, override: VisualOverride) {
  if (!override.selector || !/^[a-z0-9_\- .>:+()[\]=\"']+$/i.test(override.selector)) return;
  let element: HTMLElement | null = null;
  try {
    element = root.querySelector<HTMLElement>(override.selector);
  } catch {
    return;
  }
  if (!element) return;
  const view = element.ownerDocument.defaultView;

  if (typeof override.background === "string") element.style.background = override.background;
  if (typeof override.color === "string") element.style.color = override.color;
  if (typeof override.borderColor === "string") {
    element.style.borderColor = override.borderColor;
    if (view?.getComputedStyle(element).borderStyle === "none") element.style.borderStyle = "solid";
    if (view?.getComputedStyle(element).borderWidth === "0px") element.style.borderWidth = "1px";
  }
  if (typeof override.borderRadius === "number") element.style.borderRadius = `${override.borderRadius}px`;
  if (typeof override.paddingTop === "number") element.style.paddingTop = `${override.paddingTop}px`;
  if (typeof override.paddingBottom === "number") element.style.paddingBottom = `${override.paddingBottom}px`;
  if (typeof override.text === "string") replaceDirectText(element, override.text);
  if (typeof override.href === "string" && element.tagName === "A") {
    if (safeLink(override.href)) element.setAttribute("href", override.href);
    else if (!override.href) element.removeAttribute("href");
  }
  if (typeof override.image === "string" && element.tagName === "IMG") {
    if (!override.image) element.style.display = "none";
    else if (safeImage(override.image)) {
      element.style.display = "";
      element.setAttribute("src", override.image);
      element.setAttribute("srcset", "");
    }
  }
}

export default function PageVisualOverrides({ overrides }: { overrides: VisualOverride[] }) {
  const marker = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = marker.current?.parentElement;
    if (!root) return;
    overrides.forEach((override) => applyVisualOverride(root, override));
  }, [overrides]);

  return <span ref={marker} hidden aria-hidden="true" />;
}
