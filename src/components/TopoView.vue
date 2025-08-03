<template>
    <div class="topo-style" @mouseenter="mapStore.showAllTopo = true"
        @mouseleave="mapStore.showAllTopo = false">
        <div class="basemap-icons-map">
            <div class="basemap-icon-ign" :class="{ active: mapStore.showTopo }"
                @click="toggleTopo('topo')">
                <img src="/ign/topo.png" alt="topo" />
            </div>
            <div v-for="layer in topos" :key="layer.type" v-show="mapStore.showAllTopo"
                class="basemap-icon-ign" :class="{ active: layer.show }" @click="toggleTopo(layer.type)">
                <img :src="`/ign/${layer.type}.svg`" :alt="layer.type" />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { watch } from 'vue'
import { topos } from '../bd/topo';
import { useMapStore } from '../stores/mapStore';
import { getBbox } from '../utils/utils';
import { fetchWfs } from '../utils/wfs';

const props = defineProps({ mapContainer: Object })

const mapStore = useMapStore();

function toggleTopo(type: string) {
    if (type === "topo") {
        mapStore.showTopo = !mapStore.showTopo;

        topos.forEach(item => {
            item.show = mapStore.showTopo;

            if (mapStore.showTopo) {
                if (!mapStore.layerActive.includes(item.type)) {
                    mapStore.layerActive.push(item.type);
                }
            } else {
                mapStore.layerActive = mapStore.layerActive.filter(l => l !== item.type);
            }
        });
        console.log(topos);
    }
    else {
        const bd = topos.find(item => item.type === type);
        if (!bd) return;

        bd.show = !bd.show;
        console.log(type, bd.show);

        if (bd.show) {
            if (!mapStore.layerActive.includes(type)) {
                mapStore.layerActive.push(type);
            }
        } else {
            mapStore.layerActive = mapStore.layerActive.filter(l => l !== type);
        }

    }
    loadTopos();
}

async function loadTopos() {
    for (const topo of topos) {
        let features;
        if ((mapStore.map.getZoom() >= topo.minZoom) && (mapStore.map.getZoom() <= topo.minZoom + 4) && (topo.show == true)) {
            console.log(mapStore.map.getZoom());
            features = await fetchWfs("https://data.geopf.fr/wfs/ows", topo.type, getBbox(mapStore.map.getBounds()), "geometrie");
            mapStore.show(topo.type, features, topo.fill, topo.line, 1, [2, 2]);
        } else {
            mapStore.unshow(topo.type);
        }
    }
}

watch(
    () => props.mapContainer,
    (newMapContainer) => {
        if (newMapContainer) {
            mapStore.map.on('moveend', async () => {
                loadTopos()
            });
            mapStore.map.on('boxzoomend', async () => {
                loadTopos()
            });
        }
    }
)

</script>

<style>
.topo-style {
  position: absolute;
  bottom: 355px;
  right: 10px;
  z-index: 1;
  background: #404040;
  padding: 8px;
  border-radius: 4px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}



.basemap-icons-map {
    display: flex;
    flex-direction: row-reverse;
    gap: 8px;
    max-width: 50vw;
    /* padding: 4px; */
    overflow-x: auto;
    overflow-y: hidden;
    box-sizing: border-box;

    /* Firefox */
    scrollbar-width: thin;
    scrollbar-color: #007BFF transparent;
}

/* Chrome, Edge, Safari */
.basemap-icons-map::-webkit-scrollbar {
    height: 3px;
    /* épaisseur de la scrollbar horizontale */
}

.basemap-icons-map::-webkit-scrollbar-track {
    background: transparent;
    /* fond */
}

.basemap-icons-map::-webkit-scrollbar-thumb {
    background-color: #007BFF;
    /* couleur du thumb */
    border-radius: 3px;
}

.basemap-icons-map::-webkit-scrollbar-thumb:hover {
    background-color: #0056b3;
    /* couleur au hover */
}


.basemap-icon-ign {
    flex: 0 0 auto;
    /* empêche les icônes de se réduire */
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

.basemap-icon-ign.active {
    border-color: #007BFF;
    /* transform: scale(1.05); */
    opacity: 100%;
}

.basemap-icon-ign img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
</style>