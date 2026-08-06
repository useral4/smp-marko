"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import type { StoryFrame } from "../../lib/page-builder";

export const defaultStoryFrames: StoryFrame[] = [
  { title:"Подготовка стен", text:"Формируем опорный пояс и проверяем геометрию стен перед монтажом перекрытия.", image:"/archive/walls-ring-beam-stage.jpg" },
  { title:"Монтаж балок", text:"Устанавливаем временные опоры и раскладываем несущие балки по монтажной схеме.", image:"/archive/beams-installation-stage.jpg" },
  { title:"Раскладка системы", text:"Выставляем шаг балок и подготавливаем основание под заполнение пролётов.", image:"/archive/beam-layout-stage.jpg" },
  { title:"Укладка блоков", text:"Заполняем пространство между балками лёгкими газобетонными блоками.", image:"/archive/blocks-on-beams-detail.jpg" },
  { title:"Армирование", text:"Укладываем арматурную сетку и усиливаем проёмы, края и опорные участки.", image:"/archive/mesh-installation-stage.jpg" },
  { title:"Бетонирование", text:"После бетонирования элементы работают вместе как единое сборно-монолитное перекрытие.", image:"/archive/marko-slab-section-a.jpg" },
];

export default function ScrollStory({
  title = "Монтаж по этапам",
  frames = defaultStoryFrames,
  background = "#0b222c",
  textColor = "#ffffff",
  cardBackground = "#ffffff",
  cardRadius = 18,
}: {
  title?: string;
  frames?: StoryFrame[];
  background?: string;
  textColor?: string;
  cardBackground?: string;
  cardRadius?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  useEffect(() => {
    const update = () => {
      if (!ref.current) return;
      const bounds = ref.current.getBoundingClientRect();
      const travel = ref.current.offsetHeight - innerHeight;
      const progress = Math.max(0, Math.min(1, -bounds.top / travel));
      setActive(Math.min(frames.length - 1, Math.floor(progress * frames.length)));
    };
    update();
    addEventListener("scroll", update, { passive: true });
    return () => removeEventListener("scroll", update);
  }, [frames.length]);

  if (!frames.length) return null;
  const current = frames[Math.min(active, frames.length - 1)];
  const style = {
    "--story-bg": background,
    "--story-text": textColor,
    "--story-card": cardBackground,
    "--story-radius": `${cardRadius}px`,
  } as CSSProperties;

  return <section className="scroll-story" id="story" ref={ref} style={style}>
    <div className="story-sticky"><div className="container story-layout">
      <div className="story-copy">
        <h2>{title}</h2>
        <div className="story-progress">{frames.map((frame,index)=><span key={`${frame.title}-${index}`} className={index===active?"active":""}/>)}</div>
        <div className="story-text" key={`${current.title}-${active}`}>
          <small>{String(active + 1).padStart(2,"0")} / {String(frames.length).padStart(2,"0")}</small>
          <h3>{current.title}</h3><p>{current.text}</p>
        </div>
      </div>
      <div className="story-visual">
        {frames.map((frame,index)=><Image key={`${frame.image}-${index}`} className={index===active?"active":""} src={frame.image} alt={frame.title} fill sizes="55vw"/>)}
        <div className="story-number">{String(active + 1).padStart(2,"0")}</div>
      </div>
    </div></div>
  </section>;
}
