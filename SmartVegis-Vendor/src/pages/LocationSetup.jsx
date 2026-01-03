import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useAuth } from '../contexts/AuthContext';
import { vendorAPI } from '../services/api';

// Fix for Leaflet marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom marker icon
const customIcon = new L.Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Map click handler component
function LocationMarker({ position, setPosition }) {
    useMapEvents({
        click(e) {
            setPosition([e.latlng.lat, e.latlng.lng]);
        },
    });

    return position ? (
        <Marker
            position={position}
            icon={customIcon}
            draggable={true}
            eventHandlers={{
                dragend: (e) => {
                    const marker = e.target;
                    const pos = marker.getLatLng();
                    setPosition([pos.lat, pos.lng]);
                },
            }}
        />
    ) : null;
}

export default function LocationSetup() {
    const navigate = useNavigate();
    const { updateVendor } = useAuth();
    const mapRef = useRef(null);

    const [position, setPosition] = useState(null);
    const [address, setAddress] = useState('');
    const [district, setDistrict] = useState('');
    const [loading, setLoading] = useState(false);
    const [detecting, setDetecting] = useState(false);
    const [error, setError] = useState('');

    // Default center: Maharashtra (Pune)
    const defaultCenter = [18.5204, 73.8567];

    // Reverse geocode to get address
    const reverseGeocode = async (lat, lng) => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=en`
            );
            const data = await response.json();

            if (data && data.address) {
                const addr = data.address;
                setAddress(data.display_name || '');
                setDistrict(addr.county || addr.state_district || addr.city || '');
            }
        } catch (err) {
            console.error('Geocoding error:', err);
        }
    };

    // Update address when position changes
    useEffect(() => {
        if (position) {
            reverseGeocode(position[0], position[1]);
        }
    }, [position]);

    // Auto-detect location
    const handleAutoDetect = () => {
        setDetecting(true);
        setError('');

        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser');
            setDetecting(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const newPosition = [pos.coords.latitude, pos.coords.longitude];
                setPosition(newPosition);

                // Pan map to new position
                if (mapRef.current) {
                    mapRef.current.flyTo(newPosition, 16);
                }

                setDetecting(false);
            },
            (err) => {
                setError('Unable to detect location. Please place the marker manually.');
                setDetecting(false);
            },
            { enableHighAccuracy: true }
        );
    };

    // Save location
    const handleSaveLocation = async () => {
        if (!position) {
            setError('Please select your store location on the map');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await vendorAPI.updateLocation({
                latitude: position[0],
                longitude: position[1],
                district,
                address
            });

            if (response.data.success) {
                updateVendor({ isLocationSet: true, district });
                navigate('/');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to save location');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="location-page">
            <div className="location-header">
                <h2>📍 Set Your Store Location</h2>
                <p className="text-sm text-muted mt-md">
                    Click on the map or use auto-detect to mark your store location
                </p>
            </div>

            <div className="location-map">
                <MapContainer
                    center={defaultCenter}
                    zoom={13}
                    style={{ height: '100%', width: '100%' }}
                    ref={mapRef}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <LocationMarker position={position} setPosition={setPosition} />
                </MapContainer>

                <div className="location-controls">
                    {error && (
                        <div className="verification-status error mb-md">
                            <span>❌</span>
                            <span>{error}</span>
                        </div>
                    )}

                    {position && (
                        <div className="location-info">
                            <div className="location-info-label">Selected Location</div>
                            <div className="font-bold">{address || 'Loading address...'}</div>
                            {district && (
                                <div className="text-sm text-muted mt-md">District: {district}</div>
                            )}
                        </div>
                    )}

                    <div className="flex gap-md">
                        <button
                            className="btn btn-secondary flex-1"
                            onClick={handleAutoDetect}
                            disabled={detecting}
                        >
                            {detecting ? (
                                <>
                                    <div className="spinner"></div>
                                    Detecting...
                                </>
                            ) : (
                                <>📍 Auto Detect</>
                            )}
                        </button>

                        <button
                            className="btn btn-primary flex-1"
                            onClick={handleSaveLocation}
                            disabled={!position || loading}
                        >
                            {loading ? (
                                <>
                                    <div className="spinner"></div>
                                    Saving...
                                </>
                            ) : (
                                <>Save Location</>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
