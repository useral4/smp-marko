"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const frames = [
  { n:"01", title:"Исходные данные", text:"Получаем планы, размеры и требования к будущему перекрытию.", image:"/service-design.jpg" },
  { n:"02", title:"Инженерный расчёт", text:"Определяем пролёты, нагрузки, шаг балок и готовим монтажную схему.", image:"/construction-scheme.webp" },
  { n:"03", title:"Производство", text:"Изготавливаем балки и комплектуем все элементы под конкретный объект.", image:"/service-supply.png" },
  { n:"04", title:"Готовое перекрытие", text:"Доставляем, собираем и подготавливаем систему к бетонированию.", image:"/floor-system.png" },
];

export default function ScrollStory() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  useEffect(()=>{
    const update=()=>{if(!ref.current)return;const r=ref.current.getBoundingClientRect();const travel=ref.current.offsetHeight-innerHeight;const p=Math.max(0,Math.min(1,-r.top/travel));setActive(Math.min(frames.length-1,Math.floor(p*frames.length)))};
    update(); addEventListener("scroll",update,{passive:true}); return()=>removeEventListener("scroll",update);
  },[]);
  return <section className="scroll-story" id="story" ref={ref}><div className="story-sticky"><div className="container story-layout"><div className="story-copy"><div className="section-index light">Как рождается перекрытие</div><h2>Один блок.<br/>Четыре этапа.</h2><div className="story-progress">{frames.map((f,i)=><span key={f.n} className={i===active?"active":""}/>)}</div><div className="story-text" key={frames[active].n}><small>{frames[active].n} / 04</small><h3>{frames[active].title}</h3><p>{frames[active].text}</p></div></div><div className="story-visual">{frames.map((f,i)=><Image key={f.n} className={i===active?"active":""} src={f.image} alt={f.title} fill sizes="55vw"/>) }<div className="story-number">{frames[active].n}</div></div></div></div></section>;
}
