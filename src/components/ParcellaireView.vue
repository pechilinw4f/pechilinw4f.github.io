<template>
    <div class="parcellaire-style" @mouseenter="mapStore.showAllParcellaire = true"
        @mouseleave="mapStore.showAllParcellaire = false">
        <div class="basemap-icons-map">
            <div class="basemap-icon-ign" :class="{ active: mapStore.showParcellaire }"
                @click="toggleParcellaire('parcellaire')">
                <img src="/ign/parcellaire.png" alt="parcellaire" />
            </div>
            <div v-for="layer in parcellaires" :key="layer.type" v-show="mapStore.showAllParcellaire"
                class="basemap-icon-ign" :class="{ active: layer.show }" @click="toggleParcellaire(layer.type)">
                <img :src="`/ign/${layer.type}.svg`" :alt="layer.type" />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { watch } from 'vue'
import { parcellaires } from '../bd/parcellaire';
import { useMapStore } from '../stores/mapStore';
import { getBbox } from '../utils/utils';
import { fetchWfs } from '../utils/wfs';
import { useGeometryStore } from '../stores/geometryStore';

const props = defineProps({ mapContainer: Object })

const mapStore = useMapStore();

function toggleParcellaire(type: string) {
    if (type === "parcellaire") {
        mapStore.showParcellaire = !mapStore.showParcellaire;

        parcellaires.forEach(item => {
            item.show = mapStore.showParcellaire;

            if (mapStore.showParcellaire) {
                if (!mapStore.layerActive.includes(item.type)) {
                    mapStore.layerActive.push(item.type);
                }
            } else {
                mapStore.layerActive = mapStore.layerActive.filter(l => l !== item.type);
            }
        });
        console.log(parcellaires);
    }
    else {
        const bd = parcellaires.find(item => item.type === type);
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
    loadParcellaires();
}

async function loadParcellaires() {
    const geometryStore = useGeometryStore();
    let bbox = getBbox(mapStore.map.getBounds());
    if (geometryStore.bounds) {
        const bboxAoi = geometryStore.bounds;
        if (bbox[0] > bboxAoi[0] && bbox[1] > bboxAoi[1] && bbox[2] > bboxAoi[2] && bbox[3] > bboxAoi[3]) {
            bbox = geometryStore.bounds!
        }
    }
    const outputbbox = bbox.join(',');
    for (const parcellaire of parcellaires) {
        let features;
        if ((mapStore.map.getZoom() >= parcellaire.minZoom) && (mapStore.map.getZoom() <= parcellaire.minZoom + 4) && (parcellaire.show == true)) {
            console.log(mapStore.map.getZoom());
            features = await fetchWfs("https://data.geopf.fr/wfs/ows", parcellaire.type, outputbbox, "geom");
            mapStore.show(parcellaire.type, features, parcellaire.fill, parcellaire.line, 1);
        } else {
            mapStore.unshow(parcellaire.type);
        }
    }
}

watch(
    () => props.mapContainer,
    (newMapContainer) => {
        if (newMapContainer) {
            mapStore.map.on('moveend', async () => {
                loadParcellaires()
            });
            mapStore.map.on('boxzoomend', async () => {
                loadParcellaires()
            });
        }
    }
)

</script>

<style>
.parcellaire-style {
    position: absolute;
    bottom: 275px;
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