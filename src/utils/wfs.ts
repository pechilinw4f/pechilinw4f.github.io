import type { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';

export async function fetchWfs(url: string, type: string, bbox: string, propertyname?: string) {
    const urlBase = new URL(url);
    urlBase.searchParams.set('SERVICE', 'WFS');
    urlBase.searchParams.set('VERSION', '2.0.0');
    urlBase.searchParams.set('REQUEST', 'GetFeature');
    urlBase.searchParams.set('OUTPUTFORMAT', 'application/json');
    urlBase.searchParams.set('TYPENAMES', type);
    if (propertyname){
    urlBase.searchParams.set('PROPERTYNAME', propertyname);
    }
    urlBase.searchParams.set('SRSNAME', 'EPSG:4326');

    urlBase.searchParams.set('BBOX', `${bbox},EPSG:4326`);

    const pageSize = 1000; // Nombre de features par page
    let startIndex = 0;
    let allFeatures: any[] = [];
    let hasMore = true;

    while (hasMore) {
        // Construire l'URL pour cette page
        const url = new URL(urlBase.toString());
        url.searchParams.set('count', pageSize.toString());
        url.searchParams.set('startIndex', startIndex.toString());

        // Appeler le WFS
        const response = await fetch(url.toString());
        const geojson = await response.json();

        if (geojson.features && geojson.features.length > 0) {
            allFeatures = allFeatures.concat(geojson.features);
            startIndex += pageSize;
            if (geojson.features.length < pageSize) {
                hasMore = false;
            }
        } else {
            hasMore = false;
        }
    }
    const features = {
        type: "FeatureCollection",
        features: allFeatures
    } as FeatureCollection<Geometry, GeoJsonProperties>;
    return features;
}