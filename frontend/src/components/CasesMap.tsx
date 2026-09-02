'use client';

import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';

interface Case {
  id: string;
  description: string;
  location_address: string;
  location_lat?: number;
  location_lng?: number;
  status: string;
  condition?: string;
  photo_url?: string;
  created_at: string;
}

interface CasesMapProps {
  cases: Case[];
}

const statusColors: Record<string, string> = {
  pending: '#f59e0b',
  assigned: '#3b82f6',
  in_progress: '#8b5cf6',
  resolved: '#10b981',
  closed: '#6b7280',
};

// North Indian fallback coordinates (for cases with no lat/lng)
const FALLBACK_COORDS: [number, number][] = [
  [28.6139, 77.2090],  // New Delhi
  [26.8467, 80.9462],  // Lucknow
  [30.7333, 76.7794],  // Chandigarh
  [25.5941, 85.1376],  // Patna
  [27.1767, 78.0081],  // Agra
  [26.4499, 80.3319],  // Kanpur
  [29.3807, 76.9850],  // Panipat
  [28.4595, 77.0266],  // Gurgaon
];

export default function CasesMap({ cases }: CasesMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    import('leaflet').then((L) => {
      // Fix default marker icon
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      if (!mapRef.current) return;

      // If Leaflet already initialized this container, destroy it first
      if ((mapRef.current as any)._leaflet_id) {
        mapInstanceRef.current?.remove();
        mapInstanceRef.current = null;
        // Reset the container
        (mapRef.current as any)._leaflet_id = null;
      }

      const map = L.map(mapRef.current, {
        center: [28.6139, 77.2090],
        zoom: 5,
        zoomControl: true,
      });

      mapInstanceRef.current = map;

      // OpenStreetMap tiles (free, no API key)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      const bounds: [number, number][] = [];

      cases.forEach((c, index) => {
        let lat = c.location_lat;
        let lng = c.location_lng;

        // Use fallback coordinates if not provided
        if (!lat || !lng) {
          const fallback = FALLBACK_COORDS[index % FALLBACK_COORDS.length];
          // Slight random offset so markers don't overlap
          lat = fallback[0] + (Math.random() - 0.5) * 0.5;
          lng = fallback[1] + (Math.random() - 0.5) * 0.5;
        }

        bounds.push([lat, lng]);

        const color = statusColors[c.status] || '#6b7280';

        // Custom colored circle marker
        const marker = L.circleMarker([lat, lng], {
          radius: 10,
          fillColor: color,
          color: '#fff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.9,
        }).addTo(map);

        const statusLabel = c.status?.replace('_', ' ').toUpperCase() || 'UNKNOWN';
        const date = new Date(c.created_at).toLocaleDateString('en-IN');

        marker.bindPopup(`
          <div style="min-width:200px; font-family: sans-serif;">
            <div style="background:${color}; color:white; padding:6px 10px; border-radius:6px 6px 0 0; font-size:11px; font-weight:700; letter-spacing:1px;">
              ${statusLabel}
            </div>
            <div style="padding:10px;">
              <p style="font-size:13px; font-weight:600; margin:0 0 6px; color:#111;">${c.description?.slice(0, 80)}${c.description?.length > 80 ? '...' : ''}</p>
              <p style="font-size:11px; color:#666; margin:0 0 4px;">📍 ${c.location_address}</p>
              ${c.condition ? `<p style="font-size:11px; color:#666; margin:0 0 4px;">🩺 ${c.condition}</p>` : ''}
              <p style="font-size:10px; color:#999; margin:0;">🗓 ${date}</p>
              ${c.photo_url ? `<img src="${c.photo_url}" style="width:100%; border-radius:6px; margin-top:8px; max-height:100px; object-fit:cover;" />` : ''}
            </div>
          </div>
        `, { maxWidth: 260 });
      });

      // Fit map to all markers
      if (bounds.length > 0) {
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 10 });
      }
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [cases]);

  return (
    <div ref={mapRef} style={{ width: '100%', height: '100%', borderRadius: '16px' }} />
  );
}
