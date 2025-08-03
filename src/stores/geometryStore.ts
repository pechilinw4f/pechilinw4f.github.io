import { defineStore } from 'pinia'
import type { BBox } from 'geojson'
import type { GeoJSONStoreGeometries } from 'terra-draw';
import { bbox } from '@turf/turf';

export const useGeometryStore = defineStore('bbox', {
  state: () => ({
    geometry: null as GeoJSONStoreGeometries | null,
    bbox: null as BBox | null,
    bounds: null as [number, number, number, number] | null,
    drawing: false as boolean,
  }),
  getters: {
    hasGeometry: (state) => state.bbox !== null
  },
  actions: {
    setGeometry(geometry: GeoJSONStoreGeometries) {
      this.geometry = geometry
      this.bbox = bbox(geometry)
      this.bounds = this.bbox as [number, number, number, number];
    },
    clearGeometry() {
      this.bbox = null
      this.bounds = null
    }
  }
});
