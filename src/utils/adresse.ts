export async function getAdresse(lon: number, lat:number) {
  const url = `https://api-adresse.data.gouv.fr/reverse/?lon=${lon}&lat=${lat}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erreur API: ${response.statusText}`);
    }

    const geojson = await response.json();
    console.log(geojson);

    if (!geojson.features || geojson.features.length === 0) {
      console.log(`Aucune adresse trouvée`);
      return null;
    }

    // On prend la première commune
    const adresse = geojson.features[0];

    return adresse;
  } catch (error) {
    console.error("Erreur :", error);
    return null;
  }
}
