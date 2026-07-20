"use client";

import Image from "next/image";
import Link from "next/link";
import { createContext, FormEvent, useContext, useEffect, useState } from "react";
import { contactAddress, contactEmail, phoneDisplay, phoneHref, phones, socials } from "../data";

export function UiIcon({ name, size = 20 }: { name: string; size?: number }) {
  const paths: Record<string, React.ReactNode> = {
    arrow: <><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></>,
    phone: <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.7 2.6a2 2 0 0 1-.5 2.1L8 9.7a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.8.3 1.7.5 2.6.6a2 2 0 0 1 2 2.3z"/>,
    message: <><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/><path d="M8 9h8M8 13h5"/></>,
    menu: <path d="M4 7h16M4 12h16M4 17h16"/>,
    close: <path d="m6 6 12 12M18 6 6 18"/>,
    check: <path d="m5 12 4 4L19 6"/>,
    upload: <><path d="M12 16V4"/><path d="m7 9 5-5 5 5"/><path d="M5 20h14"/></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

function BrandIcon({ name }: { name: string }) {
  if (name === "telegram") return <svg viewBox="0 0 24 24"><path d="M21.7 3.4 18.5 20c-.2 1.2-.9 1.5-1.9.9l-4.9-3.6-2.4 2.3c-.3.3-.5.5-1 .5l.4-5 9.1-8.2c.4-.4-.1-.6-.6-.2L6 13.7l-4.8-1.5c-1-.3-1-1 .2-1.5L20 3.5c.9-.3 1.9.2 1.7-.1z"/></svg>;
  if (name === "vk") return <svg viewBox="0 0 24 24"><path d="M12.8 17.2h1.4s.4-.1.6-.4c.2-.3.2-.8.2-.8s0-2.4 1.1-2.8c1.1-.3 2.4 2.3 3.8 3.3 1 .8 1.8.6 1.8.6l3.6-.1s1.9-.1 1-1.6c-.1-.1-.5-1.1-2.7-3.1-2.3-2.1-2-1.8.8-5.5 1.7-2.2 2.4-3.6 2.2-4.2-.2-.6-1.5-.5-1.5-.5h-4s-.3 0-.5.2c-.2.1-.3.4-.3.4s-.7 1.8-1.6 3.3c-2 3.3-2.8 3.5-3.1 3.3-.8-.5-.6-2-.6-3.1 0-3.4.5-4.8-1-5.2-.5-.1-.8-.2-2-.2-1.5 0-2.8 0-3.5.4-.5.3-.9.9-.7.9.2 0 .8.1 1.1.5.4.5.4 1.7.4 1.7s.2 3.3-.5 3.7c-.5.3-1.2-.3-2.7-3.3-.8-1.5-1.3-3.1-1.3-3.1s-.1-.3-.3-.4C4.2 2 3.8 2 3.8 2H0s-.6 0-.8.3c-.2.3 0 .8 0 .8s3 7 6.4 10.5c3.1 3.3 6.7 3.1 6.7 3.1z" transform="scale(.82) translate(1.6 2.6)"/></svg>;
  if (name === "whatsapp") return <svg viewBox="0 0 24 24"><path d="M20.5 3.5A11.8 11.8 0 0 0 12.1 0C5.6 0 .3 5.3.3 11.8c0 2.1.5 4.1 1.6 5.9L.2 24l6.4-1.7a11.8 11.8 0 0 0 5.6 1.4c6.5 0 11.8-5.3 11.8-11.8 0-3.2-1.2-6.1-3.5-8.4zm-8.3 18.2c-1.8 0-3.5-.5-5-1.4l-.4-.2-3.8 1 1-3.7-.2-.4a9.8 9.8 0 1 1 8.4 4.7zm5.4-7.3c-.3-.1-1.8-.9-2.1-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-1.7-.8-2.8-1.5-3.9-3.4-.3-.5.3-.5.8-1.7.1-.2 0-.4 0-.6L9.3 7c-.2-.5-.5-.5-.7-.5H8c-.2 0-.6.1-.9.4-.3.3-1.2 1.2-1.2 2.9 0 1.7 1.3 3.4 1.4 3.6.2.2 2.5 3.8 6 5.3.8.4 1.5.6 2 .7.8.3 1.6.2 2.2.1.7-.1 1.8-.7 2.1-1.4.3-.7.3-1.3.2-1.4-.1-.2-.3-.2-.6-.4z"/></svg>;
  if (name === "rutube") return <svg viewBox="0 0 24 24"><path d="M4 4h9.2c4 0 6.3 2 6.3 5.3 0 2.2-1.1 3.9-3 4.7L21 20h-5.2l-3.7-5.2H8.4V20H4V4zm4.4 3.7v3.5h4.3c1.5 0 2.3-.6 2.3-1.8 0-1.1-.8-1.7-2.3-1.7H8.4z"/></svg>;
  return <svg viewBox="0 0 24 24"><path d="M5 5h4.5L12 9l2.5-4H19v14h-4v-7l-3 4.5L9 12v7H5V5z"/></svg>;
}

function Logo() {
  return <Link className="logo logo-image-link" href="/" aria-label="СМП МАРКО — на главную"><Image src="/marko-logo.jpg" alt="МАРКО" width={256} height={80} priority className="header-logo-image"/></Link>;
}

const LeadContext = createContext<(() => void) | null>(null);

export function LeadButton({ children = "Расчёт за 1 день", className = "button" }: { children?: React.ReactNode; className?: string }) {
  const openLead = useContext(LeadContext);
  return <button className={className} type="button" onClick={() => openLead?.()}>{children}</button>;
}

export function SocialLinks({ labels = false }: { labels?: boolean }) {
  return <div className={`brand-socials ${labels ? "with-labels" : ""}`}>{socials.map((s) => <a key={s.name} href={s.href} target="_blank" rel="noreferrer" aria-label={s.name}><BrandIcon name={s.icon}/>{labels && <span>{s.name}</span>}</a>)}</div>;
}

export function ProjectForm({ className = "" }: { className?: string }) {
  const [prepared, setPrepared] = useState(false);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const subject = "Заявка на расчёт перекрытия МАРКО";
    const body = [
      `Имя: ${form.get("name") || ""}`,
      `Телефон: ${form.get("phone") || ""}`,
      `Город/регион: ${form.get("region") || ""}`,
      `Тип объекта: ${form.get("objectType") || ""}`,
      `Комментарий: ${form.get("comment") || ""}`,
      "",
      "План или эскиз будет приложен к письму отдельно.",
    ].join("\n");
    setPrepared(true);
    window.location.href = `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return <form className={`project-form ${className}`} onSubmit={submit}>
    <div className="form-grid">
      <label><span>Имя</span><input name="name" required placeholder="Как к вам обращаться?"/></label>
      <label><span>Телефон</span><input name="phone" required type="tel" placeholder="+7 (___) ___-__-__"/></label>
      <label><span>Город / регион</span><input name="region" required placeholder="Где находится объект?"/></label>
      <label><span>Тип объекта</span><select name="objectType" required defaultValue=""><option value="" disabled>Выберите вариант</option><option>Частный дом</option><option>Многоквартирный дом</option><option>Коммерческий объект</option><option>Производственный объект</option><option>Реконструкция / капремонт</option><option>Другое</option></select></label>
    </div>
    <label><span>Комментарий</span><textarea name="comment" rows={3} placeholder="Площадь, пролёты, материал стен и что требуется рассчитать"/></label>
    <label className="file-field"><span><UiIcon name="upload"/> План или эскиз</span><input name="projectFile" type="file" accept=".pdf,.dwg,.jpg,.jpeg,.png"/><small>PDF, DWG, JPG или PNG. После нажатия кнопки откроется почтовая программа — приложите выбранный файл к готовому письму.</small></label>
    <label className="checkbox"><input type="checkbox" required/><i><UiIcon name="check" size={14}/></i><span>Согласен на обработку персональных данных по <Link href="/privacy">политике конфиденциальности</Link></span></label>
    <button className="button form-submit" type="submit">Подготовить письмо с заявкой <UiIcon name="arrow"/></button>
    {prepared && <p className="form-status">Заявка подготовлена в почтовом приложении. Не забудьте приложить выбранный файл.</p>}
  </form>;
}

function MessengerDock() {
  const [open, setOpen] = useState(false);
  const messengerLinks = socials.filter((social) => ["MAX", "WhatsApp", "Telegram", "ВКонтакте"].includes(social.name));
  return <div className={`messenger-dock ${open ? "is-open" : ""}`}>
    <div className="messenger-options">{messengerLinks.map((social) => <a key={social.name} className={`messenger-link messenger-${social.icon}`} href={social.href} target="_blank" rel="noreferrer" aria-label={`Написать в ${social.name}`} title={social.name}><BrandIcon name={social.icon}/></a>)}</div>
    <button className="messenger-toggle" onClick={() => setOpen((value) => !value)} aria-label={open ? "Закрыть список мессенджеров" : "Открыть мессенджеры"}>{open ? <UiIcon name="close"/> : <UiIcon name="message"/>}</button>
  </div>;
}

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const [menu, setMenu] = useState(false);
  const [lead, setLead] = useState(false);
  const [cookie, setCookie] = useState(false);

  useEffect(() => { setCookie(localStorage.getItem("marko-cookie") !== "accepted"); }, []);

  useEffect(() => { document.body.style.overflow = menu || lead ? "hidden" : ""; }, [menu, lead]);

  const links = [["Услуги","/services"],["Объекты","/objects"],["Реконструкция","/reconstruction"],["Технология","/technology"],["Статьи","/articles"],["Новости","/news"],["Калькулятор","/calculator"],["Контакты","/contacts"]];

  return <LeadContext.Provider value={() => setLead(true)}><>
    <header className="header"><div className="container header-inner"><Logo/><nav className="desktop-nav">{links.map(([title,href])=><Link key={href} href={href}>{title}</Link>)}</nav><div className="header-actions"><a className="header-phone" href={phoneHref}><UiIcon name="phone" size={17}/><span>{phoneDisplay}</span></a><LeadButton className="button button-small"/><button className="burger" onClick={()=>setMenu(true)} aria-label="Открыть меню"><UiIcon name="menu" size={24}/></button></div></div></header>
    <div className={`mobile-menu ${menu ? "is-open" : ""}`}><div className="mobile-menu-head"><Logo/><button onClick={()=>setMenu(false)} aria-label="Закрыть меню"><UiIcon name="close"/></button></div><nav>{links.map(([title,href],index)=><Link onClick={()=>setMenu(false)} key={href} href={href}>{title}<span>{String(index + 1).padStart(2,"0")}</span></Link>)}</nav><div className="mobile-menu-bottom"><div className="mobile-phones">{phones.map((phone)=><a key={phone.href} href={phone.href}>{phone.display}</a>)}</div><LeadButton>Отправить план</LeadButton></div></div>
    {children}
    <footer><div className="container footer-main"><div><Link href="/" className="footer-construction-logo"><Image src="/marko-construction.jpg" alt="MARKO CONSTRUCTION" width={1900} height={920}/></Link><p>Сборно-монолитные перекрытия для нового строительства, реконструкции и капитального ремонта.</p></div><div className="footer-nav"><b>Разделы</b>{links.map(([title,href])=><Link key={href} href={href}>{title}</Link>)}<Link href="/designers">Проектировщикам</Link><Link href="/about">О компании</Link></div><div><b>Связаться</b>{phones.map((phone)=><a className="footer-phone" key={phone.href} href={phone.href}>{phone.display}<small>{phone.city}</small></a>)}<a href={`mailto:${contactEmail}`}>{contactEmail}</a><p className="footer-address">{contactAddress}</p><SocialLinks/></div></div><div className="container footer-bottom"><span>© 2026 СМП МАРКО</span><Link href="/privacy">Политика конфиденциальности</Link><a href="#top">Наверх ↑</a></div></footer>
    <MessengerDock/>
    {cookie&&<div className="cookie"><div><b>Мы используем cookie</b><p>Они помогают сайту работать корректно.</p></div><button onClick={()=>{localStorage.setItem("marko-cookie","accepted");setCookie(false)}}>Хорошо</button><button className="cookie-close" onClick={()=>setCookie(false)} aria-label="Закрыть"><UiIcon name="close" size={18}/></button></div>}
    {lead&&<div className="modal-backdrop" onMouseDown={(event)=>{if(event.target===event.currentTarget)setLead(false)}}><div className="modal lead-modal"><button className="modal-close" onClick={()=>setLead(false)} aria-label="Закрыть"><UiIcon name="close"/></button><div className="eyebrow"><span/>Расчёт за 1 рабочий день</div><h2>Отправьте план перекрытия</h2><p>Принимаем PDF, DWG, фото плана или эскиз. Инженер подберёт систему и подготовит предварительный расчёт.</p><ProjectForm className="modal-project-form"/></div></div>}
  </></LeadContext.Provider>;
}
