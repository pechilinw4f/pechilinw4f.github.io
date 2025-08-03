
import type { BBox } from 'geojson'

export function getCogUrl(
    type: string,
    urls: Record<string, string>,
    bbox: BBox
): string | undefined {
    let cog_url: string | undefined;

    if (type === "True Color Image") {
        cog_url = `cog://${urls["TCI"]}#+${bbox}`;
    }
    else if (type === "NDVI") {
        // const colors = [
        //     "#0c0c0c", // NDVI < -0.5 (eau / sombre)
        //     "#eaeaea", // -0.5 < NDVI ≤ 0 (zones stériles)
        //     "#ccc682", // 0 < NDVI ≤ .1 (sol nu / faible végétation)
        //     "#91bf51", // .1 < NDVI ≤ .2
        //     "#70a33f", // .2 < NDVI ≤ .3
        //     "#4f892d", // .3 < NDVI ≤ .4
        //     "#306d1c", // .4 < NDVI ≤ .5
        //     "#0f540a", // .5 < NDVI ≤ .6
        //     "#004400"  // .6 < NDVI ≤ 1.0 (forêts denses)
        // ];

        const colors = [
            "#70a33f",
            "#004400"    // Vert foncé NDVI ≥ .6 (forêts denses)
        ];

        const min = 0.6;  // borne inférieure NDVI
        const max = 1.0;   // borne supérieure NDVI
        const modifiers = "-c"; // 'c' pour dégradé continu
        const computation = `[${colors.map(c => `"${c}"`).join(",")}],${min},${max}${modifiers}`;

        cog_url = `cog://${urls["NIR"]}|${urls["RED"]}#color:${computation}+${bbox}`;
    }
    else if (type === "NDMI") {
        const colors = [
            "#800000",
            "#ff0000",
            "#ffff00",
            "#00ffff",
            "#0000ff",
            "#000080"
        ];
        const min = -0.8;
        const max = 0.8;
        const modifiers = "-c";
        const computation = `[${colors.map(c => `"${c}"`).join(",")}],${min},${max}${modifiers}`;

        cog_url = `cog://${urls["NIR"]}|${urls["SWIR16"]}#color:${computation}+${bbox}`;
    }
    else if (type === "NDWI") {
        const colors = [
            "#008000", // végétation
            "#FFFFFF", // transition
            "#0000CC"  // eau
        ];
        const min = -0.8;
        const max = 0.8;
        const modifiers = "-c";
        const computation = `[${colors.map(c => `"${c}"`).join(",")}],${min},${max}${modifiers}`;

        cog_url = `cog://${urls["GREEN"]}|${urls["NIR"]}#color:${computation}+${bbox}`;
    }
    else if (type === "UI") {
        const colors = [
            "#f7f7f7",
            "#d9d9d9",
            "#bdbdbd",
            "#969696",
            "#737373",
            "#525252",
            "#252525"
        ];
        const min = -1.0;
        const max = 1.0;
        const modifiers = "-c";
        const computation = `[${colors.map(c => `"${c}"`).join(",")}],${min},${max}${modifiers}`;

        cog_url = `cog://${urls["SWIR16"]}|${urls["NIR"]}#color:${computation}+${bbox}`;
    }

    return cog_url;
}

