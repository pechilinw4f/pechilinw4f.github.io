<template>
  <div class="home">
    <div id="globe-container"></div>
    <div class="content">
      <!-- <h1>Vue Orbital</h1> -->
      <div class="header">
        <img src="/assets/vue_orbital_logo_blue.svg" alt="Vue Orbitale" class="logo" />
        <p class="tagline">
          Explorez gratuitement la Terre comme jamais auparavant — tout est calculé et rendu directement dans votre navigateur,
          grâce à l’intelligence satellite.
        </p>
      </div>

      <div class="features">
        <div class="feature">
          <div class="feature-header">
            <img src="/assets/icons/satellite.svg" alt="Icône satellite" class="icon" />
            <h2>Accès aux données satellites</h2>
          </div>
          <p>
            Connectez-vous directement aux missions Sentinel et récupérez des GeoTIFF optimisés pour le
            cloud (COG) en toute simplicité.
          </p>
        </div>

        <div class="feature">
          <div class="feature-header">
            <img src="/assets/icons/vegetation.svg" alt="Icône indice de végétation" class="icon" />
            <h2>Indices de végétation</h2>
          </div>
          <p>
            Exécutez les indices NDVI, NDWI, NDMI et d’autres indices spectraux pour surveiller la santé des
            plantes, les plans d’eau et les changements de terrain.
          </p>
        </div>
        <div class="feature">
          <div class="feature-header">
            <img src="/assets/icons/ai.svg" alt="Icône traitement IA" class="icon" />
            <h2>Traitement intelligent</h2>
          </div>
          <p>
            Exploitez des modèles d’IA pour la classification des sols, la détection d’anomalies et la
            génération d’informations prédictives pour l’agriculture et le climat.
          </p>
        </div>
        <div class="feature">
          <div class="feature-header">
            <img src="/assets/icons/map.svg" alt="Icône carte interactive" class="icon" />
            <h2>Visualisation interactive</h2>
          </div>
          <p>
            Utilisez une interface cartographique fluide pour naviguer dans le temps, les couches et les
            thématiques. Zoomez, filtrez et comparez les scènes.
          </p>
        </div>
        <div class="feature">
          <div class="feature-header">
            <img src="/assets/icons/export.svg" alt="Icône export" class="icon" />
            <h2>Export et intégration</h2>
          </div>
          <p>
            Téléchargez vos analyses ou intégrez les résultats dans des outils SIG et API externes.
          </p>
        </div>
        <div class="feature">
          <div class="feature-header">
            <img src="/assets/icons/alert.svg" alt="Icône alerte" class="icon" />
            <h2>Alertes et suivi en temps réel</h2>
          </div>
          <p>
            Configurez des notifications automatiques pour détecter des changements significatifs
            (déforestation, sécheresse,
            inondations) et suivez l'évolution de vos zones d'intérêt en direct.
          </p>
        </div>
      </div>

      <router-link to="/theme" class="start-button">
        Lancer la visualisation
      </router-link>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import Globe from "globe.gl";

onMounted(() => {
  const container = document.getElementById("globe-container")!;
  const dpr = window.devicePixelRatio || 1;

  const globe = new Globe(container)
    .globeImageUrl("/images/earth-night.jpg")
    .backgroundColor("#2a2a2a");

  // Fixe la taille du globe au container * devicePixelRatio
  globe.width(container.clientWidth * dpr);
  globe.height(container.clientHeight * dpr);

  globe.controls().autoRotate = true;
  globe.controls().autoRotateSpeed = 1;

  globe.pointOfView({ lat: 0, lng: 0, altitude: 1.5 }, 0);


});
</script>


<style scoped>
.home {
  position: relative;
  overflow-y: auto;
  font-family: 'Inter', 'Roboto', sans-serif;
  color: #e0e0e0;

  /* Ajout pour centrer */
  display: flex;
  justify-content: center;  /* centre horizontalement */
  align-items: center;      /* centre verticalement */
  min-height: 100vh;        /* prend toute la hauteur de l'écran */
  background-color: #2a2a2a;
}
#globe-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  /* taille écran */
  height: 100vh;
  /* taille écran */
  z-index: 0;
  pointer-events: none;
  /* permet d’interagir avec contenu devant */
}

.content {
  position: relative;
  z-index: 1;
  max-width: 1000px;
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 16px;
  box-shadow: 0 0 30px rgba(108, 172, 228, 0.15);
  backdrop-filter: blur(8px);
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 20px;
  color: #6cace4;
  text-align: center;
}
.header {
  display: flex;
  align-items: center; /* centre verticalement */
  gap: 12px; /* espace entre le logo et le texte */
  margin-bottom: 20px;
}

.logo {
  max-width: 100px;
  height: auto;
}

.tagline {
  font-size: 1rem;
  color: #bbb;
  margin: 0; /* supprime le margin par défaut */
}


.features {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-bottom: 40px;
}

.feature {
  background: rgba(255, 255, 255, 0.03);
  padding: 8px;
  border-radius: 12px;
  border: 1px solid #2a2a2a;
  text-align: left;
  transition: transform 0.2s ease;
  opacity: 0.7;
}

.feature:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.05);
  opacity: 1;
}

.feature h2 {
  font-size: 1.2rem;
  color: #6cace4;
  margin: 10px 0;
}

.feature p {
  font-size: 0.9rem;
  color: #ccc;
}

.icon {
  width: 48px;
  height: 48px;
  margin-bottom: 10px;
  filter: brightness(1.2);
}

.start-button {
  display: inline-block;
  width: 100%;
  /* prendre toute la largeur */
  background-color: #6cace4;
  color: white;
  padding: 14px 0;
  /* enlever le padding horizontal pour coller à la largeur */
  border-radius: 10px;
  text-align: center;
  text-decoration: none;
  font-weight: bold;
  font-size: 1rem;
  transition: background-color 0.3s ease, transform 0.2s ease;
  opacity: 0.8;
}

.start-button:hover {
  background-color: #4a94cf;
  transform: scale(1.01);
}

.feature-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.feature-header h2 {
  margin: 0;
}
</style>
