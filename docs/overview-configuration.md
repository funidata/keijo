# Overview Configuration

The overview layout is configured per browser. Its backup is stored in `localStorage` under the `overviewConfig` key and is restored when the application loads. Invalid or outdated stored data is discarded and replaced with the default configuration.

## Context API

`OverviewContextProvider` owns the configuration and persistence. Components inside the provider use `useOverviewConfig()`.

`updateOverviewConfig` accepts either a complete `GraphZoneConfig[]` replacement or a functional updater. Prefer a functional updater when the next value depends on the current configuration:

```ts
updateOverviewConfig((previousConfig) => nextConfig);
```

Every successful update is persisted automatically. Callers must not write `overviewConfig` to `localStorage` themselves.

`handleGraphVariantChange(variant, graphIndex, zoneIndex)` is provided for changing a graph's display variant.

## Drag Hooks

`useDraggableZones()` manages the drag state and reorder operation for overview zones. It is used by `Overview`.

`useDraggableGraphs(zoneIndex)` manages drag state and reordering for graphs in one zone. It is used by `Zone`; the zone index is supplied when the hook is created, so graph event handlers receive only the graph index.

Both hooks use `updateOverviewConfig` and therefore persist successful reorder operations automatically.
