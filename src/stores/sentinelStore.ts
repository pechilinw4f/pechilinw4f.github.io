// src/stores/useSentinelStore.ts
import { defineStore } from 'pinia'
import type { BBox } from 'geojson'

export const useSentinelStore = defineStore('sentinel', {
  state: () => ({
    urls: [] as string[],
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchSentinel2Scenes(startDate: string, endDate: string, bbox: BBox) {
      this.loading = true
      this.error = null
      this.urls = []

      const url = 'https://earth-search.aws.element84.com/v1/search'
      const body = {
        collections: ['sentinel-2-l2a'],
        datetime: `${startDate}T00:00:00Z/${endDate}T23:59:59Z`,
        bbox: bbox,
        limit: 10,
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
        const urls = json.features.map((feature: any) => feature.assets.visual.href)
        return urls
      } catch (err: any) {
        console.error('Erreur fetchSentinel2Scenes', err)
        this.error = err.message || 'Erreur inconnue'
      } finally {
        this.loading = false
      }
    },

    clearUrls() {
      this.urls = []
    }
  },
})
