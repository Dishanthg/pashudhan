import type { VeterinaryClinic } from '../types';

const PHOTON_ENDPOINT = 'https://photon.komoot.io/api/';

interface PhotonFeature {
  geometry?: {
    coordinates?: [number, number];
  };
  properties?: {
    name?: string;
    street?: string;
    housenumber?: string;
    houseNumber?: string;
    city?: string;
    district?: string;
    county?: string;
    state?: string;
    country?: string;
  };
}

const toRadians = (degrees: number): number => degrees * (Math.PI / 180);

const calculateDistanceKm = (
  fromLat: number,
  fromLon: number,
  toLat: number,
  toLon: number
): number => {
  const earthRadiusKm = 6371;
  const dLat = toRadians(toLat - fromLat);
  const dLon = toRadians(toLon - fromLon);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(fromLat)) *
      Math.cos(toRadians(toLat)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
};

const formatAddress = (properties?: PhotonFeature['properties']): string | undefined => {
  if (!properties) {
    return undefined;
  }

  const addressParts = [
    properties.housenumber || properties.houseNumber,
    properties.street,
    properties.city || properties.district || properties.county,
    properties.state,
    properties.country,
  ].filter(Boolean);

  return addressParts.length > 0 ? addressParts.join(', ') : undefined;
};

export const findNearbyVeterinaryClinics = async (
  lat: number,
  lon: number,
  maxDistanceKm: number = 75,
  limit: number = 12
): Promise<VeterinaryClinic[]> => {
  const params = new URLSearchParams({
    q: 'veterinary',
    lat: String(lat),
    lon: String(lon),
    limit: String(limit * 2),
  });

  const response = await fetch(`${PHOTON_ENDPOINT}?${params.toString()}`, {
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Photon API request failed with status ${response.status}`);
  }

  const payload = await response.json() as { features?: PhotonFeature[] };
  const features = payload.features || [];
  const clinics: VeterinaryClinic[] = [];
  const seen = new Set<string>();

  for (const feature of features) {
    const coordinates = feature.geometry?.coordinates;
    if (!coordinates || coordinates.length < 2) {
      continue;
    }

    const [featureLon, featureLat] = coordinates;
    const distanceKm = calculateDistanceKm(lat, lon, featureLat, featureLon);

    if (distanceKm > maxDistanceKm) {
      continue;
    }

    const name = feature.properties?.name || 'Veterinary Clinic';
    const uniqueKey = `${name}_${featureLat.toFixed(5)}_${featureLon.toFixed(5)}`;

    if (seen.has(uniqueKey)) {
      continue;
    }

    seen.add(uniqueKey);

    clinics.push({
      name,
      lat: featureLat,
      lon: featureLon,
      address: formatAddress(feature.properties),
      distanceKm: Math.round(distanceKm * 10) / 10,
      source: 'osm',
    });
  }

  return clinics
    .sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0))
    .slice(0, limit);
};
