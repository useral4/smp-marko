"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { phoneDisplay, phoneHref, socials } from "../data";

export function UiIcon({ name, size = 20 }: { name: string; size?: number }) {
  const paths: Record<string, React.ReactNode> = {
    arrow: <><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></>,
    phone: <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.7 2.6a2 2 0 0 1-.5 2.1L8 9.7a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.8.3 1.7.5 2.6.6a2 2 0 0 1 2 2.3z"/>,
    message: <><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/><path d="M8 9h8M8 13h5"/></>,
    menu: <path d="M4 7h16M4 12h16M4 17h16"/>,
    close: <path d="m6 6 12 12M18 6 6 18"/>,
    check: <path d="m5 12 4 4L19 6"/>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

function BrandIcon({ name }: { name: string }) {
  if (name === "telegram") return <svg viewBox="0 0 24 24"><path d="M21.7 3.4 18.5 20c-.2 1.2-.9 1.5-1.9.9l-4.9-3.6-2.4 2.3c-.3.3-.5.5-1 .5l.4-5 9.1-8.2c.4-.4-.1-.6-.6-.2L6 13.7l-4.8-1.5c-1-.3-1-1 .2-1.5L20 3.5c.9-.3 1.9.2 1.7-.1z"/></svg>;
  if (name === "vk") return <svg viewBox="0 0 24 24"><path d="M12.8 17.2h1.4s.4-.1.6-.4c.2-.3.2-.8.2-.8s0-2.4 1.1-2.8c1.1-.3 2.4 2.3 3.8 3.3 1 .8 1.8.6 1.8.6l3.6-.1s1.9-.1 1-1.6c-.1-.1-.5-1.1-2.7-3.1-2.3-2.1-2-1.8.8-5.5 1.7-2.2 2.4-3.6 2.2-4.2-.2-.6-1.5-.5-1.5-.5h-4s-.3 0-.5.2c-.2.1-.3.4-.3.4s-.7 1.8-1.6 3.3c-2 3.3-2.8 3.5-3.1 3.3-.8-.5-.6-2-.6-3.1 0-3.4.5-4.8-1-5.2-.5-.1-.8-.2-2-.2-1.5 0-2.8 0-3.5.4-.5.3-.9.9-.7.9.2 0 .8.1 1.1.5.4.5.4 1.7.4 1.7s.2 3.3-.5 3.7c-.5.3-1.2-.3-2.7-3.3-.8-1.5-1.3-3.1-1.3-3.1s-.1-.3-.3-.4C4.2 2 3.8 2 3.8 2H0s-.6 0-.8.3c-.2.3 0 .8 0 .8s3 7 6.4 10.5c3.1 3.3 6.7 3.1 6.7 3.1z" transform="scale(.82) translate(1.6 2.6)"/></svg>;
  if (name === "youtube") return <svg viewBox="0 0 24 24"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.6 15.6V8.4L15.8 12l-6.2 3.6z"/></svg>;
  if (name === "whatsapp") return <svg viewBox="0 0 24 24"><path d="M20.5 3.5A11.8 11.8 0 0 0 12.1 0C5.6 0 .3 5.3.3 11.8c0 2.1.5 4.1 1.6 5.9L.2 24l6.4-1.7a11.8 11.8 0 0 0 5.6 1.4c6.5 0 11.8-5.3 11.8-11.8 0-3.2-1.2-6.1-3.5-8.4zm-8.3 18.2c-1.8 0-3.5-.5-5-1.4l-.4-.2-3.8 1 1-3.7-.2-.4a9.8 9.8 0 1 1 8.4 4.7zm5.4-7.3c-.3-.1-1.8-.9-2.1-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-1.7-.8-2.8-1.5-3.9-3.4-.3-.5.3-.5.8-1.7.1-.2 0-.4 0-.6L9.3 7c-.2-.5-.5-.5-.7-.5H8c-.2 0-.6.1-.9.4-.3.3-1.2 1.2-1.2 2.9 0 1.7 1.3 3.4 1.4 3.6.2.2 2.5 3.8 6 5.3.8.4 1.5.6 2 .7.8.3 1.6.2 2.2.1.7-.1 1.8-.7 2.1-1.4.3-.7.3-1.3.2-1.4-.1-.2-.3-.2-.6-.4z"/></svg>;
  return <svg viewBox="0 0 24 24"><path d="M5 5h4.5L12 9l2.5-4H19v14h-4v-7l-3 4.5L9 12v7H5V5z"/></svg>;
}

function Logo() {
  return <Link className="logo" href="/" aria-label="СМП МАРКО — на главную"><span className="logo-mark"><i/><i/><i/></span><span><b>МАРКО</b><small>стройматериалы · Москва</small></span></Link>;
}

export function LeadButton({ children = "Получить расчёт", className = "button" }: { children?: React.ReactNode; className?: string }) {
  return <button className={className} onClick={() => window.dispatchEvent(new Event("open-lead"))}>{children}</button>;
}

export function SocialLinks({ labels = false }: { labels?: boolean }) {
  return <div className={`brand-socials ${labels ? "with-labels" : ""}`}>{socials.map((s) => <a key={s.name} href={s.href} target="_blank" rel="noreferrer" aria-label={s.name}><BrandIcon name={s.icon}/>{labels && <span>{s.name}</span>}</a>)}</div>;
}

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const [menu, setMenu] = useState(false);
  const [lead, setLead] = useState(false);
  const [cookie, setCookie] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const open = () => setLead(true);
    window.addEventListener("open-lead", open);
    setCookie(localStorage.getItem("marko-cookie") !== "accepted");
    return () => window.removeEventListener("open-lead", open);
  }, []);

  useEffect(() => { document.body.style.overflow = menu || lead ? "hidden" : ""; }, [menu, lead]);

  const submit = (e: FormEvent) => { e.preventDefault(); setSent(true); setTimeout(() => { setLead(false); setSent(false); }, 1800); };
  const links = [["Услуги","/services"],["Цены","/prices"],["Технология","/technology"],["О компании","/about"],["Контакты","/contacts"]];

  return <>
    <header className="header"><div className="container header-inner"><Logo/><nav className="desktop-nav">{links.map(([t,h])=><Link key={h} href={h}>{t}</Link>)}</nav><div className="header-actions"><a className="header-phone" href={phoneHref}><UiIcon name="phone" size={17}/><span>{phoneDisplay}</span></a><LeadButton className="button button-small"/><button className="burger" onClick={()=>setMenu(true)} aria-label="Открыть меню"><UiIcon name="menu" size={24}/></button></div></div></header>
    <div className={`mobile-menu ${menu?"is-open":""}`}><div className="mobile-menu-head"><Logo/><button onClick={()=>setMenu(false)} aria-label="Закрыть меню"><UiIcon name="close"/></button></div><nav>{links.map(([t,h],i)=><Link onClick={()=>setMenu(false)} key={h} href={h}>{t}<span>0{i+1}</span></Link>)}</nav><div className="mobile-menu-bottom"><a href={phoneHref}>{phoneDisplay}</a><LeadButton>Обсудить проект</LeadButton></div></div>
    {children}
    <footer><div className="container footer-main"><div><Logo/><p>Сборно-монолитные перекрытия для строительства и реконструкции.</p></div><div className="footer-nav"><b>Разделы</b>{links.map(([t,h])=><Link key={h} href={h}>{t}</Link>)}</div><div><b>Связаться</b><a className="footer-phone" href={phoneHref}>{phoneDisplay}</a><a href="mailto:info@kolumb.ru">info@kolumb.ru</a><SocialLinks/></div></div><div className="container footer-bottom"><span>© 2026 СМП МАРКО</span><Link href="/privacy">Политика конфиденциальности</Link><a href="#top">Наверх ↑</a></div></footer>
    <div className="floating-actions"><a className="float-call" href={phoneHref} aria-label="Позвонить"><UiIcon name="phone"/></a><LeadButton className="float-message"><UiIcon name="message"/><span>Напишите нам</span></LeadButton></div>
    {cookie&&<div className="cookie"><div><b>Мы используем cookie</b><p>Они помогают сайту работать корректно.</p></div><button onClick={()=>{localStorage.setItem("marko-cookie","accepted");setCookie(false)}}>Хорошо</button><button className="cookie-close" onClick={()=>setCookie(false)} aria-label="Закрыть"><UiIcon name="close" size={18}/></button></div>}
    {lead&&<div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setLead(false)}}><div className="modal"><button className="modal-close" onClick={()=>setLead(false)} aria-label="Закрыть"><UiIcon name="close"/></button><div className="eyebrow"><span/>Бесплатный расчёт</div><h2>Расскажите о вашем объекте</h2><p>Инженер уточнит детали и подготовит предварительную стоимость.</p><form onSubmit={submit}><label><span>Ваше имя</span><input required placeholder="Как к вам обращаться?"/></label><label><span>Телефон</span><input required type="tel" placeholder="+7 (___) ___-__-__"/></label><label className="checkbox"><input type="checkbox" required/><i><UiIcon name="check" size={14}/></i><span>Согласен на обработку персональных данных по <Link href="/privacy">политике конфиденциальности</Link></span></label><button className="button" type="submit">{sent?"Спасибо! Свяжемся с вами":<>Получить расчёт <UiIcon name="arrow"/></>}</button></form></div></div>}
  </>;
}
