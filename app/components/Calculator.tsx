"use client";

import { useMemo, useState } from "react";
import { products } from "../data";
import { LeadButton, UiIcon } from "./SiteShell";

const money = new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 });

export default function Calculator() {
  const [area, setArea] = useState(100);
  const [productIndex, setProductIndex] = useState(1);
  const product = products[productIndex];
  const estimate = useMemo(() => Math.max(0, area) * product.priceValue, [area, product.priceValue]);

  return <div className="calculator-grid">
    <div className="calculator-form">
      <label><span>Площадь перекрытия, м²</span><input type="number" min="10" max="5000" step="1" value={area} onChange={(event)=>setArea(Number(event.target.value))}/></label>
      <label><span>Тип перекрытия</span><select value={productIndex} onChange={(event)=>setProductIndex(Number(event.target.value))}>{products.map((item,index)=><option value={index} key={item.name}>{item.name}</option>)}</select></label>
      <div className="calculator-specs"><div><small>Толщина</small><b>{product.thickness}</b></div><div><small>Максимальный пролёт</small><b>{product.span}</b></div><div><small>Нагрузка</small><b>{product.capacity}</b></div><div><small>Собственный вес</small><b>{product.weight}</b></div></div>
    </div>
    <aside className="calculator-result"><span>Предварительная стоимость материалов</span><strong>{money.format(estimate)}</strong><p>Расчёт выполнен по базовой цене {product.price}. Доставка, монтаж, арматура, бетон и окончательная комплектация зависят от проекта и региона.</p><LeadButton>Получить точный расчёт <UiIcon name="arrow"/></LeadButton></aside>
  </div>;
}
