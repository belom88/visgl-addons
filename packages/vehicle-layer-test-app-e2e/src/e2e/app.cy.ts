import {
  getArcGisButton,
  getGoogleMapsButton,
  getMapbox2Button,
  getMaplibreButton,
  headerButtonShouldBeActive,
} from '../support/app.po';

describe('vehicle-layer-test-app', () => {
  beforeEach(() => cy.visit('/'));

  it('Should redirect on "MapLibre" page by default', () => {
    const button = getMaplibreButton();
    headerButtonShouldBeActive(button);
    cy.location().should((location) => {
      expect(location.pathname).to.eq('/base-map/maplibre');
    });
  });

  describe('Clicking header buttons', () => {
    it('Should go to "MapBox 2"', () => {
      const button = getMapbox2Button();
      button.click();
      headerButtonShouldBeActive(button);
      cy.location().should((location) => {
        expect(location.pathname).to.eq('/base-map/mapbox2');
      });
    });

    it('Should go to "Google Maps"', () => {
      const button = getGoogleMapsButton();
      button.click();
      headerButtonShouldBeActive(button);
      cy.location().should((location) => {
        expect(location.pathname).to.eq('/base-map/google-maps');
      });
    });

    it('Should go to "ArcGIS"', () => {
      const button = getArcGisButton();
      button.click();
      headerButtonShouldBeActive(button);
      cy.location().should((location) => {
        expect(location.pathname).to.eq('/base-map/arcgis');
      });
    });

    it('Should go back to "MapLibre"', () => {
      const arcgisButton = getArcGisButton();
      arcgisButton.click();
      const maplibreButton = getMaplibreButton();
      maplibreButton.click();
      headerButtonShouldBeActive(maplibreButton);
      cy.location().should((location) => {
        expect(location.pathname).to.eq('/base-map/maplibre');
      });
    });
  });
});
