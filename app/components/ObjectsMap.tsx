"use client";

import { useEffect, useRef, useState } from "react";
import { objectMarkers } from "../data";

type MapInstance = {
  destroy: () => void;
  geoObjects: { add: (placemark: unknown) => void };
  setBounds: (bounds: number[][], options: { checkZoomRange: boolean; zoomMargin: number }) => void;
};

type YandexMaps = {
  ready: (callback: () => void) => void;
  Map: new (
    element: HTMLElement,
    state: { center: number[]; zoom: number; controls: string[] },
    options: { suppressMapOpenBlock: boolean }
  ) => MapInstance;
  Placemark: new (
    coordinates: number[],
    properties: { balloonContentHeader?: string; balloonContentBody?: string; hintContent?: string },
    options: { preset: string; iconColor?: string }
  ) => unknown;
};

declare global {
  interface Window {
    ymaps?: YandexMaps;
  }
}

const scriptId = "yandex-maps-api";

export default function ObjectsMap({ compact = false }: { compact?: boolean }) {
  const node = useRef<HTMLDivElement>(null);
  const map = useRef<MapInstance | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const createMap = () => {
      if (cancelled || !node.current || !window.ymaps || map.current) return;

      window.ymaps.ready(() => {
        if (cancelled || !node.current || !window.ymaps || map.current) return;

        const instance = new window.ymaps.Map(
          node.current,
          { center: [55.751979, 37.617499], zoom: compact ? 3 : 4, controls: ["zoomControl", "fullscreenControl"] },
          { suppressMapOpenBlock: true }
        );

        objectMarkers.forEach((marker) => {
          const title = marker.title || marker.description || "Объект СМП МАРКО";
          instance.geoObjects.add(new window.ymaps!.Placemark(
            [marker.lat, marker.lng],
            {
              hintContent: title,
              balloonContentHeader: title,
              balloonContentBody: marker.description,
            },
            { preset: "islands#circleDotIcon", iconColor: marker.color || "#168aa1" }
          ));
        });

        instance.setBounds(
          objectMarkers.map((marker) => [marker.lat, marker.lng]),
          { checkZoomRange: true, zoomMargin: compact ? 30 : 55 }
        );
        map.current = instance;
        setLoaded(true);
      });
    };

    if (window.ymaps) {
      createMap();
    } else {
      const existing = document.getElementById(scriptId) as HTMLScriptElement | null;
      const script = existing || document.createElement("script");
      const handleError = () => setFailed(true);

      script.addEventListener("load", createMap);
      script.addEventListener("error", handleError);
      if (!existing) {
        script.id = scriptId;
        script.async = true;
        script.src = "https://api-maps.yandex.ru/2.1/?lang=ru_RU";
        document.head.appendChild(script);
      }

      return () => {
        cancelled = true;
        script.removeEventListener("load", createMap);
        script.removeEventListener("error", handleError);
        map.current?.destroy();
        map.current = null;
      };
    }

    return () => {
      cancelled = true;
      map.current?.destroy();
      map.current = null;
    };
  }, [compact]);

  return <div className="yandex-objects-map">
    <div className="yandex-map-canvas" ref={node}/>
    {!loaded && !failed && <div className="map-status">Загружаем карту и 27 меток…</div>}
    {failed && <div className="map-status">Не удалось загрузить Яндекс Карты. Проверьте подключение к интернету.</div>}
  </div>;
}
