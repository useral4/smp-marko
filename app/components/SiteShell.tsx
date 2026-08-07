"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createContext, FormEvent, useContext, useEffect, useState } from "react";
import type { CmsPhone, CmsSocial } from "../generated-content";
import type { CmsPage } from "../../lib/runtime-content";
import { pageBlocks, pageThemeStyle, pageVisualOverrides } from "../../lib/page-builder";
import PageBlocks from "./PageBlocks";
import PageVisualOverrides from "./PageVisualOverrides";

export type SiteShellContent = {
  phones: CmsPhone[];
  socials: CmsSocial[];
  email: string;
  address: string;
  contactMap: string;
};

const SiteContentContext = createContext<SiteShellContent>({
  phones: [],
  socials: [],
  email: "",
  address: "",
  contactMap: "",
});

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
  if (name === "vk") return <svg viewBox="0 0 100 100"><path fillRule="evenodd" clipRule="evenodd" d="M50 100c27.614 0 50-22.386 50-50S77.614 0 50 0 0 22.386 0 50s22.386 50 50 50Zm-5.08-76.414a48.135 48.135 0 0 0 2.187-.422c.324-.08 1.735-.153 3.134-.163 2.047-.013 3.002.067 4.89.41 7.843 1.428 13.918 5.42 18.472 12.135 1.99 2.934 3.603 7.076 4.066 10.44.313 2.276.265 7.758-.084 9.632-.373 2.006-1.503 5.362-2.424 7.2-2.132 4.25-5.556 8.135-9.378 10.638-1.183.774-3.108 1.843-3.838 2.13-.324.127-.669.291-.766.364-.387.29-3.382 1.191-5.337 1.604-1.807.382-2.488.44-5.279.445-2.862.007-3.437-.042-5.395-.455-3.863-.814-7.02-2.082-9.589-3.85-.587-.404-1.059-.363-4.407.381-3.654.812-4.57.94-4.88.682-.382-.316-.335-.8.4-4.153.749-3.409.938-4.215.702-4.867-.082-.227-.216-.436-.397-.731-2.693-4.394-3.984-9.062-3.997-14.46-.012-4.75.867-8.55 2.898-12.526.727-1.424 2.002-3.481 2.66-4.293.753-.927 4.735-4.855 5.312-5.24 2.412-1.604 2.967-1.933 4.722-2.79 1.91-.934 4.466-1.787 6.329-2.11Zm-4.47 22.33c-.949-2.514-1.303-3.314-1.605-3.615-.316-.317-.585-.352-3.088-.4-2.973-.058-3.103-.022-3.396.94-.119.39.636 3.353.932 3.657a.624.624 0 0 1 .156.375c0 .21.655 1.726 1.42 3.283.396.807 2.79 4.884 2.955 5.034.051.047.547.692 1.102 1.433 1.524 2.037 3.773 4.03 5.762 5.105 1.877 1.015 4.904 1.58 7.043 1.312 1.52-.19 1.615-.358 1.615-2.881 0-3.283.375-3.786 2.166-2.903.73.36 3.253 2.726 4.916 4.61.417.473.924.947 1.127 1.054.385.204 5.693.285 6.19.094.496-.19.516-1.17.043-2.138-.546-1.117-2.396-3.43-4.437-5.55-1.08-1.121-1.575-1.76-1.575-2.033 0-.34.841-1.897 1.161-2.15.107-.084.956-1.339 1.282-1.893.094-.16.636-1.07 1.204-2.023 1.464-2.455 1.755-3.08 1.864-4.002.088-.74.057-.84-.335-1.097-.367-.24-.822-.275-3.044-.228-2.49.051-2.631.073-3.043.46-.237.223-.479.565-.536.758-.168.565-1.947 4.025-2.2 4.278-.127.127-.23.305-.23.397 0 .281-1.514 2.377-2.339 3.24-.903.943-1.416 1.2-1.888.947-.31-.165-.326-.399-.329-4.679-.002-3.293-.06-4.617-.216-4.926l-.213-.421H45.35l-.25.447c-.24.425-.219.501.414 1.518l.666 1.07v4.3c0 4.29 0 4.3-.367 4.352-.5.07-1.505-.864-2.465-2.296-.797-1.188-2.506-4.389-2.898-5.429Z"/></svg>;
  if (name === "whatsapp") return <svg viewBox="0 0 100 100"><path fillRule="evenodd" clipRule="evenodd" d="M50 100C77.6142 100 100 77.6142 100 50C100 22.3858 77.6142 0 50 0C22.3858 0 0 22.3858 0 50C0 77.6142 22.3858 100 50 100ZM69.7626 28.9928C64.6172 23.841 57.7739 21.0027 50.4832 21C35.4616 21 23.2346 33.2252 23.2292 48.2522C23.2274 53.0557 24.4823 57.7446 26.8668 61.8769L23 76L37.4477 72.2105C41.4282 74.3822 45.9107 75.5262 50.4714 75.528H50.4823C65.5029 75.528 77.7299 63.301 77.7363 48.2749C77.7408 40.9915 74.9089 34.1446 69.7626 28.9928ZM62.9086 53.9588C62.2274 53.6178 58.8799 51.9708 58.2551 51.7435C57.6313 51.5161 57.1766 51.4024 56.7228 52.0845C56.269 52.7666 54.964 54.2998 54.5666 54.7545C54.1692 55.2092 53.7718 55.2656 53.0915 54.9246C52.9802 54.8688 52.8283 54.803 52.6409 54.7217C51.6819 54.3057 49.7905 53.4855 47.6151 51.5443C45.5907 49.7382 44.2239 47.5084 43.8265 46.8272C43.4291 46.1452 43.7837 45.7769 44.1248 45.4376C44.3292 45.2338 44.564 44.9478 44.7987 44.662C44.9157 44.5194 45.0328 44.3768 45.146 44.2445C45.4345 43.9075 45.56 43.6516 45.7302 43.3049C45.7607 43.2427 45.7926 43.1776 45.8272 43.1087C46.0545 42.654 45.9409 42.2565 45.7708 41.9155C45.6572 41.6877 45.0118 40.1167 44.4265 38.6923C44.1355 37.984 43.8594 37.3119 43.671 36.8592C43.1828 35.687 42.6883 35.69 42.2913 35.6924C42.2386 35.6928 42.1876 35.6931 42.1386 35.6906C41.7421 35.6706 41.2874 35.667 40.8336 35.667C40.3798 35.667 39.6423 35.837 39.0175 36.5191C38.9773 36.5631 38.9323 36.6111 38.8834 36.6633C38.1738 37.4209 36.634 39.0648 36.634 42.2002C36.634 45.544 39.062 48.7748 39.4124 49.2411L39.415 49.2444C39.4371 49.274 39.4767 49.3309 39.5333 49.4121C40.3462 50.5782 44.6615 56.7691 51.0481 59.5271C52.6732 60.2291 53.9409 60.6475 54.9303 60.9612C56.5618 61.4796 58.046 61.4068 59.22 61.2313C60.5286 61.0358 63.2487 59.5844 63.8161 57.9938C64.3836 56.4033 64.3836 55.0392 64.2136 54.7554C64.0764 54.5258 63.7545 54.3701 63.2776 54.1395C63.1633 54.0843 63.0401 54.0247 62.9086 53.9588Z"/></svg>;
  if (name === "rutube") return <svg viewBox="0 0 24 24"><path d="M4 4h9.2c4 0 6.3 2 6.3 5.3 0 2.2-1.1 3.9-3 4.7L21 20h-5.2l-3.7-5.2H8.4V20H4V4zm4.4 3.7v3.5h4.3c1.5 0 2.3-.6 2.3-1.8 0-1.1-.8-1.7-2.3-1.7H8.4z"/></svg>;
  return <svg viewBox="0 0 48 48"><path fillRule="evenodd" clipRule="evenodd" d="M24 0C37.2548 0 48 10.7452 48 24C48 37.2548 37.2548 48 24 48C10.7452 48 0 37.2548 0 24C0 10.7452 10.7452 0 24 0ZM24.2314 12.5C17.8663 12.5 12.4942 17.4255 12.4941 23.9727C12.4941 26.714 13.0015 28.6059 13.4482 30.3047C13.8233 31.6836 14.1543 32.9467 14.1543 34.4414C14.3143 36.4326 17.9823 35.2685 19.1406 33.7793C20.9718 35.1031 22.0251 35.4346 24.292 35.4346C30.5586 35.4011 35.6151 30.2999 35.5938 24.0332C35.5937 17.6682 30.602 12.5 24.2314 12.5ZM24.3857 18.1592V18.165C27.5981 18.349 30.0709 21.0719 29.9453 24.2871C29.7296 27.4955 26.9854 29.9406 23.7734 29.7861C22.768 29.7055 21.8016 29.3614 20.9717 28.7881C20.4699 29.2899 19.6648 29.9402 19.3447 29.8633C18.6774 29.6868 17.8938 26.2951 18.335 23.5098C18.87 20.1452 21.2859 17.9993 24.3857 18.1592Z"/></svg>;
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
  const { socials } = useContext(SiteContentContext);
  return <div className={`brand-socials ${labels ? "with-labels" : ""}`}>{socials.map((s) => <a className={`brand-social-${s.icon}`} key={s.name} href={s.href} target="_blank" rel="noreferrer" aria-label={s.name}><BrandIcon name={s.icon}/>{labels && <span>{s.name}</span>}</a>)}</div>;
}

export function ProjectForm({ className = "" }: { className?: string }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const file=form.get("projectFile");
    if(file instanceof File&&file.size>15*1024*1024){setError("Файл больше 15 МБ");return}
    setSubmitting(true);setError("");
    try{
      const response=await fetch("/api/leads",{method:"POST",body:form});
      const result=await response.json() as {ok?:boolean;error?:string};
      if(!response.ok||!result.ok)throw new Error(result.error||"Не удалось отправить заявку");
      router.push("/thanks");
    }catch(nextError){setError(nextError instanceof Error?nextError.message:"Не удалось отправить заявку");setSubmitting(false)}
  };

  return <form className={`project-form ${className}`} onSubmit={submit}>
    <div className="form-grid">
      <label><span>Имя</span><input name="name" required placeholder="Как к вам обращаться?"/></label>
      <label><span>Телефон</span><input name="phone" required type="tel" placeholder="+7 (___) ___-__-__"/></label>
      <label><span>Город / регион</span><input name="region" required placeholder="Где находится объект?"/></label>
      <label><span>Тип объекта</span><select name="objectType" required defaultValue=""><option value="" disabled>Выберите вариант</option><option>Частный дом</option><option>Многоквартирный дом</option><option>Коммерческий объект</option><option>Производственный объект</option><option>Реконструкция / капремонт</option><option>Другое</option></select></label>
    </div>
    <label><span>Комментарий</span><textarea name="comment" rows={3} placeholder="Площадь, пролёты, материал стен и что требуется рассчитать"/></label>
    <label className="form-honeypot" aria-hidden="true"><span>Сайт компании</span><input name="companyWebsite" tabIndex={-1} autoComplete="off"/></label>
    <label className="file-field"><span><UiIcon name="upload"/> План или эскиз</span><input name="projectFile" type="file" accept=".pdf,.dwg,.jpg,.jpeg,.png,.webp"/><small>PDF, DWG, JPG, PNG или WEBP, до 15 МБ. Файл отправится вместе с заявкой.</small></label>
    <label className="checkbox"><input type="checkbox" required/><i><UiIcon name="check" size={14}/></i><span>Согласен на обработку персональных данных по <Link href="/privacy">политике конфиденциальности</Link></span></label>
    <button className="button form-submit" type="submit" disabled={submitting}>{submitting?"Отправляем…":"Отправить заявку"} <UiIcon name="arrow"/></button>
    {error && <p className="form-status form-status-error">{error}</p>}
  </form>;
}

function MessengerDock() {
  const { socials } = useContext(SiteContentContext);
  const [open, setOpen] = useState(false);
  const messengerLinks = socials.filter((social) => ["MAX", "WhatsApp", "Telegram", "ВКонтакте"].includes(social.name));
  return <div className={`messenger-dock ${open ? "is-open" : ""}`}>
    <div className="messenger-options">{messengerLinks.map((social) => <a key={social.name} className={`messenger-link messenger-${social.icon}`} href={social.href} target="_blank" rel="noreferrer" aria-label={`Написать в ${social.name}`} title={social.name}><BrandIcon name={social.icon}/></a>)}</div>
    <button className="messenger-toggle" onClick={() => setOpen((value) => !value)} aria-label={open ? "Закрыть список мессенджеров" : "Открыть мессенджеры"}>{open ? <UiIcon name="close"/> : <UiIcon name="message"/>}</button>
  </div>;
}

export default function SiteShell({
  children,
  siteContent,
  pages,
}: {
  children: React.ReactNode;
  siteContent: SiteShellContent;
  pages: CmsPage[];
}) {
  const pathname = usePathname();
  const [menu, setMenu] = useState(false);
  const [lead, setLead] = useState(false);
  const [cookie, setCookie] = useState(false);
  const {
    phones,
    socials,
    email: contactEmail,
    address: contactAddress,
  } = siteContent;
  const phoneDisplay = phones[0]?.display ?? "";
  const phoneHref = phones[0]?.href ?? "";
  const activePage = pages.find((page) => page.route === pathname) || null;

  useEffect(() => { setCookie(localStorage.getItem("marko-cookie") !== "accepted"); }, []);

  useEffect(() => { document.body.style.overflow = menu || lead ? "hidden" : ""; }, [menu, lead]);

  if (pathname.startsWith("/admin")) {
    return <>{children}</>;
  }

  const links = [["Услуги","/services"],["Объекты","/objects"],["Реконструкция","/reconstruction"],["Технология","/technology"],["Проектировщикам","/designers"],["Статьи","/articles"],["Новости","/news"],["Контакты","/contacts"]];

  return <SiteContentContext.Provider value={siteContent}><LeadContext.Provider value={() => setLead(true)}><>
    <header className="header"><div className="container header-inner"><Logo/><nav className="desktop-nav">{links.map(([title,href])=><Link key={href} href={href}>{title}</Link>)}</nav><div className="header-actions"><a className="header-phone" href={phoneHref}><UiIcon name="phone" size={17}/><span>{phoneDisplay}</span></a><LeadButton className="button button-small"/><button className="burger" onClick={()=>setMenu(true)} aria-label="Открыть меню"><UiIcon name="menu" size={24}/></button></div></div></header>
    <div className={`mobile-menu ${menu ? "is-open" : ""}`}><div className="mobile-menu-head"><Logo/><button onClick={()=>setMenu(false)} aria-label="Закрыть меню"><UiIcon name="close"/></button></div><nav>{links.map(([title,href],index)=><Link onClick={()=>setMenu(false)} key={href} href={href}>{title}<span>{String(index + 1).padStart(2,"0")}</span></Link>)}</nav><div className="mobile-menu-bottom"><div className="mobile-phones">{phones.map((phone)=><a key={phone.href} href={phone.href}>{phone.display}</a>)}</div><LeadButton>Отправить план</LeadButton></div></div>
    <div className={activePage ? "page-managed" : undefined} data-managed-page={activePage ? activePage.slug : undefined} style={activePage ? pageThemeStyle(activePage) : undefined}>
      {children}
      <PageBlocks blocks={pageBlocks(activePage)}/>
      {activePage && <PageVisualOverrides overrides={pageVisualOverrides(activePage)}/>}
    </div>
    <footer><div className="container footer-main"><div><Link href="/" className="footer-construction-logo"><Image src="/marko-construction.jpg" alt="MARKO CONSTRUCTION" width={1900} height={920}/></Link><p>Сборно-монолитные перекрытия для нового строительства, реконструкции и капитального ремонта.</p></div><div className="footer-nav"><b>Разделы</b>{links.map(([title,href])=><Link key={href} href={href}>{title}</Link>)}<Link href="/designers">Проектировщикам</Link><Link href="/about">О компании</Link></div><div><b>Связаться</b>{phones.map((phone)=><a className="footer-phone" key={phone.href} href={phone.href}>{phone.display}<small>{phone.city}</small></a>)}<a href={`mailto:${contactEmail}`}>{contactEmail}</a><p className="footer-address">{contactAddress}</p><SocialLinks/></div></div><div className="container footer-bottom"><span>© 2026 СМП МАРКО</span><Link href="/privacy">Политика конфиденциальности</Link><a href="#top">Наверх ↑</a></div></footer>
    <MessengerDock/>
    {cookie&&<div className="cookie"><div><b>Мы используем cookie</b><p>Они помогают сайту работать корректно.</p></div><button onClick={()=>{localStorage.setItem("marko-cookie","accepted");setCookie(false)}}>Хорошо</button><button className="cookie-close" onClick={()=>setCookie(false)} aria-label="Закрыть"><UiIcon name="close" size={18}/></button></div>}
    {lead&&<div className="modal-backdrop" onMouseDown={(event)=>{if(event.target===event.currentTarget)setLead(false)}}><div className="modal lead-modal"><button className="modal-close" onClick={()=>setLead(false)} aria-label="Закрыть"><UiIcon name="close"/></button><div className="eyebrow"><span/>Расчёт за 1 рабочий день</div><h2>Отправьте план перекрытия</h2><p>Принимаем PDF, DWG, фото плана или эскиз. Инженер подберёт систему и подготовит предварительный расчёт.</p><ProjectForm className="modal-project-form"/></div></div>}
  </></LeadContext.Provider></SiteContentContext.Provider>;
}
