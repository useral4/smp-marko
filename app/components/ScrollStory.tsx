"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const frames = [
  { n:"01", title:"Подготовка стен", text:"Формируем опорный пояс и проверяем геометрию стен перед монтажом перекрытия.", image:"/archive/walls-ring-beam-stage.jpg" },
  { n:"02", title:"Монтаж балок", text:"Устанавливаем временные опоры и раскладываем несущие балки по монтажной схеме.", image:"/archive/beams-installation-stage.jpg" },
  { n:"03", title:"Раскладка системы", text:"Выставляем шаг балок и подготавливаем основание под заполнение пролётов.", image:"/archive/beam-layout-stage.jpg" },
  { n:"04", title:"Укладка блоков", text:"Заполняем пространство между балками лёгкими газобетонными блоками.", image:"/archive/blocks-on-beams-detail.jpg" },
  { n:"05", title:"Армирование", text:"Укладываем арматурную сетку и усиливаем проёмы, края и опорные участки.", image:"/archive/mesh-installation-stage.jpg" },
  { n:"06", title:"Бетонирование", text:"После бетонирования элементы работают вместе как единое сборно-монолитное перекрытие.", image:"/archive/marko-slab-section-a.jpg" },
];

export default function ScrollStory() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  useEffect(()=>{
    const update=()=>{if(!ref.current)return;const r=ref.current.getBoundingClientRect();const travel=ref.current.offsetHeight-innerHeight;const p=Math.max(0,Math.min(1,-r.top/travel));setActive(Math.min(frames.length-1,Math.floor(p*frames.length)))};
    update(); addEventListener("scroll",update,{passive:true}); return()=>removeEventListener("scroll",update);
  },[]);
  return <section className="scroll-story" id="story" ref={ref}><div className="story-sticky"><div className="container story-layout"><div className="story-copy"><h2>Монтаж<br/>по этапам</h2><div className="story-progress">{frames.map((f,i)=><span key={f.n} className={i===active?"active":""}/>)}</div><div className="story-text" key={frames[active].n}><small>{frames[active].n} / 06</small><h3>{frames[active].title}</h3><p>{frames[active].text}</p></div></div><div className="story-visual">{frames.map((f,i)=><Image key={f.n} className={i===active?"active":""} src={f.image} alt={f.title} fill sizes="55vw"/>) }<div className="story-number">{frames[active].n}</div></div></div></div></section>;
}
