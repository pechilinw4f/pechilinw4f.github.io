// src/stores/useSentinelStore.ts
import { defineStore } from 'pinia'
import type { BBox } from 'geojson'

export const useSentinelStore = defineStore('sentinel', {
    state: () => ({
        urls: {} as Record<string, Record<string, string>[]>,
        loading: false,
        error: null as string | null,
        dates: null as string[] | null,
    }),

    actions: {
        async fetchSentinel2ScenesByDate(startDate: string, endDate: string, bbox: BBox) {
            this.loading = true
            this.error = null
            this.urls = {}


// sentinel-2-pre-c1-l2a	Sentinel-2 Pre-Collection 1 Level-2A
// cop-dem-glo-30	Copernicus DEM GLO-30
// naip	NAIP: National Agriculture Imagery Program
// cop-dem-glo-90	Copernicus DEM GLO-90
// landsat-c2-l2	Landsat Collection 2 Level-2 -> NOK
// sentinel-2-l2a	Sentinel-2 Level-2A 
// sentinel-2-l1c	Sentinel-2 Level-1C -> JP2000
// sentinel-2-c1-l2a	Sentinel-2 Collection 1 Level-2A -> NOK
// sentinel-1-grd	Sentinel-1 Level-1C Ground Range Detected (GRD)

            const url = 'https://earth-search.aws.element84.com/v1/search'
            const body = {
                collections: ['sentinel-2-l2a'],
                datetime: `${startDate}T00:00:00Z/${endDate}T23:59:59Z`,
                bbox: bbox,
                limit: 300,
            }

            try {
                const res = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body),
                })

                if (!res.ok) {
                    throw new Error(`Erreur HTTP ${res.status}`)
                }

                const json = await res.json()
                console.log(json);
                const urlsByDate: Record<string, Record<string, string>[]> = {}

                json.features.forEach((feature: any) => {
                    const clouds = feature.properties["eo:cloud_cover"]
                    if (clouds < 20) {

                        const created = feature.properties.created
                        const dateKey = created.split('T')[0]
                        // let href;
                        // } else if (selectedImageType == "BLUE") {
                        //     href = feature.assets.blue.href
                        // } else if (selectedImageType == "GREEN") {
                        //     href = feature.assets.green.href
                        // }else if (selectedImageType == "SWIR") {
                        //     href = feature.assets.swir16.href
                        // }

                        if (!urlsByDate[dateKey]) {
                            urlsByDate[dateKey] = []
                        }


                        const tmp = {
                            "TCI": feature.assets.visual.href,
                            "RED": feature.assets.red.href,
                            "GREEN": feature.assets.green.href,
                            "NIR": feature.assets.nir.href,
                            "SWIR16": feature.assets.swir16.href
                        }
                        // const tmp = {
                        //     "TCI": feature.assets.blue.href,
                        //     "RED": feature.assets.red.href,
                        //     "GREEN": feature.assets.green.href,
                        //     "NIR": feature.assets.nir08.href,
                        //     "SWIR16": feature.assets.swir16.href
                        // }
                        urlsByDate[dateKey].push(tmp);


                    }
                })

                this.urls = urlsByDate
                this.dates = Object.keys(urlsByDate).sort();
                return urlsByDate
            } catch (err: any) {
                console.error('Erreur fetchSentinel2Scenes', err)
                this.error = err.message || 'Erreur inconnue'
            } finally {
                this.loading = false
            }
        },

        clearUrls() {
            this.urls = {}
        }
    },
})
