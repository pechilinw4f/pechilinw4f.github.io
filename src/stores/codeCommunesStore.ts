import { defineStore } from 'pinia'
import { getBBoxCenter } from '../utils/utils'

// interface Commune {
//   code: string
//   nom: string
// }

export const useCodeCommunesStore = defineStore('codeCommunesStore', {
    state: () => ({
        // communes: [] as Commune[],
        codeDepartement: null as string | null,
        loading: false,
        error: null as string | null,
    }),

    actions: {
        async fetchCommunes(bounds: [number, number, number, number]) {
            this.error = null
            this.loading = true

            const center = getBBoxCenter(bounds)

            const url = `https://geo.api.gouv.fr/communes?lon=${center[0]}&lat=${center[1]}`

            try {
                const response = await fetch(url)
                if (!response.ok) {
                    throw new Error(`Erreur HTTP: ${response.status}`)
                }

                const data = await response.json()
                this.codeDepartement = data.codeDepartement;
            } catch (err: any) {
                this.error = err.message || 'Erreur inconnue'
            } finally {
                this.loading = false
            }
            return this.codeDepartement;
        },

        // async fetchCadastre() {
        //     this.error = null
        //     this.loading = true

        //     const url = `https://geo.api.gouv.fr/communes?lon=${center[0]}&lat=${center[1]}`

        //     try {
        //         const response = await fetch(url)
        //         if (!response.ok) {
        //             throw new Error(`Erreur HTTP: ${response.status}`)
        //         }

        //         const data = await response.json()
        //         this.codeDepartement = data.codeDepartement;
        //     } catch (err: any) {
        //         this.error = err.message || 'Erreur inconnue'
        //     } finally {
        //         this.loading = false
        //     }
        //     return this.codeDepartement;
        // }
    }
})
