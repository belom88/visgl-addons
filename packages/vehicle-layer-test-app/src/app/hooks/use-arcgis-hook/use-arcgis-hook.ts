import { loadArcGISModules } from '@deck.gl/arcgis';
import type { DeckRenderer } from '@deck.gl/arcgis';
import type SceneView from '@arcgis/core/views/SceneView';
import { useState, useEffect, MutableRefObject, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { selectMapState } from '../../redux/slices/map.slice';
import {
  getNewNotificationId,
  notificationsActions,
} from '../../redux/slices/notifications.slice';

type ArcgisRenderer = InstanceType<typeof DeckRenderer>;

// Match the SDK to the installed @arcgis/core version and RenderNode API.
const ARCGIS_URL = 'https://js.arcgis.com/4.34/';

export function useArcgis(
  mapContainer: MutableRefObject<null | HTMLDivElement>
): ArcgisRenderer | null {
  const [renderer, setRenderer] = useState<ArcgisRenderer | null>(null);
  const [sceneView, setSceneView] = useState<SceneView | null>(null);
  const mapState = useAppSelector(selectMapState);
  const latestMapState = useRef(mapState);
  latestMapState.current = mapState;
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!mapContainer.current) return;
    let cancelled = false;
    let view: SceneView | undefined;
    let deckRenderer: ArcgisRenderer | undefined;

    const initialize = async () => {
      const { DeckRenderer, modules } = await loadArcGISModules(
        ['esri/Map', 'esri/views/SceneView', 'esri/views/3d/webgl/RenderNode'],
        { url: ARCGIS_URL, css: true }
      );
      if (cancelled) return;
      const [ArcGISMap, SceneView] = modules as [
        typeof import('@arcgis/core/Map').default,
        typeof import('@arcgis/core/views/SceneView').default,
        unknown
      ];
      const { longitude, latitude, zoom } = latestMapState.current;
      view = new SceneView({
        container: mapContainer.current,
        map: new ArcGISMap({ basemap: 'dark-gray-vector' }),
        center: [longitude, latitude],
        // ArcGIS uses 256px tiles; deck.gl's zoom uses 512px tiles.
        scale: 591657550.5 / 2 ** (zoom + 1),
        environment: { atmosphereEnabled: false },
        qualityProfile: 'high',
        viewingMode: 'local',
      });
      await view.when();
      if (cancelled) return;
      // DeckRenderer registers its RenderNode with SceneView itself.
      const initializedRenderer = new DeckRenderer(view, {}) as ArcgisRenderer;
      deckRenderer = initializedRenderer;
      setSceneView(view);
      setRenderer(initializedRenderer);
    };

    initialize().catch((error: unknown) => {
      if (cancelled) return;
      deckRenderer?.dispose();
      view?.destroy();
      view = undefined;
      dispatch(
        notificationsActions.add({
          id: getNewNotificationId(),
          severity: 'error',
          message: `Unable to initialize ArcGIS: ${
            error instanceof Error ? error.message : String(error)
          }`,
        })
      );
    });

    return () => {
      cancelled = true;
      deckRenderer?.dispose();
      view?.destroy();
    };
  }, [mapContainer, dispatch]);

  const { longitude, latitude, zoom, bearing, pitch } = mapState;
  useEffect(() => {
    if (!sceneView) return;
    sceneView
      .goTo(
        {
          center: [longitude, latitude],
          scale: 591657550.5 / 2 ** (zoom + 1),
          heading: bearing,
          tilt: pitch,
        },
        { animate: false }
      )
      .catch((error: Error) => {
        // A new camera target or unmount can interrupt the previous goTo.
        if (error.name !== 'AbortError') console.error(error);
      });
  }, [sceneView, longitude, latitude, zoom, bearing, pitch]);

  return renderer;
}
