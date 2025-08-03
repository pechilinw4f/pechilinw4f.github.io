export const topos = [
    { minZoom: 7, maxZoom: 11, type: 'BDTOPO_V3:aerodrome', fill: '#1F77B422', line: '#1F77B4', show: false }, // Bleu
    { minZoom: 7, maxZoom: 11, type: 'BDTOPO_V3:arrondissement', fill: '#FF573322', line: '#FF5733', show: false }, // Rouge-orangé
    { minZoom: 7, maxZoom: 11, type: 'BDTOPO_V3:arrondissement_municipal', fill: '#2ECC4022', line: '#2ECC40', show: false }, // Vert
    // { minZoom: 8, type: 'BDTOPO_V3:bassin_versant_topographique', fill: '#9B59B622', line: '#9B59B6', show: false }, // Violet (peu utile)

    { minZoom: 15,maxZoom: 20,  type: 'BDTOPO_V3:batiment', fill: '#F1C40F22', line: '#F1C40F', show: false }, // Jaune
    // { minZoom: 14, type: 'BDTOPO_V3:canalisation', fill: '#E67E2222', line: '#E67E22', show: false }, // Orange (peu utile)
    { minZoom: 13, maxZoom: 15, type: 'BDTOPO_V3:cimetiere', fill: '#00BCD422', line: '#00BCD4', show: false }, // Cyan

    { minZoom: 8, maxZoom: 12, type: 'BDTOPO_V3:collectivite_territoriale', fill: '#007BFF22', line: '#007BFF', show: false }, // Bleu vif
    // { minZoom: 15, type: 'BDTOPO_V3:condominium', fill: '#8E44AD22', line: '#8E44AD', show: false }, // Violet foncé (rare)

    { minZoom: 7, maxZoom: 11, type: 'BDTOPO_V3:commune', fill: '#16A08522', line: '#16A085', show: false }, // Vert-bleu
    { minZoom: 7, maxZoom: 11, type: 'BDTOPO_V3:commune_associee_ou_deleguee', fill: '#D3540022', line: '#D35400', show: false }, // Brun-orangé

    // { minZoom: 15, type: 'BDTOPO_V3:construction_lineaire', fill: '#C0392B22', line: '#C0392B', show: false }, // Rouge brique (détail superflu)
    // { minZoom: 15, type: 'BDTOPO_V3:construction_ponctuelle', fill: '#2980B922', line: '#2980B9', show: false }, // Bleu océan (rare)
    { minZoom: 15, maxZoom: 20, type: 'BDTOPO_V3:construction_surfacique', fill: '#27AE6022', line: '#27AE60', show: false }, // Vert forêt

    { minZoom: 12, maxZoom: 16, type: 'BDTOPO_V3:cours_d_eau', fill: '#3498DB22', line: '#3498DB', show: false }, // Bleu rivière
    { minZoom: 6, maxZoom: 10, type: 'BDTOPO_V3:departement', fill: '#F39C1222', line: '#F39C12', show: false }, // Orange clair

    { minZoom: 13, maxZoom: 17, type: 'BDTOPO_V3:detail_hydrographique', fill: '#5DADE222', line: '#5DADE2', show: false }, // Bleu clair
    // { minZoom: 12, type: 'BDTOPO_V3:detail_orographique', fill: '#7D3C9822', line: '#7D3C98', show: false }, // Violet montagne (rare)

    { minZoom: 8, maxZoom: 12, type: 'BDTOPO_V3:epci', fill: '#2E405322', line: '#2E4053', show: false }, // Gris anthracite
    { minZoom: 12, maxZoom: 16, type: 'BDTOPO_V3:equipement_de_transport', fill: '#A9322622', line: '#A93226', show: false }, // Rouge sombre
    { minZoom: 14, maxZoom: 18, type: 'BDTOPO_V3:erp', fill: '#11786422', line: '#117864', show: false }, // Vert foncé

    { minZoom: 10, maxZoom: 14, type: 'BDTOPO_V3:foret_publique', fill: '#145A3222', line: '#145A32', show: false }, // Vert forêt dense
    // { minZoom: 15, type: 'BDTOPO_V3:haie', fill: '#239B5622', line: '#239B56', show: false }, // Vert clair (très fin)

    // { minZoom: 10, type: 'BDTOPO_V3:itineraire_autre', fill: '#D6891022', line: '#D68910', show: false }, // Jaune foncé (rarement utile)
    { minZoom: 11, maxZoom: 15, type: 'BDTOPO_V3:lieu_dit_non_habite', fill: '#6C348322', line: '#6C3483', show: false }, // Violet foncé

    { minZoom: 12, maxZoom: 16, type: 'BDTOPO_V3:ligne_electrique', fill: '#F7DC6F22', line: '#F7DC6F', show: false }, // Jaune pâle
    { minZoom: 12, maxZoom: 16, type: 'BDTOPO_V3:ligne_orographique', fill: '#AAB7B822', line: '#AAB7B8', show: false }, // Gris clair
    { minZoom: 8, maxZoom: 12, type: 'BDTOPO_V3:limite_terre_mer', fill: '#5D6D7E22', line: '#5D6D7E', show: false }, // Gris bleuté

    // { minZoom: 14, type: 'BDTOPO_V3:noeud_hydrographique', fill: '#48C9B022', line: '#48C9B0', show: false }, // Vert eau (rare)
    // { minZoom: 7, type: 'BDTOPO_V3:non_communication', fill: '#E74C3C22', line: '#E74C3C', show: false }, // Rouge alerte (peu utile)

    { minZoom: 9, maxZoom: 20, type: 'BDTOPO_V3:parc_ou_reserve', fill: '#58D68D22', line: '#58D68D', show: false }, // Vert clair
    { minZoom: 7, maxZoom: 20, type: 'BDTOPO_V3:piste_d_aerodrome', fill: '#34495E22', line: '#34495E', show: false }, // Gris foncé
    { minZoom: 11, maxZoom: 20, type: 'BDTOPO_V3:plan_d_eau', fill: '#1ABC9C22', line: '#1ABC9C', show: false }, // Turquoise

    // { minZoom: 14, type: 'BDTOPO_V3:point_de_repere', fill: '#F1948A22', line: '#F1948A', show: false }, // Rose (trop ponctuel)
    // { minZoom: 14, type: 'BDTOPO_V3:point_du_reseau', fill: '#7FB3D522', line: '#7FB3D5', show: false }, // Bleu pastel (rare)
    // { minZoom: 14, type: 'BDTOPO_V3:poste_de_transformation', fill: '#C39BD322', line: '#C39BD3', show: false }, // Violet clair
    // { minZoom: 14, type: 'BDTOPO_V3:pylone', fill: '#AF7AC522', line: '#AF7AC5', show: false }, // Violet rosé

    { minZoom: 5, maxZoom: 20, type: 'BDTOPO_V3:region', fill: '#DC763322', line: '#DC7633', show: false }, // Orange brun
    { minZoom: 12, maxZoom: 20, type: 'BDTOPO_V3:reservoir', fill: '#2874A622', line: '#2874A6', show: false }, // Bleu pétrole

    { minZoom: 11, maxZoom: 20, type: 'BDTOPO_V3:route_numerotee_ou_nommee', fill: '#CA6F1E22', line: '#CA6F1E', show: false }, // Orange route
    // { minZoom: 14, type: 'BDTOPO_V3:section_de_points_de_repere', fill: '#F5B7B122', line: '#F5B7B1', show: false }, // Rose clair (inutile)

    { minZoom: 11, maxZoom: 20, type: 'BDTOPO_V3:surface_hydrographique', fill: '#5DADE222', line: '#5DADE2', show: false }, // Bleu clair
    { minZoom: 13, maxZoom: 20, type: 'BDTOPO_V3:terrain_de_sport', fill: '#22995422', line: '#229954', show: false }, // Vert pelouse

    // { minZoom: 14, type: 'BDTOPO_V3:toponymie_bati', fill: '#884EA022', line: '#884EA0', show: false }, // Violet urbain
    // { minZoom: 14, type: 'BDTOPO_V3:toponymie_hydrographie', fill: '#2E86C122', line: '#2E86C1', show: false }, // Bleu moyen
    // { minZoom: 14, type: 'BDTOPO_V3:toponymie_lieux_nommes', fill: '#AF601A22', line: '#AF601A', show: false }, // Marron clair
    // { minZoom: 14, type: 'BDTOPO_V3:toponymie_services_et_activites', fill: '#B03A2E22', line: '#B03A2E', show: false }, // Rouge brun
    // { minZoom: 14, type: 'BDTOPO_V3:toponymie_transport', fill: '#1B4F7222', line: '#1B4F72', show: false }, // Bleu foncé
    // { minZoom: 14, type: 'BDTOPO_V3:toponymie_zones_reglementees', fill: '#A0400022', line: '#A04000', show: false }, // Marron foncé

    // { minZoom: 13, type: 'BDTOPO_V3:transport_par_cable', fill: '#78421222', line: '#784212', show: false }, // Brun câble (rare)
    { minZoom: 12, maxZoom: 20, type: 'BDTOPO_V3:troncon_de_route', fill: '#BA4A0022', line: '#BA4A00', show: false }, // Orange rouge
    { minZoom: 12, maxZoom: 20, type: 'BDTOPO_V3:troncon_de_voie_ferree', fill: '#5B2C6F22', line: '#5B2C6F', show: false }, // Violet sombre
    { minZoom: 12, maxZoom: 20, type: 'BDTOPO_V3:troncon_hydrographique', fill: '#1A527622', line: '#1A5276', show: false }, // Bleu sombre

    { minZoom: 12, maxZoom: 20, type: 'BDTOPO_V3:voie_ferree_nommee', fill: '#56657322', line: '#566573', show: false }, // Gris acier
    { minZoom: 13, maxZoom: 20, type: 'BDTOPO_V3:voie_nommee', fill: '#7D660822', line: '#7D6608', show: false }, // Jaune brun

    { minZoom: 11, maxZoom: 20, type: 'BDTOPO_V3:zone_d_activite_ou_d_interet', fill: '#6E2C0022', line: '#6E2C00', show: false }, // Brun
    { minZoom: 8, maxZoom: 20, type: 'BDTOPO_V3:zone_d_estran', fill: '#85C1E922', line: '#85C1E9', show: false }, // Bleu littoral
    { minZoom: 11, maxZoom: 20, type: 'BDTOPO_V3:zone_d_habitation', fill: '#CD615522', line: '#CD6155', show: false }, // Rouge rose
    { minZoom: 10, maxZoom: 20, type: 'BDTOPO_V3:zone_de_vegetation', fill: '#52BE8022', line: '#52BE80', show: false }, // Vert végétation
];
