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
  "Keystatic Setup": "Настройка админки",
  "Keystatic doesn't have the required config.":
    "Для админки ещё не настроено подключение к GitHub.",
  "If you've already created your GitHub app, make sure to add the following environment variables:":
    "Если приложение GitHub уже создано, добавьте следующие переменные окружения:",
  "If you haven't created your GitHub app for Keystatic, you can create one below.":
    "Если приложение ещё не создано, создайте его с помощью формы ниже.",
  "Deployed App URL": "Адрес сайта на Render",
  "This should the root of your domain. If you're not sure where Keystatic will be deployed, leave this blank and you can update the GitHub app later.":
    "Укажите основной адрес сайта. Его можно изменить позднее в настройках приложения GitHub.",
  "GitHub organization (if any)": "Организация GitHub (если есть)",
  "You must be an owner or GitHub App manager in the organization to create the GitHub App. Leave this blank to create the app in your personal account.":
    "Оставьте поле пустым, чтобы создать приложение в личном аккаунте GitHub.",
  "After visiting GitHub to create the GitHub app, you'll be redirected back here and secrets generated from GitHub will be written to your":
    "После создания приложения GitHub вы вернётесь сюда, а полученные ключи будут записаны в",
  "Create GitHub App": "Создать приложение GitHub",
  "Log in with GitHub": "Войти через GitHub",
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
