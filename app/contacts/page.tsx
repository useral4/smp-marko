import type { Metadata } from "next";
import Link from "next/link";
import ObjectsMap from "../components/ObjectsMap";
import { LeadButton, SocialLinks, UiIcon } from "../components/SiteShell";
import { pageText, readPage, readProjects, readSiteContent } from "../../lib/runtime-content";

export const metadata:Metadata={title:"Контакты СМП МАРКО",description:"Телефоны Москвы и Санкт-Петербурга, почта, мессенджеры и карты СМП МАРКО."};

export default async function ContactsPage(){
  const [site,projects,page]=await Promise.all([readSiteContent(),readProjects(),readPage("contacts")]);
  const requisiteRows=[
    ["Полное наименование",pageText(page,"companyLegalName","")],
    ["Юридический адрес",pageText(page,"legalAddress","")],
    ["Почтовый адрес",pageText(page,"postalAddress","")],
    ["ИНН",pageText(page,"inn","")],
    ["КПП",pageText(page,"kpp","")],
    ["ОГРН / ОГРНИП",pageText(page,"ogrn","")],
    ["Руководитель",pageText(page,"director","")],
    ["Банк",pageText(page,"bankName","")],
    ["Расчётный счёт",pageText(page,"settlementAccount","")],
    ["Корреспондентский счёт",pageText(page,"correspondentAccount","")],
    ["БИК",pageText(page,"bik","")],
  ].filter(([,value])=>value.trim());
  const requisitesNote=pageText(page,"requisitesNote","");
  const showRequisites=requisiteRows.length>0||Boolean(requisitesNote.trim());
  return <main id="top"><section className="page-hero contact-page-hero"><div className="container"><div className="breadcrumbs"><Link href="/">Главная</Link><span>—</span>Контакты</div><div className="page-hero-grid"><h1>{pageText(page,"heading","Контакты")}</h1><p>{pageText(page,"lead","Позвоните или напишите в MAX, WhatsApp, Telegram либо ВКонтакте. Инженер поможет собрать исходные данные для расчёта.")}</p></div><div className="contact-cards contact-cards-wide">{site.phones.map((phone)=><a href={phone.href} key={phone.href}><small>{phone.city}</small><b>{phone.display}</b></a>)}<a href={`mailto:${site.email}`}><small>{pageText(page,"emailLabel","Электронная почта")}</small><b>{site.email}</b></a><div><small>{pageText(page,"socialsLabel","Социальные сети и мессенджеры")}</small><SocialLinks labels/></div><div className="contact-address-card"><small>{pageText(page,"addressLabel","Адрес")}</small><b>{site.address}</b></div></div></div></section>{showRequisites&&<section className="section contact-requisites-section" id="requisites"><div className="container"><div className="section-index">Для договоров и бухгалтерии</div><h2>{pageText(page,"requisitesHeading","Реквизиты организации")}</h2><dl className="contact-requisites">{requisiteRows.map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>{requisitesNote&&<p className="contact-requisites-note">{requisitesNote}</p>}</div></section>}<section className="map-page-section" id="contact-map"><div className="container map-heading"><div><div className="section-index">{pageText(page,"contactMapEyebrow","Контактная карта")}</div><h2>{pageText(page,"contactMapHeading","Офис и производство")}</h2></div><LeadButton>{pageText(page,"contactMapButton","Записаться на встречу")} <UiIcon name="arrow"/></LeadButton></div><div className="map-frame"><iframe src={site.contactMap} title="Контактная карта СМП МАРКО" loading="lazy"/></div></section><section className="map-page-section objects-map-section" id="objects-map"><div className="container map-heading"><div><div className="section-index light">{pageText(page,"objectsMapEyebrow","География работ")}</div><h2>{pageText(page,"objectsMapHeading","Карта наших объектов")}</h2></div><Link className="text-link light-link" href="/objects">{pageText(page,"objectsMapButton","Открыть раздел объектов")} <UiIcon name="arrow"/></Link></div><div className="map-frame"><ObjectsMap projects={projects}/></div></section></main>}
