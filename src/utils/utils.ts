import type { LngLatBounds } from "maplibre-gl"
import type { Polygon, Feature } from 'geojson'


export function getBBoxCenter(bbox: [number, number, number, number]): [number, number] {
  const [minLon, minLat, maxLon, maxLat] = bbox
  const centerLon = (minLon + maxLon) / 2
  const centerLat = (minLat + maxLat) / 2
  return [centerLon, centerLat]
}

export function getBbox(bounds: LngLatBounds): number[] {
  const bbox = [bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()]
  return bbox;
}

export function getBboxGeoJSON(bounds: LngLatBounds) {
  const bboxGeoJSON: Feature<Polygon> = {
    type: "Feature",
    geometry: {
      type: "Polygon",
      coordinates: [[
        [bounds.getWest(), bounds.getSouth()], // sud-ouest
        [bounds.getEast(), bounds.getSouth()], // sud-est
        [bounds.getEast(), bounds.getNorth()], // nord-est
        [bounds.getWest(), bounds.getNorth()], // nord-ouest
        [bounds.getWest(), bounds.getSouth()]  // retour au point de départ
      ]]
    },
    properties: {}
  };
  return bboxGeoJSON;
}
