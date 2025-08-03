<template>
  <div class="home">
    <!-- Carte en plein écran -->
    <div ref="mapContainer" id="map-container"></div>

    <!-- Sidebar à gauche -->
    <div class="sidebar">
      <div class="header">
        <img src="/assets/vue_orbital_logo_blue.svg" alt="Vue Orbitale" class="logo" />
        <p class="tagline">
          Visualisez vos données cadastrales et NDVI sur une carte interactive.
        </p>
      </div>

      <!-- Champ de recherche -->
      <div class="search-box">
        <input type="text" v-model="query" placeholder="Rechercher une commune..." @input="fetchSuggestions"
          @keydown.down="moveSelection(1)" @keydown.up="moveSelection(-1)"
          @keydown.enter.prevent="selectSuggestion(activeIndex)" />

        <!-- Dropdown -->
        <ul v-if="suggestions.length > 0" class="dropdown">
          <li v-for="(item, index) in suggestions" :key="item.code" :class="{ active: index === activeIndex }"
            @click="selectSuggestion(index)">
            {{ item.label }}
          </li>
        </ul>
      </div>

      <div class="date-selector">
        <div class="date-row">
          <label for="startDate" class="label">Début :</label>
          <input id="startDate" type="date" v-model="dateStore.startDate" class="input-date" @change="start" />
        </div>
        <div class="date-row">
          <label for="endDate" class="label">Fin :</label>
          <input id="endDate" type="date" v-model="dateStore.endDate" class="input-date" @change="start" />
        </div>



        <div class="date-row">
          <label for="current" class="label">Courant :</label>
          <span class="current-date" v-if="sentinelStore.dates && sentinelStore.dates.length > 0">
            {{
              (() => {
                const d = sentinelStore.dates[dateStore.currentDate];
                if (!d) return '';
                const [y, m, day] = d.split('-');
                return `${day}/${m}/${y}`;
              })()
            }}
          </span>
        </div>
      </div>

      <div class="date-container">
        <input class="date-slider" type="range" v-model="dateStore.currentDate" :max="dateStore.maxDateIndex"
          list="dates" @input="displayFeaturesOnMap" />

        <button @click="togglePlay" class="play-pause-btn">
          <PlayIcon v-if="!isPlaying" />
          <PauseIcon v-else />
        </button>
      </div>


      <div ref="streetViewContainer" id="street-view" style="width: 100%; height: 300px;"></div>


      <!-- Boutons outils -->
      <div class="tools">
        <!-- <button @click="recentre()">Recentrer sur la commune</button> -->
        <!-- <button>Charger un NDVI</button> -->
        <button @click="effacer()">Réinitialiser la carte</button>
      </div>

      <!-- Boutons retour -->
      <div class="buttons-container">

        <router-link to="/theme" class="back-button">
          Analyse
        </router-link>

        <router-link to="/" class="back-button">
          Accueil
        </router-link>
      </div>
    </div>
  </div>
</template>


<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import MaplibreCOGProtocol from '@promethee-earth/maplibre-cog-protocol'
import * as turf from '@turf/turf'
import { polygon, bbox } from '@turf/turf'

import { useMapStore } from '../stores/mapStore'
import { getCadastre } from '../utils/cadastre'
import { fetchWfs } from '../utils/wfs'
import { useGeometryStore } from '../stores/geometryStore'
import { useDateStore } from '../stores/dateStore'
import { useSentinelStore } from '../stores/sentinelStoreByDate'
import { getCogUrl } from '../utils/cog'
import { getAdresse } from '../utils/adresse'

import { Loader } from '@googlemaps/js-api-loader'

const mapContainer = ref<HTMLDivElement | null>(null)
const streetViewContainer = ref<HTMLDivElement | null>(null);
const mapStore = useMapStore()


const geometryStore = useGeometryStore();
const dateStore = useDateStore()
const sentinelStore = useSentinelStore();

const query = ref('')
const suggestions = ref<{ label: string; code: string; coordinates: any; bbox: any }[]>([])
const activeIndex = ref(-1)
const isPlaying = ref(false)
let playInterval: ReturnType<typeof setInterval> | null = null


/** Récupération des suggestions de communes */
const fetchSuggestions = async () => {
  if (query.value.length < 2) {
    suggestions.value = []
    return
  }

  const res = await fetch(
    `https://geo.api.gouv.fr/communes?nom=${query.value}&fields=nom,centre,bbox&format=json&geometry=centre&limit=5`
  )
  const data = await res.json()

  suggestions.value = data.map((c: any) => ({
    label: `${c.nom} (${c.code})`,
    code: c.code,
    coordinates: c.centre.coordinates,
    bbox: c.bbox
  }))

  activeIndex.value = -1
}

function openStreetView(lng: number, lat: number) {
  const url = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${lat},${lng}`;
  window.open(url, '_blank');
}


/** Sélection d'une suggestion */
const selectSuggestion = async (index: number) => {
  if (index < 0 || index >= suggestions.value.length) return

  const selected = suggestions.value[index]
  query.value = selected.label
  suggestions.value = []

  if (mapStore.map) {
    // Récupération du polygone de la commune
    const cadastre = await getCadastre(selected.code, 'communes')

    // Zoom sur la commune sélectionnée
    mapStore.map.flyTo({ center: selected.coordinates, zoom: 11 })

    // Récupération des parcelles cadastrales via WFS
    const [minX, minY, maxX, maxY] = bbox(selected.bbox)
    const bboxParam = `${minX},${minY},${maxX},${maxY}`

    const parcelle = await fetchWfs(
      'https://data.geopf.fr/wfs/ows',
      'CADASTRALPARCELS.PARCELLAIRE_EXPRESS:parcelle',
      bboxParam
    )
    // mapStore.addFeaturesWFS(parcelle, "parcelle", "#2f2f2f", "#000000", 0.05, 0);
    mapStore.addFeaturesVectorTiles("PCI", "parcelle", "#2f2f2f", "#000000", 1)
    mapStore.addFeaturesVectorTiles("BDTOPO", "troncon_de_route", "#5068d2", "#000000", 3)


    const deb = await fetchWfs(
      'https://data.geopf.fr/wfs/ows',
      'DEBROUSSAILLEMENT:debroussaillement',
      bboxParam
    )
    mapStore.addFeaturesWFS(deb, "deb", "#E74C3C", null, 3);

    // Création d'un masque en dehors de la commune
    const world = polygon([
      [
        [-180, -90],
        [180, -90],
        [180, 90],
        [-180, 90],
        [-180, -90]
      ]
    ])

    const mask = turf.difference(turf.featureCollection([world, cadastre]))


    mapStore.addFeaturesWFS(mask, "mask", null, "#2f2f2f", 0, 1);
  }

  geometryStore.setGeometry(selected.bbox);
}

/** Navigation dans la liste avec les flèches */
const moveSelection = (dir: number) => {
  if (suggestions.value.length === 0) return
  activeIndex.value =
    (activeIndex.value + dir + suggestions.value.length) % suggestions.value.length
}

async function start() {
  const dateStore = useDateStore();
  if (geometryStore.bbox != null) {
    const sentinelStore = useSentinelStore();
    await sentinelStore.fetchSentinel2ScenesByDate(dateStore.startDate, dateStore.endDate, geometryStore.bbox);
    console.log(sentinelStore.urls);
    dateStore.maxDateIndex = sentinelStore.dates!.length - 1;
    sentinelStore.dates!.forEach((date, dateIndex) => {
      const urlsForDate = sentinelStore.urls[date];
      urlsForDate.forEach((urls, urlsIndex) => {
        const cogUrl = getCogUrl("NDVI", urls, geometryStore.bbox!);
        console.log(cogUrl);
        mapStore.addCog(cogUrl!, "NDVI", dateIndex, urlsIndex)
      })
    })
  }
  return true;

}

// function initStreetView(lat: number, lng: number) {
//   const panorama = new google.maps.StreetViewPanorama(
//     document.getElementById('street-view') as HTMLElement,
//     {
//       position: { lat, lng },
//       pov: { heading: 34, pitch: 10 },
//       zoom: 1
//     }
//   );
// }


function displayFeaturesOnMap() {
  const dateStore = useDateStore()
  const urls = sentinelStore.urls
  sentinelStore.dates!.forEach((date, dateIndex) => {
    const urlsForDate = urls[date];
    urlsForDate.forEach((_, urlIndex) => {
      const layerId = `cog_NDVI_${dateIndex}_${urlIndex}`;
      if (mapStore.map.getLayer(layerId)) {
        console.log("LAYER EXIST", dateIndex, dateStore.currentDate)
        if (dateIndex == dateStore.currentDate) {
          console.log("DISPLAY ", layerId);
          mapStore.map.setPaintProperty(layerId, 'raster-opacity', 1);
        } else {
          mapStore.map.setPaintProperty(layerId, 'raster-opacity', 0);
        }
      }
    });
  });

}

/** Bouton recentrer */
const recentre = () => {
  if (mapStore.map) {
    // Exemple si tu stockes le centre par défaut :
    // mapStore.map.flyTo({ center: mapStore.center, zoom: 12 })
  }
}

function effacer() {

  query.value = ''

  if (mapStore.map) {
    mapStore.map.remove()
    mapStore.delete()

  }


  if (mapContainer.value) {
    mapStore.initialize(mapContainer.value)
    maplibregl.addProtocol('cog', MaplibreCOGProtocol.cogProtocol)
  }


}

function togglePlay() {
  if (isPlaying.value) {
    stopPlay()
  } else {
    startPlay()
  }
}

function startPlay() {
  if (playInterval) clearInterval(playInterval);
  isPlaying.value = true;
  playInterval = setInterval(() => {
    if (dateStore.currentDate < dateStore.maxDateIndex) {
      dateStore.currentDate++;
      displayFeaturesOnMap();
    } else {
      stopPlay();
    }
  }, 1000);
}

function stopPlay() {
  isPlaying.value = false;
  if (playInterval) {
    clearInterval(playInterval);
    playInterval = null;
  }
}


onMounted(async () => {
  if (mapContainer.value) {
    mapStore.initialize(mapContainer.value)
    maplibregl.addProtocol('cog', MaplibreCOGProtocol.cogProtocol)

    const loader = new Loader({
      apiKey: "AIzaSyBYGhBXtedire_yc0ae_q8DhWaD0haJPyY",
      version: "weekly"
    });

    const google = await loader.load();

    const panorama = new google.maps.StreetViewPanorama(streetViewContainer.value!, {
      position: { lat: 48.8584, lng: 2.2945 }, // ex : Tour Eiffel
      pov: { heading: 165, pitch: 0 },
      zoom: 1
    });


    // mapStore.map.on('mousemove', 'parcelle-fill', (e) => {
    //     if (!e.features?.length) return

    //     console.log(e.features);
    //     const feature = e.features[0]

    //     // Exemple : afficher l'ID et la surface
    //     const props = feature.properties
    //     const html = `
    //       <div style="font-size:12px;">
    //         <strong>Parcelle :</strong> ${props.id || 'N/A'}<br/>
    //         Surface : ${props.surface || '?'} m²
    //       </div>
    //     `

    //     mapStore._popup!
    //     .setLngLat(e.lngLat)
    //       .setHTML(html)
    //       .addTo(mapStore.map!)
    //   })

    // Cacher le popup quand on sort du calque
    // mapStore.map.on('mouseleave', 'parcelle', () => {
    //   if (mapStore._popup) mapStore._popup.remove()
    // })
    // Cacher le popup quand on sort du calque
    // mapStore.map.on('click', 'parcelle', () => {
    //   if (mapStore._popup) mapStore._popup.remove()
    // })


    mapStore.map.on('click', 'parcelle-fill', async (e) => {

      if (!e.features?.length) return

      console.log(e.features);
      const feature = e.features[0]

      // Exemple : afficher l'ID et la surface
      const adresse = await getAdresse(e.lngLat.lng, e.lngLat.lat);
      console.log("ADRESSE", adresse)
      const props = feature.properties
      const html = `
          <div style="font-size:12px;">
            <strong>Parcelle :</strong> ${props.section} ${props.numero}<br/>
            Adresse : ${adresse.properties.name || '?'}
          </div>
        `


      mapStore._popup!
        .setLngLat(e.lngLat)
        .setHTML(html)
        .addTo(mapStore.map!)


      panorama.setPosition({
        lat: e.lngLat.lat, lng: e.lngLat.lng
      });
    })
  }
})

onUnmounted(() => {
  if (mapStore.map) {
    mapStore.map.remove()
    mapStore.delete()
  }
})
</script>

<style scoped>
/* Layout global */
.home {
  position: relative;
  font-family: 'Inter', 'Roboto', sans-serif;
  color: #e0e0e0;
  background-color: #2a2a2a;
}

/* Carte plein écran */
#map-container {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
}

/* Sidebar */
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 320px;
  height: 97vh;
  z-index: 1;

  background: rgba(42, 42, 42, 0.75);
  /* semi-transparent pour laisser voir derrière */
  backdrop-filter: blur(10px);
  /* flou */
  -webkit-backdrop-filter: blur(10px);
  /* compatibilité Safari */

  border-right: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 4px 0 30px rgba(108, 172, 228, 0.15);

  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}


/* Header logo et tagline */
.header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
}

.logo {
  max-width: 120px;
}

.tagline {
  font-size: 0.9rem;
  color: #bbb;
}

.search-box {
  position: relative;
  width: 100%;
  box-sizing: border-box;
  z-index: 10
}

.search-box input {
  display: block;
  width: 100%;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.2);

  background: rgba(42, 42, 42, 0.6);
  /* semi-transparent comme la sidebar */
  backdrop-filter: blur(6px);
  /* flou interne */
  -webkit-backdrop-filter: blur(6px);
  /* Safari */

  color: #e0e0e0;
  font-size: 0.95rem;
  box-sizing: border-box;
}

.search-box input::placeholder {
  color: rgba(224, 224, 224, 0.6);
  /* placeholder discret */
}

/* Dropdown suggestions */
.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;

  background: rgba(42, 42, 42, 0.75);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);

  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  margin-top: 6px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);

  list-style: none;
  padding: 0;
  z-index: 999;
}

.dropdown li {
  padding: 10px 12px;
  cursor: pointer;
  color: #e0e0e0;
}

.dropdown li:hover,
.dropdown li.active {
  background: rgba(108, 172, 228, 0.25);
}


/* Outils */
.tools {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.tools button {
  background-color: #6cace4;
  color: #fff;
  border: none;
  padding: 10px 14px;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.tools button:hover {
  background-color: #4a94cf;
}

/* Boutons retour */
.buttons-container {
  margin-top: auto;
  display: flex;
  flex-direction: column;
  padding-bottom: 10px;
  gap: 10px;
}

.back-button {
  display: block;
  width: 100%;
  background-color: #6cace4;
  color: #fff;
  padding: 8px 0;
  border-radius: 10px;
  text-align: center;
  text-decoration: none;
  font-size: 1rem;
  opacity: 0.85;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.back-button:hover {
  background-color: #4a94cf;
  transform: scale(1.02);
}

.date-selector {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.date-selector .date-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.date-selector .label {
  flex: 0 0 60px;
  /* largeur fixe pour aligner les labels */
  font-size: 0.9rem;
  color: #bbb;
}

.date-selector .input-date {
  flex: 1;
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);

  background: rgba(42, 42, 42, 0.6);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);

  color: #e0e0e0;
  font-size: 0.95rem;
}

.date-selector .input-date::-webkit-calendar-picker-indicator {
  filter: invert(1);
  cursor: pointer;
}

.date-selector .input-date:focus {
  outline: none;
  border: 1px solid rgba(108, 172, 228, 0.6);
}


.date-container {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(42, 42, 42, 0.6);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  padding: 10px 14px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.date-container .label {
  font-size: 0.9rem;
  color: #bbb;
  margin-left: 8px;
}

.date-container .current-date {
  font-size: 0.95rem;
  color: #e0e0e0;
  background: rgba(255, 255, 255, 0.05);
  padding: 4px 8px;
  border-radius: 6px;
  min-width: 80px;
  text-align: center;
}

/* Style du slider */
.date-container .date-slider {
  flex: 1;
  -webkit-appearance: none;
  appearance: none;
  height: 6px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.2);
  cursor: pointer;
}

/* Track */
.date-container .date-slider::-webkit-slider-runnable-track {
  height: 6px;
  border-radius: 4px;
  background: linear-gradient(90deg, #6cace4, #4a8cc7);
}

.date-container .date-slider::-moz-range-track {
  height: 6px;
  border-radius: 4px;
  background: linear-gradient(90deg, #6cace4, #4a8cc7);
}

/* Thumb */
.date-container .date-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  height: 14px;
  width: 14px;
  border-radius: 50%;
  background: #e0e0e0;
  border: 2px solid #6cace4;
  margin-top: -4px;
  cursor: pointer;
}

.date-container .date-slider::-moz-range-thumb {
  height: 14px;
  width: 14px;
  border-radius: 50%;
  background: #e0e0e0;
  border: 2px solid #6cace4;
  cursor: pointer;
}

/* Bouton Play/Pause */
.date-container .play-pause-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 8px;
  padding: 6px 8px;
  cursor: pointer;
  color: #e0e0e0;
  transition: background 0.2s;
}

.date-container .play-pause-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}
</style>
