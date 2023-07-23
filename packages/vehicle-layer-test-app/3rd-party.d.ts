declare module '@deck.gl/arcgis' {
  export function loadArcGISModules(modules?: string[]): Promise<{
    DeckRenderer: import('@arcgis/core/interfaces').ExternalRenderer.ctor;
    modules: unknown[];
  }>;
}
