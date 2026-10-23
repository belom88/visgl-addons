import { act, render, renderHook, waitFor } from '@testing-library/react';
import { createRef } from 'react';
import { loadArcGISModules } from '@deck.gl/arcgis';
import { useArcgis } from './use-arcgis-hook';
import { createStoreWith, createWrapper } from '../../utils/test-utils';
import { mapActions } from '../../redux/slices/map.slice';
import { selectAllNotifications } from '../../redux/slices/notifications.slice';

vi.mock('@deck.gl/arcgis', () => ({ loadArcGISModules: vi.fn() }));
vi.mock('react-map-gl/maplibre', () => ({ Map: vi.fn(), Source: vi.fn() }));

const mockLoad = vi.mocked(loadArcGISModules);

function setup() {
  const view = {
    when: vi.fn().mockResolvedValue(undefined),
    goTo: vi.fn().mockResolvedValue(undefined),
    destroy: vi.fn(),
  };
  const renderer = { deck: { set: vi.fn() }, dispose: vi.fn() };
  const SceneView = vi.fn(function () {
    return view;
  });
  const ArcGISMap = vi.fn();
  const DeckRenderer = vi.fn(function () {
    return renderer;
  });
  const loaded = {
    DeckLayer: vi.fn(),
    DeckRenderer,
    modules: [ArcGISMap, SceneView, vi.fn()],
  };
  mockLoad.mockResolvedValue(loaded);
  const ref = createRef<HTMLDivElement>();
  render(<div ref={ref} />);
  const store = createStoreWith({});
  return { ref, store, view, renderer, SceneView, DeckRenderer, loaded };
}

beforeEach(() => vi.resetAllMocks());

describe('useArcgis', () => {
  it('loads the pinned SDK and creates a local RenderNode renderer', async () => {
    const state = setup();
    const hook = renderHook(() => useArcgis(state.ref), {
      wrapper: createWrapper(state.store),
    });
    await waitFor(() => expect(hook.result.current).toBe(state.renderer));
    expect(mockLoad).toHaveBeenCalledWith(
      ['esri/Map', 'esri/views/SceneView', 'esri/views/3d/webgl/RenderNode'],
      { url: 'https://js.arcgis.com/4.34/', css: true }
    );
    expect(state.SceneView).toHaveBeenCalledWith(
      expect.objectContaining({
        viewingMode: 'local',
        container: state.ref.current,
      })
    );
    expect(state.DeckRenderer).toHaveBeenCalledWith(state.view, {});
    act(() => {
      state.store.dispatch(
        mapActions.setMapState({
          longitude: 12,
          latitude: 47,
          zoom: 15,
          bearing: 30,
          pitch: 40,
        })
      );
    });
    await waitFor(() =>
      expect(state.view.goTo).toHaveBeenLastCalledWith(
        {
          center: [12, 47],
          scale: 591657550.5 / 2 ** 16,
          heading: 30,
          tilt: 40,
        },
        { animate: false }
      )
    );
    hook.unmount();
    expect(state.renderer.dispose).toHaveBeenCalledOnce();
    expect(state.view.destroy).toHaveBeenCalledOnce();
  });

  it('does not create a scene when unmounted while modules are loading', async () => {
    const state = setup();
    let resolve!: (value: typeof state.loaded) => void;
    mockLoad.mockReturnValueOnce(
      new Promise((r) => {
        resolve = r;
      })
    );
    const hook = renderHook(() => useArcgis(state.ref), {
      wrapper: createWrapper(state.store),
    });
    hook.unmount();
    await act(async () => {
      resolve(state.loaded);
    });
    expect(state.SceneView).not.toHaveBeenCalled();
    expect(state.DeckRenderer).not.toHaveBeenCalled();
  });

  it('destroys a pending scene without attaching a renderer after unmount', async () => {
    const state = setup();
    let resolve!: () => void;
    state.view.when.mockReturnValueOnce(
      new Promise<void>((r) => {
        resolve = r;
      })
    );
    const hook = renderHook(() => useArcgis(state.ref), {
      wrapper: createWrapper(state.store),
    });
    await waitFor(() => expect(state.view.when).toHaveBeenCalled());
    hook.unmount();
    await act(async () => {
      resolve();
    });
    expect(state.view.destroy).toHaveBeenCalledOnce();
    expect(state.DeckRenderer).not.toHaveBeenCalled();
  });

  it('reports SDK loading failures through notifications', async () => {
    const state = setup();
    mockLoad.mockRejectedValueOnce(new Error('SDK unavailable'));
    const hook = renderHook(() => useArcgis(state.ref), {
      wrapper: createWrapper(state.store),
    });
    await waitFor(() =>
      expect(selectAllNotifications(state.store.getState())).toEqual([
        expect.objectContaining({
          severity: 'error',
          message: 'Unable to initialize ArcGIS: SDK unavailable',
        }),
      ])
    );
    expect(hook.result.current).toBeNull();
    hook.unmount();
  });
});
