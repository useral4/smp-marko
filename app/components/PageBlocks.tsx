import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import type { PageBlock } from "../../lib/page-builder";

export default function PageBlocks({ blocks }: { blocks: PageBlock[] }) {
  return blocks.map((block) => {
    const style = {
      "--block-bg": block.background,
      "--block-text": block.textColor,
      "--block-border": block.borderColor,
      "--block-radius": `${block.radius}px`,
    } as CSSProperties;
    const copy = <div className="builder-block-copy">
      {block.eyebrow && <div className="section-index">{block.eyebrow}</div>}
      {block.heading && <h2>{block.heading}</h2>}
      {block.text && <p>{block.text}</p>}
      {block.buttonText && block.buttonHref && <Link className="button" href={block.buttonHref}>{block.buttonText}</Link>}
    </div>;
    const image = block.image && <div className="builder-block-image"><Image src={block.image} alt={block.heading || "Изображение блока"} fill sizes="(max-width:900px) 100vw,50vw" /></div>;
    return <section className={`section builder-block builder-block-${block.type}`} style={style} key={block.id}>
      <div className="container builder-block-inner">
        {block.type === "image-left" && image}
        {copy}
        {block.type === "image-right" && image}
      </div>
    </section>;
  });
}
