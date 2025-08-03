
export async function getCommune(nomCommune: string) {
  const url = `https://geo.api.gouv.fr/communes?nom=${encodeURIComponent(
    nomCommune
  )}&fields=nom,centre,bbox&format=json&geometry=centre`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erreur API: ${response.statusText}`);
    }

    const communes = await response.json();

    if (communes.length === 0) {
      console.log(`Aucune commune trouvée pour "${nomCommune}"`);
      return null;
    }

    // On prend la première commune trouvée
    const commune = communes[0];

    console.log(`Commune : ${commune.nom}`);
    console.log(`BBox : ${commune.bbox}`);
    return commune;
  } catch (error) {
    console.error("Erreur :", error);
    return null;
  }
}

