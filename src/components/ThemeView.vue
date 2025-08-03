<template>
  <div class="themes">
    <div id="globe-container"></div>
    <div class="content">
      <div class="header">
        <h1>Choisissez votre analyse</h1>
        <p class="intro">
          Explorez nos visualisations thématiques. Chaque analyse ouvre une carte dédiée avec les couches associées.
        </p>
      </div>

      <!-- Conteneur scrollable -->
      <div class="cards-container">
        <div class="cards">
          <div v-for="(category, index) in categories" :key="index" class="category">
            <h2>{{ category.title }}</h2>

            <div class="cards-grid">
              <div v-for="(item, i) in category.items" :key="i" class="card"
                :style="{ backgroundImage: `url(${item.image})` }" @click="goToMap(item.id)">
                <div class="overlay">
                  <!-- <h3>{{ item.label }}</h3> -->
                  {{ item.label }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <router-link to="/" class="back-button">
        ← Retour à la page d'accueil
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { onMounted } from "vue";
import Globe from "globe.gl";

const router = useRouter();

onMounted(() => {
  const container = document.getElementById("globe-container")!;
  const dpr = window.devicePixelRatio || 1;

  const globe = new Globe(container)
    .globeImageUrl("/images/earth-night.jpg")
    .backgroundColor("#2a2a2a");

  globe.width(container.clientWidth * dpr);
  globe.height(container.clientHeight * dpr);

  globe.controls().autoRotate = true;
  globe.controls().autoRotateSpeed = 1;

  globe.pointOfView({ lat: 0, lng: 0, altitude: 1.5 }, 0);
});

const goToMap = (id: string) => {
  router.push(`/${id}`);
};


const categories = [
  {
    title: "Analyse végétation & risques",
    items: [
      { id: "risque-incendie", label: "Zones à risque incendie", image: "/images/risque-incendie.jpg" },
      { id: "vegetation-invasive", label: "Végétation invasive", image: "/images/vegetation-invasive.jpg" },
      { id: "deforestation", label: "Coupes illégales", image: "/images/deforestation.jpg" }
    ]
  },
  {
    title: "Infrastructures et sécurité",
    items: [
      { id: "lignes-electriques", label: "Lignes électriques envahies", image: "/images/lignes-electriques.jpg" },
      { id: "routes-obstruees", label: "Routes / chemins obstrués", image: "/images/routes.jpg" },
      { id: "zones-non-accessibles", label: "Zones non accessibles aux secours", image: "/images/secours.jpg" }
    ]
  },
  {
    title: "Urbanisme et foncier",
    items: [
      { id: "constructions-non-declarees", label: "Constructions non déclarées", image: "/images/constructions.jpg" },
      { id: "zones-constructibles", label: "Zones constructibles vierges", image: "/images/terrain-vierge.jpg" },
      { id: "urbanisation", label: "Évolution de l’urbanisation", image: "/images/urbanisation.jpg" }
    ]
  },
  {
    title: "Environnement et biodiversité",
    items: [
      { id: "zones-humides", label: "Cartographie zones humides", image: "/images/zones-humides.jpg" },
      { id: "corridors-ecologiques", label: "Couloirs écologiques", image: "/images/corridors.jpg" },
      { id: "pollinisation", label: "Suivi de la pollinisation", image: "/images/pollinisation.jpg" }
    ]
  },
  {
    title: "Énergies renouvelables",
    items: [
      { id: "solaire", label: "Toits propices au solaire", image: "/images/solaire.jpg" },
      { id: "eolien-biomasse", label: "Sites propices à l’éolien ou biomasse", image: "/images/eolien.jpg" }
    ]
  },
  {
    title: "Agriculture de précision",
    items: [
      { id: "vigueur-parcellaire", label: "Indice de vigueur parcellaire", image: "/images/vigueur.jpg" },
      { id: "rendement", label: "Prévision de rendement", image: "/images/rendement.jpg" },
      { id: "stress-azote", label: "Stress azoté ou irrigation", image: "/images/stress-azote.jpg" }
    ]
  },
  {
    title: "Risques naturels et environnementaux",
    items: [
      { id: "glissements-terrain", label: "Glissements de terrain", image: "/images/glissement.jpg" },
      { id: "zones-inondables", label: "Zones inondables végétalisées", image: "/images/inondation.jpg" },
      { id: "zones-incendie-post", label: "Suivi post-incendie", image: "/images/post-incendie.jpg" },
      { id: "ilots-chaleur", label: "Îlots de chaleur urbains", image: "/images/ilot-chaleur.jpg" }
    ]
  },
  {
    title: "Suivi d’infrastructures",
    items: [
      { id: "envasement", label: "Envasement des cours d’eau", image: "/images/envasement.jpg" },
      { id: "servitudes", label: "Occupation des servitudes", image: "/images/servitudes.jpg" },
      { id: "digues", label: "Surveillance des digues et talus", image: "/images/digues.jpg" }
    ]
  },
  {
    title: "Détection de non-conformités",
    items: [
      { id: "plantations-interdites", label: "Plantations en zones interdites", image: "/images/plantations.jpg" },
      { id: "clotures", label: "Clôtures ou obstacles non déclarés", image: "/images/clotures.jpg" },
      { id: "occupation-illegale", label: "Occupation illégale de parcelles", image: "/images/occupation.jpg" }
    ]
  },
  {
    title: "Suivi de la ressource en eau",
    items: [
      { id: "evapotranspiration", label: "Évapotranspiration excessive", image: "/images/evapo.jpg" },
      { id: "canaux", label: "Canaux d’irrigation obstrués", image: "/images/canaux.jpg" },
      { id: "reservoirs", label: "Réservoirs ou mares asséchées", image: "/images/reservoirs.jpg" }
    ]
  },
  {
    title: "Gestion des forêts",
    items: [
      { id: "maladies", label: "Détection de maladies forestières", image: "/images/maladies.jpg" },
      { id: "fragmentation", label: "Fragmentation des massifs forestiers", image: "/images/fragmentation.jpg" },
      { id: "croissance", label: "Suivi de la croissance forestière", image: "/images/croissance.jpg" }
    ]
  },
  {
    title: "Tourisme & loisirs",
    items: [
      { id: "sentiers", label: "État des sentiers de randonnée", image: "/images/sentiers.jpg" },
      { id: "amenagements", label: "Aménagements touristiques mal entretenus", image: "/images/amenagements.jpg" },
      { id: "paysages", label: "Cartographie des paysages ouverts/fermés", image: "/images/paysages.jpg" }
    ]
  },
  // {
  //   title: "Analyses transverses",
  //   items: [
  //     { id: "changement-occupation", label: "Changements d’occupation du sol", image: "/images/changement-occupation.jpg" },
  //     { id: "zones-abandonnees", label: "Détection des zones abandonnées", image: "/images/abandon.jpg" },
  //     { id: "renaturation", label: "Potentiel de renaturation", image: "/images/renaturation.jpg" }
  //   ]
  // }
];
</script>

<style scoped>
.themes {
  position: relative;
  overflow-y: auto;
  font-family: 'Inter', 'Roboto', sans-serif;
  color: #e0e0e0;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #2a2a2a;
}

#globe-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
  pointer-events: none;
}

.content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  max-width: 1000px;
  height: 90vh; /* contrainte pour placer le scroll interne */
  padding: 20px 30px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 16px;
  box-shadow: 0 0 30px rgba(108, 172, 228, 0.15);
  backdrop-filter: blur(8px);
   overflow: hidden;
}

h1 {
  font-size: 2.2rem;
  margin-bottom: 10px;
  color: #6cace4;
  text-align: center;
}

.intro {
  text-align: center;
  font-size: 1rem;
  color: #bbb;
  margin-bottom: 5px;
}


.category h2 {
  font-size: 1.3rem;
  color: #6cace4;
  margin-bottom: 15px;
  text-align: center;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 15px;
   padding-bottom: 5px;
}

.cards-container {
  flex: 1; /* prend tout l'espace restant */
  overflow-y: auto;
  margin: 20px 0;
  padding-right: 25px; /* pour éviter que le scroll colle au bord */
  scroll-behavior: smooth;
}

/* Scrollbar style */
.cards-container::-webkit-scrollbar {
  width: 8px;
}

.cards-container::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
}

.cards-container::-webkit-scrollbar-thumb {
  background: rgba(108, 172, 228, 0.4);
  border-radius: 8px;
  transition: background 0.3s ease;
}

.cards-container::-webkit-scrollbar-thumb:hover {
  background: rgba(108, 172, 228, 0.7);
}

/* Pour Firefox */
.cards-container {
  scrollbar-width: thin;
  scrollbar-color: rgba(108, 172, 228, 0.4) rgba(255, 255, 255, 0.05);
}

.cards {
  display: flex;
  flex-direction: column;
}

.card {
  position: relative;
  border-radius: 12px;
  height: 140px;
  background-size: cover;
  background-position: center;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.3s ease;
  border: 1px solid #2a2a2a;
  opacity: 0.55;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 0 15px rgba(108, 172, 228, 0.3);
  opacity: 1;
}

.overlay {
  position: absolute;
  bottom: 0;
  width: 100%;
  background: rgba(10, 10, 10, 0.6);
  text-align: center;
  padding: 8px;
}

.overlay h3 {
  color: #fff;
  font-size: 0.95rem;
  margin: 0;
}


.back-button {
  flex-shrink: 0; /* reste en bas fixe */
  display: inline-block;
  background-color: #6cace4;
  color: white;
  padding: 14px 0;
  border-radius: 10px;
  text-align: center;
  text-decoration: none;
  font-weight: bold;
  font-size: 1rem;
  transition: background-color 0.3s ease, transform 0.2s ease;
  opacity: 0.85;
}

.back-button:hover {
  background-color: #4a94cf;
  transform: scale(1.05);
}
</style>