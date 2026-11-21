import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, Check } from 'lucide-react';
import L from 'leaflet';

interface MapPickerProps {
  initialLat?: number;
  initialLng?: number;
  initialAddress?: string;
  onLocationSelect: (address: string, lat: number, lng: number) => void;
  onClose?: () => void;
}

export const MapPicker: React.FC<MapPickerProps> = ({
  initialLat = 13.0827,
  initialLng = 80.2707,
  initialAddress = '',
  onLocationSelect,
  onClose
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lng: number }>({
    lat: initialLat,
    lng: initialLng
  });
  const [address, setAddress] = useState(initialAddress || 'Main Road, Chennai');
  const [locating, setLocating] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  // Custom marker icon matching design
  const customIcon = L.divIcon({
    className: 'custom-map-pin',
    html: `
      <div style="
        background-color: #f59e0b;
        color: #0f2942;
        width: 34px;
        height: 34px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        border: 2px solid #ffffff;
      ">
        <div style="
          width: 10px;
          height: 10px;
          background-color: #0f2942;
          border-radius: 50%;
        "></div>
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 34]
  });

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [selectedCoords.lat, selectedCoords.lng],
        zoom: 15
      });

      // Standard OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(map);

      const marker = L.marker([selectedCoords.lat, selectedCoords.lng], {
        icon: customIcon,
        draggable: true
      }).addTo(map);

      marker.on('dragend', async () => {
        const pos = marker.getLatLng();
        setSelectedCoords({ lat: pos.lat, lng: pos.lng });
        await reverseGeocode(pos.lat, pos.lng);
      });

      map.on('click', async (e: L.LeafletMouseEvent) => {
        marker.setLatLng(e.latlng);
        setSelectedCoords({ lat: e.latlng.lat, lng: e.latlng.lng });
        await reverseGeocode(e.latlng.lat, e.latlng.lng);
      });

      mapInstanceRef.current = map;
      markerRef.current = marker;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      if (response.ok) {
        const data = await response.json();
        const road = data.address?.road || data.address?.neighbourhood || data.address?.suburb || 'Selected Location';
        const city = data.address?.city || data.address?.town || data.address?.state_district || '';
        const full = city ? `${road}, ${city}` : road;
        setAddress(full);
      }
    } catch {
      setAddress(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
    }
  };

  const handleDeviceLocation = () => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser.');
      return;
    }

    setLocating(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setSelectedCoords({ lat, lng });

        if (mapInstanceRef.current && markerRef.current) {
          mapInstanceRef.current.setView([lat, lng], 16);
          markerRef.current.setLatLng([lat, lng]);
        }

        await reverseGeocode(lat, lng);
        setLocating(false);
      },
      (error) => {
        setLocating(false);
        setGeoError('Location permission denied or unavailable. You can click on the map directly.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleConfirm = () => {
    onLocationSelect(address, selectedCoords.lat, selectedCoords.lng);
    if (onClose) onClose();
  };

  return (
    <div className="map-picker-root">
      <div className="map-controls-bar">
        <div className="address-display">
          <MapPin size={18} color="#0f2942" />
          <input
            type="text"
            className="address-input"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Search or fine-tune address"
          />
        </div>

        <button
          type="button"
          onClick={handleDeviceLocation}
          className="btn-locate"
          disabled={locating}
          title="Use device GPS location"
        >
          <Navigation size={16} />
          {locating ? 'Detecting...' : 'Use My GPS'}
        </button>
      </div>

      {geoError && <div className="geo-error-msg">{geoError}</div>}

      <div ref={mapContainerRef} className="map-canvas-container" />

      <div className="map-footer-actions">
        <span className="coords-text">
          Lat: {selectedCoords.lat.toFixed(4)}, Lng: {selectedCoords.lng.toFixed(4)}
        </span>
        <div className="action-buttons">
          {onClose && (
            <button type="button" onClick={onClose} className="btn-cancel">
              Cancel
            </button>
          )}
          <button type="button" onClick={handleConfirm} className="btn-confirm">
            <Check size={16} />
            Confirm Location
          </button>
        </div>
      </div>

      <style>{`
        .map-picker-root {
          background-color: #ffffff;
          border-radius: var(--radius-md);
          border: 1.5px solid #cbd5e1;
          overflow: hidden;
          margin-top: 10px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.06);
        }

        .map-controls-bar {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          background-color: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
        }

        .address-display {
          display: flex;
          align-items: center;
          gap: 8px;
          flex: 1;
        }

        .address-input {
          flex: 1;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          padding: 6px 10px;
          font-size: 0.9rem;
          color: #0f2942;
          background: #ffffff;
        }

        .btn-locate {
          background-color: #ffffff;
          border: 1px solid #cbd5e1;
          color: #0f2942;
          border-radius: 6px;
          padding: 6px 12px;
          font-size: 0.85rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.15s ease;
        }

        .btn-locate:hover {
          background-color: #f1f5f9;
        }

        .geo-error-msg {
          font-size: 0.82rem;
          color: #dc2626;
          padding: 4px 14px;
          background-color: #fef2f2;
        }

        .map-canvas-container {
          height: 240px;
          width: 100%;
        }

        .map-footer-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 14px;
          background-color: #f8fafc;
          border-top: 1px solid #e2e8f0;
        }

        .coords-text {
          font-size: 0.82rem;
          color: #64748b;
        }

        .action-buttons {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .btn-cancel {
          background: none;
          border: 1px solid #cbd5e1;
          color: #475569;
          border-radius: 6px;
          padding: 6px 14px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
        }

        .btn-confirm {
          background-color: var(--color-amber-primary);
          border: none;
          color: #0f2942;
          border-radius: 6px;
          padding: 6px 14px;
          font-size: 0.85rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
        }

        .btn-confirm:hover {
          background-color: var(--color-amber-hover);
        }
      `}</style>
    </div>
  );
};
