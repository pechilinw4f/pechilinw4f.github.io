<template>
  <div class="layout">
    <div ref="mapContainer" class="map-container">

      <div class="logo-container">
        <img :src="mapStore.sourcesLoaded
          ? '/assets/vue_orbital_logo_green.svg'
          : '/assets/vue_orbital_logo_red.svg'" alt="Vue Orbital Logo" />
      </div>

      <div v-if="sentinelStore.dates && sentinelStore.dates.length <= 0" class="date-hint">
        <div class="hint-text">Continue by selecting a date range here</div>
        <div class="hint-arrow">➡</div>
      </div>
      <div class="date-selector" v-if="geometryStore.drawing == true">
        <label for="startDate" class="label">Start :</label>
        <input id="startDate" type="date" v-model="dateStore.startDate" class="input-date" @change="start" />
        <label for="endDate" class="label">End :</label>
        <input id="endDate" type="date" v-model="dateStore.endDate" class="input-date" @change="start" />
      </div>

      <DebroussaillementView :mapContainer="mapContainer!" />
      <TopoView :mapContainer="mapContainer!" />
      <ParcellaireView :mapContainer="mapContainer!" />


      <div class="drop-down-image" @mouseenter="mapStore.showAllImage = true"
        @mouseleave="mapStore.showAllImage = false">
        <div class="basemap-icons">
          <div v-for="(name) in imageTypes" :key="name" v-show="mapStore.showAllImage || name === mapStore.imageType"
            class="basemap-icon" :class="{ active: mapStore.imageType === name }" @click="updateLayerUrlsByDate(name)">
            <img :src="`/imagetype/${name}.png`" :alt="name" />
          </div>
        </div>
      </div>

      <div class="drop-down-map" @mouseenter="mapStore.showAllBaseMap = true"
        @mouseleave="mapStore.showAllBaseMap = false">
        <div class="basemap-icons">
          <div v-for="(_, name) in baseMaps" :key="name" v-show="mapStore.showAllBaseMap || name === mapStore.basemap"
            class="basemap-icon" :class="{ active: mapStore.basemap === name }" @click="mapStore.changeBasemap(name)">
            <img :src="`/thumbnails/${name}.png`" :alt="name" />
          </div>
        </div>
      </div>
      
      <div v-if="sentinelStore.dates && sentinelStore.dates.length > 0" class="play-hint">
        <div class="hint-arrow">⬅</div>
        <div class="hint-text">End by launching a simulation here</div>
      </div>
      <div class="date-container" v-if="sentinelStore.dates && sentinelStore.dates.length > 0">
        <input class="date-slider" type="range" v-model="dateStore.currentDate" :max="dateStore.maxDateIndex"
          list="dates" @input="displayFeaturesOnMap" />

        <label for="current" class="label">Current :</label>
        <span class="current-date">
          {{
            (() => {
              const d = sentinelStore.dates[dateStore.currentDate];
              if (!d) return '';
              const [y, m, day] = d.split('-');
              return `${day}/${m}/${y}`;
            })()
          }}
        </span>
        <button @click="togglePlay" class="play-pause-btn">
          <PlayIcon v-if="!isPlaying" />
          <PauseIcon v-else />
        </button>
      </div>

    </div>
  </div>
</template>

<script lang="ts" setup>
import { PlayIcon, PauseIcon } from '@heroicons/vue/24/solid'
import { onMounted, ref } from 'vue'
import maplibregl from 'maplibre-gl'
// import '../css/maplibre-gl.css'
import 'maplibre-gl/dist/maplibre-gl.css'
import MaplibreCOGProtocol from '@promethee-earth/maplibre-cog-protocol'
import { MaplibreTerradrawControl } from '@watergis/maplibre-gl-terradraw';

import '@watergis/maplibre-gl-terradraw/dist/maplibre-gl-terradraw.css';


import { useMapStore, baseMaps, imageTypes } from '../stores/mapStore'
import { useGeometryStore } from '../stores/geometryStore'
import { useDateStore } from '../stores/dateStore'
import { useSentinelStore } from '../stores/sentinelStoreByDate'
import ParcellaireView from './ParcellaireView.vue'
import TopoView from './TopoView.vue'
import DebroussaillementView from './DebroussaillementView.vue'

const mapContainer = ref<HTMLDivElement | null>(null)

const mapStore = useMapStore();
const geometryStore = useGeometryStore();
const sentinelStore = useSentinelStore();
const dateStore = useDateStore()

const isPlaying = ref(false)
let playInterval: ReturnType<typeof setInterval> | null = null

function displayFeaturesOnMap() {
  const dateStore = useDateStore()
  const urls = sentinelStore.urls
  sentinelStore.dates!.forEach((date, dateIndex) => {
    const urlsForDate = urls[date];
    urlsForDate.forEach((_, urlIndex) => {
      imageTypes.forEach((type, _) => {
        const layerId = `cog_imageLayer_${type}_${dateIndex}_${urlIndex}`;
        if (mapStore.map.getLayer(layerId)) {
          if (dateIndex == dateStore.currentDate && type == mapStore.imageType) {
            mapStore.map.setPaintProperty(layerId, 'raster-opacity', 0.6);
          } else {
            mapStore.map.setPaintProperty(layerId, 'raster-opacity', 0);
          }
        }
      });
    });
  });
}

function updateLayerUrlsByDate(type: string) {
  mapStore.removeLayersAndSourcesFromMap("cog")
  mapStore.imageType = type;
  const geometryStore = useGeometryStore();
  const sentinelStore = useSentinelStore();
  const data = sentinelStore.urls;
  console.log(data);
  // const dates = Object.keys(data).sort();
  // dates.value = Object.keys(data);
  dateStore.maxDateIndex = sentinelStore.dates!.length - 1;

  sentinelStore.dates!.forEach((date, dateIndex) => {
    const urlsForDate = data[date];

    urlsForDate.forEach((urls, urlsIndex) => {
      // imageTypes.forEach((type, typeIndex) => {
      // const type = imageType.value;
      // const sourceId = `imageSource_${dateIndex}_${urlsIndex}_${typeIndex}`
      let cog_url = ""
      if (type == "True Color Image") {
        cog_url = `cog://${urls["TCI"]}#+${geometryStore.bbox}`
        console.log(cog_url);
      } else if (type == "NDVI") {
        const colors = [
          "#FFFFFF", // bleu vif
          "#004400"  // jaune vif
          // "#0c0c0c", // NDVI < -0.5 (eau / sombre)
          // "#eaeaea", // -0.5 < NDVI ≤ 0 (zones stériles)
          // "#ccc682", // 0 < NDVI ≤ .1 (sol nu / faible végétation)
          // "#91bf51", // .1 < NDVI ≤ .2
          // "#70a33f", // .2 < NDVI ≤ .3
          // "#4f892d", // .3 < NDVI ≤ .4
          // "#306d1c", // .4 < NDVI ≤ .5
          // "#0f540a", // .5 < NDVI ≤ .6
          // "#004400"  // .6 < NDVI ≤ 1.0 (forêts denses)
        ];
        // const min = -0.5;  // borne inférieure NDVI
        // const max = 1.0;   // borne supérieure NDVI
        const min = 0.6;    // borne inférieure NDVI
        const max = 1.0;    // borne supérieure NDVI
        const modifiers = "-c"; // 'c' pour dégradé continu
        const computation = `[${colors.map(c => `"${c}"`).join(",")}],${min},${max}${modifiers}`;

        cog_url = `cog://${urls["NIR"]}|${urls["RED"]}#color:${computation}+${geometryStore.bbox}`
      } else if (type == "NDMI") {
        const colors = [
          "#800000", // NDMI < -0.8 (sol sec, zones stériles)
          "#ff0000", // -0.8 < NDMI ≤ -0.24
          "#ffff00", // -0.24 < NDMI ≤ -0.032
          "#00ffff", // -0.032 < NDMI ≤ 0.032
          "#0000ff", // 0.032 < NDMI ≤ 0.24
          "#000080"  // 0.24 < NDMI ≤ 0.8 (zones humides, végétation hydratée)
        ];
        const min = -0.8;  // borne inférieure NDMI
        const max = 0.8;   // borne supérieure NDMI
        const modifiers = "-c"; // dégradé continu
        const computation = `[${colors.map(c => `"${c}"`).join(",")}],${min},${max}${modifiers}`;

        cog_url = `cog://${urls["NIR"]}|${urls["SWIR16"]}#color:${computation}+${geometryStore.bbox}`;
      } else if (type == "NDWI") {
        const colors = [
          "#008000", // NDWI < 0 (végétation)
          "#FFFFFF", // NDWI = 0 (transition)
          "#0000CC"  // NDWI > 0 (eau)
        ];
        const min = -0.8; // borne inférieure (comme EO Browser)
        const max = 0.8;  // borne supérieure (comme EO Browser)
        const modifiers = "c"; // 'c' pour dégradé continu
        const computation = `[${colors.map(c => `"${c}"`).join(",")}],${min},${max}${modifiers}`;

        cog_url = `cog://${urls["GREEN"]}|${urls["NIR"]}#color:${computation}+${geometryStore.bbox}`;
      } else if (type == "UI") {
        // Palette couleurs pour UI (du non bâti au bâti)
        const colors = [
          "#f7f7f7", // UI très faible (zones non bâties, végétation, eau)
          "#d9d9d9",
          "#bdbdbd",
          "#969696",
          "#737373",
          "#525252",
          "#252525", // UI élevé (zones bâties denses)
        ];

        const min = -1.0;  // borne inférieure UI possible (peut aller jusqu'à -1)
        const max = 1.0;   // borne supérieure UI possible (peut aller jusqu'à 1)
        const modifiers = "-c"; // dégradé continu

        // Note: UI = (B11 - B8) / (B11 + B8)
        // Dans l'URL du COG, on passe les bandes SWIR (B11) et NIR (B8)
        // urls["SWIR"] et urls["NIR"] doivent pointer vers les COG correspondants

        const computation = `[${colors.map(c => `"${c}"`).join(",")}],${min},${max}${modifiers}`;

        cog_url = `cog://${urls["SWIR16"]}|${urls["NIR"]}#color:${computation}+${geometryStore.bbox}`;
      }


      if (cog_url != "") {
        const sourceId = `cog_imageSource_${type}_${dateIndex}_${urlsIndex}`
        if (!mapStore.map.getSource(sourceId)) {
          mapStore.map.addSource(sourceId, {
            type: 'raster',
            // url: 'cog://' + url + `&bbox=${bounds[0]},${bounds[1]},${bounds[2]},${bounds[3]}` + "#color:BrewerSpectral7,1.7084054885838,1.7919403772937,c",
            url: cog_url,
            tileSize: 256,
            bounds: geometryStore.bounds!
          });
        }

        // const layerId = `imageLayer_${dateIndex}_${urlsIndex}_${typeIndex}`
        const layerId = `cog_imageLayer_${type}_${dateIndex}_${urlsIndex}`
        if (!mapStore.map.getLayer(layerId)) {
          mapStore.map.addLayer({
            id: layerId,
            source: sourceId,
            type: 'raster',
            paint: {
              'raster-opacity': 0
            }
          }, mapStore.layerActive![0]);
        }
      }
      // })
    })
  });

  const interval = setInterval(() => {
    mapStore.areSourcesLoaded("cog");
    if (mapStore.sourcesLoaded) {
      clearInterval(interval);
    } else {
    }
  }, 100);
  displayFeaturesOnMap();
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

async function start() {
  const geometryStore = useGeometryStore()
  if (geometryStore.bbox != null) {
    const dateStore = useDateStore();
    const sentinelStore = useSentinelStore();
    await sentinelStore.fetchSentinel2ScenesByDate(dateStore.startDate, dateStore.endDate, geometryStore.bbox!);
    updateLayerUrlsByDate(mapStore.imageType);
  }
  return true;
}


onMounted(async () => {
  if (mapContainer.value) {

    mapStore.initialize(mapContainer.value);
    maplibregl.addProtocol('cog', MaplibreCOGProtocol.cogProtocol);

    mapStore.map.on('load', () => {
      mapStore.map.addControl(new maplibregl.NavigationControl(), 'top-left');

      const draw = new MaplibreTerradrawControl({
        modes: [
          'rectangle',
          'select',
          'delete',
          // 'download'
        ],
        open: true,
      });
      mapStore.map.addControl(draw, 'top-left');

      draw.getTerraDrawInstance().updateModeOptions('select', {
        flags: {
          rectangle: {
            feature: {
              // The entire Feature can be moved
              draggable: true,
              coordinates: {
                resizable: 'center'
              }
            },
          }
        }
      })
      draw.getTerraDrawInstance().on('finish', async (featureId) => {
        const features = draw.getFeatures()
        if (features.features.length > 1) {
          console.log(draw.getFeatures());
          draw.getTerraDrawInstance().removeFeatures([features.features[0].id!])
        }
        const geometryStore = useGeometryStore();
        geometryStore.setGeometry(draw.getTerraDrawInstance().getSnapshotFeature(featureId)!.geometry);
        start();
        geometryStore.drawing = true;
        draw.getTerraDrawInstance().setMode("select");
      });
      draw.on('feature-deleted', () => {
        mapStore.removeLayersAndSourcesFromMap("cog")
        geometryStore.drawing = false;
      });

    });




  }
})

</script>

<style scoped>
.layout {
  display: flex;
  height: 100vh;
  width: 100vw;
  background-color: #404040;
  color: #e0e0e0;
  font-family: 'Inter', 'Roboto', sans-serif;

  :deep() {

    .maplibregl-ctrl-group:hover {
      opacity: 100%;
    }

    .maplibregl-ctrl-group button {
      z-index: 1;
      padding: 8px;
      border-radius: 4px;
      width: 50px;
      height: 50px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    }

    .maplibregl-ctrl-group button:hover {
      transform: scale(1.05);
      opacity: 100%;
    }

    .maplibregl-terradraw-add-control.active {
      background-color: #6cace4;
    }
  }
}

.map-container {
  flex-grow: 1;
  height: 100vh;
  background-color: #2f2f2f;
}

.status-indicator {
  position: absolute;
  top: 10px;
  right: 50px;
  z-index: 1;
  background: white;
  padding: 8px;
  border-radius: 4px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.status-indicator::before {
  content: "";
  display: inline-block;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: red;
  transition: background-color 0.3s ease;
}

.status-indicator.ready::before {
  background-color: green;
}

.status-indicator.loading::before {
  background-color: red;
}

.play-hint {
  position: absolute;
  bottom: 49px;
  right: calc(50% - 610px);
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 10px;
  background-color: rgba(64, 64, 64, 0.9);
  padding: 10px 14px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.4);
  color: #fff;
  font-weight: 500;
  font-size: 14px;
  animation: pulse 1.5s infinite;
  /* transform: translateX(%) translateX(-10px); */
}

.date-hint {
  position: absolute;
  top: 10px;
  left: calc(50% - 170px);
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 10px;
  background-color: rgba(64, 64, 64, 0.9);
  padding: 10px 14px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.4);
  color: #fff;
  font-weight: 500;
  font-size: 14px;
  animation: pulse 1.5s infinite;
  transform: translateX(-100%) translateX(-10px);
}

.date-selector {
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
  background-color: #3a3a3a;
  color: #f0f0f0;
  padding: 5px;
  border-radius: 15px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  opacity: 60%;
}

.date-selector:hover {
  opacity: 100%;
}

.label {
  padding: 5px 5px;
  color: #f0f0f0;
}

.input-date {
  padding: 5px 5px;
  border-radius: 10px;
  border: 1px solid #555;
  background-color: #3a3a3a;
  color: #f0f0f0;
  font-family: inherit;
  transition: border-color 0.3s ease, background-color 0.3s ease;
}

.input-date:focus {
  outline: none;
  border-color: #6cace4;
  background-color: #4a4a4a;
}

.date-container {
  position: absolute;
  bottom: 45px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  background: rgba(32, 32, 32, 0.75);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  width: 90%;
  max-width: 600px;
  transition: opacity 0.3s ease;
  opacity: 0.7;
}

.date-container:hover {
  opacity: 1;
}

input[type='range'] {
  flex: 1;
  appearance: none;
  height: 6px;
  background: #777;
  border-radius: 3px;
  outline: none;
  transition: background 0.3s ease;
}

input[type='range']::-webkit-slider-thumb {
  appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #fff;
  cursor: pointer;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
  transition: transform 0.2s ease;
}

input[type='range']::-webkit-slider-thumb:hover {
  transform: scale(1.2);
}

.current-date {
  color: white;
  font-weight: 500;
  font-size: 14px;
  white-space: nowrap;
  user-select: none;
}

.play-pause-btn {
  all: unset;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  border-radius: 6px;
  transition: background 0.2s ease, transform 0.1s ease;
}

.play-pause-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: scale(1.1);
}

.play-pause-btn svg {
  width: 20px;
  height: 20px;
  fill: white;
}

.basemap-icons {
  display: flex;
  flex-direction: row-reverse;
  gap: 8px;
}

.basemap-icon {
  width: 50px;
  height: 50px;
  border: 2px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  transition: border-color 0.2s, transform 0.2s;
  opacity: 50%;
}

.basemap-icon:hover {
  opacity: 100%;
}

.basemap-icon.active {
  border-color: #007BFF;
  /* couleur pour l’actif */
  transform: scale(1.05);
  opacity: 100%;
}

.basemap-icon img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.logo-container img {
  width: 70px;
  height: 70px;
  position: absolute;
  bottom: 40px;
  right: 10px;
  z-index: 1;
  background: #404040;
  border-radius: 4px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  opacity: 50%;
}

.logo-container:hover img:hover {
  opacity: 100%;
}

.drop-down-map {
  position: absolute;
  bottom: 115px;
  right: 10px;
  z-index: 1;
  background: #404040;
  padding: 8px;
  border-radius: 4px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  opacity: 100%;
}

.debroussaillement-style {
  position: absolute;
  bottom: 435px;
  right: 10px;
  z-index: 1;
  background: #404040;
  padding: 8px;
  border-radius: 4px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.drop-down-image {
  position: absolute;
  bottom: 195px;
  right: 10px;
  z-index: 1;
  background: #404040;
  padding: 8px;
  border-radius: 4px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.rectangle-hint {
  position: absolute;
  top: 175px;
  right: 70px;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 10px;
  background-color: rgba(64, 64, 64, 0.9);
  padding: 10px 14px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.4);
  color: #fff;
  font-weight: 500;
  font-size: 14px;
  animation: pulse 1.5s infinite;
}

.hint-arrow {
  font-size: 22px;
  animation: bounce 1s infinite;
}

@keyframes bounce {

  0%,
  100% {
    transform: translateX(0);
  }

  50% {
    transform: translateX(-5px);
  }
}

@keyframes pulse {
  0% {
    opacity: 0.7;
  }

  50% {
    opacity: 1;
  }

  100% {
    opacity: 0.7;
  }
}
</style>
