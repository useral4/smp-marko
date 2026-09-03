"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { objectMarkers as originalObjectMarkers } from "../data";
import type { CmsProject } from "../generated-content";

type LeafletMap = {
  remove: () => void;
  fitBounds: (bounds: number[][], options: { padding: number[]; maxZoom: number }) => void;
};

type LeafletApi = {
  map: (element: HTMLElement, options: { zoomControl: boolean; scrollWheelZoom: boolean }) => LeafletMap;
  tileLayer: (url: string, options: { attribution: string; maxZoom: number }) => { addTo: (map: LeafletMap) => void };
  circleMarker: (coordinates: number[], options: { radius: number; color: string; fillColor: string; fillOpacity: number; weight: number }) => {
    addTo: (map: LeafletMap) => { bindPopup: (content: string) => void };
  };
};

declare global {
  interface Window {
    L?: LeafletApi;
  }
}

const scriptId = "leaflet-maps-api";
const stylesheetId = "leaflet-maps-css";

function escapeMapText(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;" })[character] || character);
}

export default function ObjectsMap({ compact = false, projects = [] }: { compact?: boolean; projects?: CmsProject[] }) {
  const node = useRef<HTMLDivElement>(null);
  const map = useRef<LeafletMap | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const objectMarkers = useMemo(() => {
    const cmsMarkers = projects.flatMap((project) => {
      const lat = Number(project.latitude);
      const lng = Number(project.longitude);
      if (!Number.isFinite(lat) || !Number.isFinite(lng) || !project.latitude || !project.longitude) return [];
      return [{
        title: project.title,
        description: [project.category, project.location].filter(Boolean).join(" · "),
        lat,
        lng,
        color: "#168aa1",
      }];
    });
    return [...originalObjectMarkers, ...cmsMarkers];
  }, [projects]);

  useEffect(() => {
    let cancelled = false;

    const createMap = () => {
      if (cancelled || !node.current || !window.L || map.current) return;
      const instance = window.L.map(node.current, { zoomControl: true, scrollWheelZoom: false });
      window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap",
        maxZoom: 18,
      }).addTo(instance);
      objectMarkers.forEach((marker) => {
        const title = marker.title || marker.description || "Объект СМП МАРКО";
        const description = marker.description ? `<br>${escapeMapText(marker.description)}` : "";
        window.L!.circleMarker([marker.lat, marker.lng], {
          radius: compact ? 7 : 8,
          color: "#ffffff",
          fillColor: marker.color || "#168aa1",
          fillOpacity: 1,
          weight: 2,
        }).addTo(instance).bindPopup(`<strong>${escapeMapText(title)}</strong>${description}`);
      });
      instance.fitBounds(objectMarkers.map((marker) => [marker.lat, marker.lng]), {
        padding: compact ? [28, 28] : [45, 45],
        maxZoom: compact ? 5 : 7,
      });
      map.current = instance;
      setLoaded(true);
    };

    const timeout = window.setTimeout(() => {
      if (!map.current) setFailed(true);
    }, 12_000);

    if (window.L) {
      createMap();
    } else {
      if (!document.getElementById(stylesheetId)) {
        const stylesheet = document.createElement("link");
        stylesheet.id = stylesheetId;
        stylesheet.rel = "stylesheet";
        stylesheet.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
        document.head.appendChild(stylesheet);
      }
      const existing = document.getElementById(scriptId) as HTMLScriptElement | null;
      const script = existing || document.createElement("script");
      const handleError = () => setFailed(true);
      script.addEventListener("load", createMap);
      script.addEventListener("error", handleError);
      if (!existing) {
        script.id = scriptId;
        script.async = true;
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
        document.head.appendChild(script);
      }
      return () => {
        cancelled = true;
        window.clearTimeout(timeout);
        script.removeEventListener("load", createMap);
        script.removeEventListener("error", handleError);
        map.current?.remove();
        map.current = null;
      };
    }

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
      map.current?.remove();
      map.current = null;
    };
  }, [compact, objectMarkers]);

  return <div className="yandex-objects-map">
    <div className="yandex-map-canvas" ref={node}/>
    {!loaded && !failed && <div className="map-status">Загружаем карту объектов…</div>}
    {failed && <div className="map-status map-status-failed"><strong>Карта временно недоступна</strong><span>Все объекты можно посмотреть в разделе «Объекты».</span><a href="/objects">Открыть объекты</a></div>}
  </div>;
}
