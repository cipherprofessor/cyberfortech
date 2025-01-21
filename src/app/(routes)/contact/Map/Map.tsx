'use client';

import { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import styles from './Map.module.scss';

export function Map() {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
        version: 'weekly',
      });

      try {
        const google = await loader.load();
        const location = { lat: 37.7749, lng: -122.4194 }; // Replace with actual latitude and longitude

        const map = new google.maps.Map(mapRef.current!, {
          center: location,
          zoom: 15,
          styles: [
            {
              featureType: 'all',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#7c93a3' }],
            },
            {
              featureType: 'administrative',
              elementType: 'geometry.fill',
              stylers: [{ visibility: 'off' }],
            },
            // Add more custom styles as needed
          ],
        });

        new google.maps.Marker({
          position: location,
          map,
          title: 'CyberForTech Office',
        });
      } catch (error) {
        console.error('Error loading Google Maps:', error);
      }
    };

    initMap();
  }, []);

  return <div ref={mapRef} className={styles.map} />;
}