import ArcGISMap from '@arcgis/core/Map';
import SceneView from '@arcgis/core/views/SceneView';
import { loadArcGISModules } from '@deck.gl/arcgis';
import * as externalRenderers from '@arcgis/core/views/3d/externalRenderers';
import { useState, useEffect, MutableRefObject, useRef } from 'react';
import { useAppSelector } from '../../redux/hooks';
import { selectMapState } from '../../redux/slices/map.slice';

export function useArcgisHook(
  mapContainer: MutableRefObject<null | HTMLDivElement>,
  ...args: unknown[]
): unknown | null {
  const [renderer, setRenderer] = useState<unknown>(null);
  const [sceneView, setSceneView] = useState<SceneView | null>(null);
  const { longitude, latitude, pitch, bearing } =
    useAppSelector(selectMapState);
  const isLoadingRef = useRef<boolean>(false);

  useEffect(() => {
    if (mapContainer.current == null) {
      return;
    }

    if (sceneView || isLoadingRef.current) {
      return;
    }
    isLoadingRef.current = true;
    setSceneView(
      new SceneView({
        container: mapContainer.current,
        map: new ArcGISMap({
          basemap: 'dark-gray-vector',
        }),
        environment: {
          atmosphereEnabled: false,
        },
        qualityProfile: 'high',
        camera: {
          position: { x: longitude, y: latitude, z: 100 },
          heading: bearing,
          tilt: 0,
        },
        viewingMode: 'local',
      })
    );
  }, [sceneView, bearing, pitch, longitude, latitude, mapContainer]);

  useEffect(() => {
    if (!sceneView) {
      return;
    }
    let deckRenderer: unknown;
    loadArcGISModules([
      'esri/Map',
      'esri/views/SceneView',
      'esri/views/3d/externalRenderers',
    ]).then(({ DeckRenderer }) => {
      deckRenderer = new DeckRenderer(sceneView, {});
      setRenderer(deckRenderer);
      // @ts-expect-error cannot import type from ArcGIS API
      externalRenderers.add(sceneView, deckRenderer);
    });
  }, [sceneView]);

  return renderer;
}

export default useArcgisHook;
