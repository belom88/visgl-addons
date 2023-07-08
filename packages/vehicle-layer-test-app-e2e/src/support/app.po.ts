export const button = () => cy.get('button');

export enum BaseMapsProviders {
  maplibre = 'MapLibre',
  mapbox2 = 'Mapbox 2',
  googleMaps = 'Google Maps',
  arcgis = 'ArcGIS',
}

export const getMaplibreButton = () =>
  button().contains(BaseMapsProviders.maplibre);
export const getMapbox2Button = () => button().contains(BaseMapsProviders.mapbox2);
export const getGoogleMapsButton = () =>
  button().contains(BaseMapsProviders.googleMaps);
export const getArcGisButton = () => button().contains(BaseMapsProviders.arcgis);

export const headerButtonShouldBeActive = (
  button: Cypress.Chainable<JQuery<HTMLButtonElement>>
) => button.should('have.css', 'border-bottom', '2px solid rgb(255, 255, 255)');
