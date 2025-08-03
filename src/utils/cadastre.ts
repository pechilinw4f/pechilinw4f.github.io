export async function getCadastre(codeCommune: string, type:string) {
  const url = `https://cadastre.data.gouv.fr/bundler/cadastre-etalab/communes/${codeCommune}/geojson/${type}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erreur API: ${response.statusText}`);
    }

    const geojson = await response.json();

    if (!geojson.features || geojson.features.length === 0) {
      console.log(`Aucune commune trouvée pour "${codeCommune}"`);
      return null;
    }

    // On prend la première commune
    const commune = geojson.features[0];

    return commune;
  } catch (error) {
    console.error("Erreur :", error);
    return null;
  }
}
