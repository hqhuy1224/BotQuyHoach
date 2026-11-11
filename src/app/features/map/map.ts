
import { Component, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import type { Map as MapLibreMap } from 'maplibre-gl';

@Component({
  selector: 'app-map',
  standalone: true,
  templateUrl: './map.html',
  styleUrl: './map.scss'
})
export class MapComponent implements AfterViewInit, OnDestroy {

  mapTitle = 'Bản đồ đường phố';

  @ViewChild('map', { static: true })
  mapElement!: ElementRef<HTMLDivElement>;

  map!: MapLibreMap;

  private readonly initialCenter: [number, number] = [106.6881, 20.8449];
  private readonly initialZoom = 12;

  private destroyed = false;

  async ngAfterViewInit(): Promise<void> {
    const { Map: MapLibreMap, NavigationControl, ScaleControl, FullscreenControl } = await import('maplibre-gl');
    if (this.destroyed) return;

    this.map = new MapLibreMap({
      container: this.mapElement.nativeElement,
      style: {
        version: 8,
        sources: {
          'openstreetmap': {
            type: 'raster',
            tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
            maxzoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }
        },
        layers: [{ id: 'streets', type: 'raster', source: 'openstreetmap' }]
      },
      center: this.initialCenter,
      zoom: this.initialZoom,
     // attributionControl: true
    });

    this.map.addControl(new NavigationControl(), 'top-right');
    this.map.addControl(new ScaleControl(), 'bottom-left');
    this.map.addControl(new FullscreenControl(), 'top-right');

    this.map.on('load', () => {
      console.log('MapLibre đã tải bản đồ thành công!');
    });

    this.map.on('error', (event) => {
      console.error('MapLibre error:', event.error);
    });
  }

  zoomIn(): void {
    this.map?.zoomIn();
  }

  zoomOut(): void {
    this.map?.zoomOut();
  }

  resetMap(): void {
    this.map?.flyTo({
      center: this.initialCenter,
      zoom: this.initialZoom,
      essential: true
    });
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.map?.remove();
  }
}
