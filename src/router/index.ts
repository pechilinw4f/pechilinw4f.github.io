import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../components/HomeView.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/theme', component: () => import('../components/ThemeView.vue') },
  { path: '/risque-incendie', component: () => import('../components/IncendieMapView.vue') }, 
  { path: '/vegetation-invasive', component: () => import('../components/MapView.vue') },
  { path: '/deforestation', component: () => import('../components/MapView.vue') },
  { path: '/lignes-electriques', component: () => import('../components/MapView.vue') },
  { path: '/routes-obstruees', component: () => import('../components/MapView.vue') },
  { path: '/zones-non-accessibles', component: () => import('../components/MapView.vue') },
  { path: '/constructions-non-declarees', component: () => import('../components/MapView.vue') },
  { path: '/zones-constructibles', component: () => import('../components/MapView.vue') },
  { path: '/urbanisation', component: () => import('../components/MapView.vue') },
  { path: '/zones-humides', component: () => import('../components/MapView.vue') },
  { path: '/corridors-ecologiques', component: () => import('../components/MapView.vue') },
  { path: '/pollinisation', component: () => import('../components/MapView.vue') },
  { path: '/solaire', component: () => import('../components/MapView.vue') },
  { path: '/eolien-biomasse', component: () => import('../components/MapView.vue') },
  { path: '/vigueur-parcellaire', component: () => import('../components/MapView.vue') },
  { path: '/rendement', component: () => import('../components/MapView.vue') },
  { path: '/stress-azote', component: () => import('../components/MapView.vue') },
  { path: '/glissements-terrain', component: () => import('../components/MapView.vue') },
  { path: '/zones-inondables', component: () => import('../components/MapView.vue') },
  { path: '/zones-incendie-post', component: () => import('../components/MapView.vue') },
  { path: '/ilots-chaleur', component: () => import('../components/MapView.vue') },
  { path: '/envasement', component: () => import('../components/MapView.vue') },
  { path: '/servitudes', component: () => import('../components/MapView.vue') },
  { path: '/digues', component: () => import('../components/MapView.vue') },
  { path: '/plantations-interdites', component: () => import('../components/MapView.vue') },
  { path: '/clotures', component: () => import('../components/MapView.vue') },
  { path: '/occupation-illegale', component: () => import('../components/MapView.vue') },
  { path: '/evapotranspiration', component: () => import('../components/MapView.vue') },
  { path: '/canaux', component: () => import('../components/MapView.vue') },
  { path: '/reservoirs', component: () => import('../components/MapView.vue') },
  { path: '/maladies', component: () => import('../components/MapView.vue') },
  { path: '/fragmentation', component: () => import('../components/MapView.vue') },
  { path: '/croissance', component: () => import('../components/MapView.vue') },
  { path: '/sentiers', component: () => import('../components/MapView.vue') },
  { path: '/amenagements', component: () => import('../components/MapView.vue') },
  { path: '/paysages', component: () => import('../components/MapView.vue') },

  // { path: '/satellite', component: () => import('../components/SatelliteData.vue') },
  // { path: '/vegetation', component: () => import('../components/Vegetation.vue') },
  // { path: '/ai', component: () => import('../components/AIProcessing.vue') },
  // { path: '/visualization', component: () => import('../components/Visualization.vue') },
  // { path: '/export', component: () => import('../components/ExportIntegration.vue') }
]

export default createRouter({
  history: createWebHistory(),
  routes
})
