"use client";

import { useEffect } from "react";

const translations: Record<string, string> = {
  "Панель приборов": "Главная",
  Dashboard: "Главная",
  Search: "Поиск",
  Add: "Добавить",
  Create: "Создать",
  Save: "Сохранить",
  Cancel: "Отмена",
  Close: "Закрыть",
  Delete: "Удалить",
  Reset: "Сбросить",
  "Copy entry": "Копировать запись",
  "Paste entry": "Вставить запись",
  Regenerate: "Сформировать заново",
  "Choose file": "Выбрать файл",
  "No file chosen": "Файл не выбран",
  "Empty list": "Список пуст",
  "Add the first item to see it here.": "Добавьте первый элемент — он появится здесь.",
  "Unable to load collection": "Не удалось загрузить список",
  "Unable to load singleton": "Не удалось загрузить раздел",
  "No items found": "Ничего не найдено",
  Slug: "Адрес страницы",
  true: "Да",
  false: "Нет",
  theme: "Тема оформления",
};

function translate(value: string) {
  return translations[value] ?? value;
}

function translateTextNode(node: Text) {
  const value = node.nodeValue;
  if (!value) return;

  const leading = value.match(/^\s*/)?.[0] ?? "";
  const trailing = value.match(/\s*$/)?.[0] ?? "";
  const translated = translate(value.trim());

  if (translated !== value.trim()) {
    node.nodeValue = `${leading}${translated}${trailing}`;
  }
}

function translateElement(element: Element) {
  for (const attribute of ["aria-label", "placeholder", "title"]) {
    const value = element.getAttribute(attribute);
    if (!value) continue;
    const translated = translate(value);
    if (translated !== value) element.setAttribute(attribute, translated);
  }

  for (const child of element.childNodes) {
    if (child.nodeType === Node.TEXT_NODE) translateTextNode(child as Text);
  }
}

function translateTree(root: Node) {
  if (root.nodeType === Node.TEXT_NODE) {
    translateTextNode(root as Text);
    return;
  }

  if (root.nodeType === Node.ELEMENT_NODE) translateElement(root as Element);
  if (!(root instanceof Element || root instanceof DocumentFragment || root instanceof Document)) return;

  for (const element of root.querySelectorAll("*")) translateElement(element);
}

/** Completes the built-in ru-RU locale for labels Keystatic keeps in English. */
export default function RussianInterface() {
  useEffect(() => {
    translateTree(document.body);

    const observer = new MutationObserver((records) => {
      for (const record of records) {
        if (record.type === "attributes" && record.target instanceof Element) {
          translateElement(record.target);
        }
        for (const node of record.addedNodes) translateTree(node);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ["aria-label", "placeholder", "title"],
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
