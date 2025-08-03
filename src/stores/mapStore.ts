import { defineStore } from 'pinia'
// import { Map, type MapOptions } from "maplibre-gl";
// import MapLibreGL, { AttributionControl, ScaleControl } from "maplibre-gl";
import maplibregl from 'maplibre-gl'
import { useSentinelStore } from './sentinelStoreByDate'
import type { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';

export const baseMaps: Record<string, string> = {
    "Carto Voyager": "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json",
    "Carto Positron": "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
    "Carto Dark Matter": "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
}

export const imageTypes = ['True Color Image', 'NDVI', 'NDMI', 'NDWI', 'UI'];



export const useMapStore = defineStore('map', {
    state: () => ({
        _map: undefined as maplibregl.Map | undefined,
        _popup: undefined as maplibregl.Popup | undefined,
        basemap: "Carto Voyager" as string,
        showAllBaseMap: false as boolean,
        sourcesLoaded: false as boolean,
        showAllImage: false as boolean,
        imageType: 'True Color Image' as string,

        showParcellaire: false as boolean,
        showAllParcellaire: false as boolean,

        showTopo: false as boolean,
        showAllTopo: false as boolean,

        showDeb: false as boolean,
        showAllDeb: false as boolean,

        showDebroussaillement: false as boolean,
        showAllDebroussaillement: false as boolean,

        layerActive: [] as string[],

    }),
    getters: {
        map(): maplibregl.Map {
            const map = this._map;
            if (!map) throw new Error("");
            return map as never;
        },
        getBasemap: (state) => state.basemap,
    },
    actions: {

        delete() {
            this._map = undefined
        },
        initialize(container: HTMLElement | string, coordinates: [number, number] = [5.369889, 43.296346]) {
            // Singleton : on initialise une seule fois
            if (this._map) return
            console.log("initialize");
            const map = new maplibregl.Map({
                container,
                style: baseMaps[this.basemap],
                center: coordinates,
                // zoom: 11,
                // minZoom: 9
            });
            const popup = new maplibregl.Popup({
                closeButton: false,
                closeOnClick: false
            })
            this._map = map as never;
            this._popup = popup as never;
        },
        changeBasemap(basemap: string) {
            this.basemap = basemap;
            console.log(basemap);
            if (this._map && baseMaps[basemap]) {
                this._map.setStyle(baseMaps[basemap])
            }
        },
        removeLayersAndSourcesFromMap(prefix: string) {
            this.map.getStyle().layers?.forEach((layer: { id: string }) => {
                if (layer.id.startsWith(prefix)) {
                    this.map.removeLayer(layer.id);
                }
            });
            Object.keys(this.map.getStyle().sources).forEach(sourceId => {
                if (sourceId.startsWith(prefix)) {
                    this.map.removeSource(sourceId);
                }
            });
        },
        areSourcesLoaded(prefix: string) {
            let allLoaded = true;
            const sentinelStore = useSentinelStore();
            const urls = sentinelStore.urls
            const dates = Object.keys(urls).sort();

            dates.forEach((date, dateIndex) => {
                const urlsForDate = urls[date];
                urlsForDate.forEach((_, urlIndex) => {
                    const type = this.imageType;
                    const sourceId = `${prefix}_imageSource_${type}_${dateIndex}_${urlIndex}`
                    const source = this.map.getSource(sourceId);
                    if (source && !source.loaded()) {
                        allLoaded = false;
                    }
                })
            })
            this.sourcesLoaded = allLoaded;
        },

        show(type: string, features: FeatureCollection<Geometry, GeoJsonProperties> | undefined, fill: string | undefined, color: string, lineWidth: number, lineDashArray?: number[]) {
            const sourceId = `${type}`;
            const lineLayerId = `${type}`;
            const fillLayerId = `${type}-fill`;

            if (features) {

                if (!lineDashArray) {
                    lineDashArray = [1];
                }

                if (!this.map.getSource(sourceId)) {

                    this.map.addSource(sourceId, {
                        type: 'geojson',
                        data: features!
                    });
                    if (fill) {
                        this.map.addLayer({
                            id: fillLayerId,
                            type: 'fill',
                            source: sourceId,
                            paint: {
                                'fill-color': fill,
                                'fill-opacity': 0.5
                            }
                        });
                    }
                    this.map.addLayer({
                        id: lineLayerId,
                        type: 'line',
                        source: sourceId,
                        paint: {
                            'line-color': color,
                            'line-width': lineWidth,
                            'line-dasharray': lineDashArray
                        }
                    });
                } else {
                    console.log("Set DATA", features)
                    const source = this.map.getSource(sourceId) as maplibregl.GeoJSONSource;
                    source.setData(features!);
                }

            }

            if (this.map.getLayer(fillLayerId)) {
                this.map.setLayoutProperty(fillLayerId, "visibility", "visible");
            }
            if (this.map.getLayer(lineLayerId)) {
                this.map.setLayoutProperty(lineLayerId, "visibility", "visible");
            }
        },

        unshow(type: string) {
            const lineLayerId = `${type}`;
            const fillLayerId = `${type}-fill`;
            if (this.map.getLayer(fillLayerId)) {
                this.map.setLayoutProperty(fillLayerId, "visibility", "none");
            }
            if (this.map.getLayer(lineLayerId)) {
                this.map.setLayoutProperty(lineLayerId, "visibility", "none");
            }
        },

        addFeaturesWFS(features: any, id: string, lineColor: string | null, fillColor: string | null, lineWidth?: 1 | number, fillOpacity?: 1 | number) {
            if (this.map.getSource(id)) {
                this.map.removeSource(id)
            }

            this.map.addSource(id, {
                type: 'geojson',
                data: features
            })

            if (lineColor) {
                this.map.addLayer({
                    id: `${id}-line`,
                    type: 'line',
                    source: id,
                    paint: {
                        'line-color': lineColor,
                        'line-opacity': 1,
                        'line-width': lineWidth
                    },
                })
            }

            if (fillColor) {
                this.map.addLayer({
                    id: `${id}-fill`,
                    type: 'fill',
                    source: id,
                    paint: {
                        'fill-color': fillColor,
                        'fill-opacity': fillOpacity
                    },
                })
            }


        },

         addFeaturesVectorTiles(name: string, id: string, lineColor: string | null, fillColor: string | null, lineWidth?: 1 | number) {
            if (this.map.getSource(id)) {
                this.map.removeSource(id)
            }

            this.map.addSource(id, {
                type: "vector",
                tiles: [`https://data.geopf.fr/tms/1.0.0/${name}/{z}/{x}/{y}.pbf`],
            })

            if (lineColor) {
                this.map.addLayer({
                    id: `${id}-line`,
                    type: 'line',
                    source: id,
                    "source-layer": id,
                    paint: {
                        'line-color': lineColor,
                        'line-width': lineWidth
                    },
                    // minzoom: 7,
                })
            }

            if (fillColor) {
                this.map.addLayer({
                    id: `${id}-fill`,
                    type: 'fill',
                    source: id,
                    "source-layer": id,
                    paint: {
                        'fill-color': fillColor,
                        'fill-opacity': 0
                    },
                })
            }
        },

        addCog(cog_url: string, type: string, dateIndex: number, urlsIndex: number) {
            const sourceId = `cog_${type}_${dateIndex}_${urlsIndex}`
            if (!this.map.getSource(sourceId)) {
                this.map.addSource(sourceId, {
                    type: 'raster',
                    // url: 'cog://' + url + `&bbox=${bounds[0]},${bounds[1]},${bounds[2]},${bounds[3]}` + "#color:BrewerSpectral7,1.7084054885838,1.7919403772937,c",
                    url: cog_url,
                    tileSize: 256,
                    // bounds: geometryStore.bounds!
                });
            }

            // const layerId = `imageLayer_${dateIndex}_${urlsIndex}_${typeIndex}`
            const layerId = `cog_${type}_${dateIndex}_${urlsIndex}`
            if (!this.map.getLayer(layerId)) {
                this.map.addLayer({
                    id: layerId,
                    source: sourceId,
                    type: 'raster',
                    paint: {
                        'raster-opacity': 0
                    }
                }, "parcelle-line");
            }
        }
    }
})
