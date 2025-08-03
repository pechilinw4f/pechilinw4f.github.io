// type Commune = {
//   id: string; // ex: "code:75056"
//   bounds: [number, number, number, number]; // [xMin, yMin, xMax, yMax]
// };

const url = 'https://unpkg.com/@etalab/fr-bounding-boxes@latest/dist/communes.json';

export async function getCommunesInBbox(bounds: [number, number, number, number]): Promise<string[]> {
    const [minLon, minLat, maxLon, maxLat] = bounds;

    const res = await fetch(url);
    const data = await res.json();

    const codes: string[] = [];

    for (const commune of data) {
        if (!Array.isArray(commune.bbox) || commune.bbox.length !== 4) continue;

        const [xMin, yMin, xMax, yMax] = commune.bbox;

        if (
            xMax >= minLon &&
            xMin <= maxLon &&
            yMax >= minLat &&
            yMin <= maxLat
        ) {
            codes.push(commune.id.split(':')[2]);
        }
    }
    
    console.log('Codes INSEE dans la bounding box :', codes);
    return codes;
}

// Exemple d'appel
// const bboxParis: [number, number, number, number] = [2.2242, 48.8156, 2.4699, 48.9022];
// getCommunesInBbox(bboxParis);
