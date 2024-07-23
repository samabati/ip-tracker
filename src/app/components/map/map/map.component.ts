import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import * as L from 'leaflet';
import { IpService } from '../../../services/ip.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [LeafletModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css',
})
export class MapComponent implements OnInit, OnDestroy {
  zoom: number = 4;
  longitude: number = -98.5795;
  latitude: number = 39.8283;
  map!: L.Map; // Declare a map variable
  firstRun = true;
  marker: L.Marker | null = null; // Add this line to declare a marker variable

  subscription!: Subscription;

  constructor(private ipService: IpService) {}

  private initMap(): void {
    this.map = L.map('maps-container', {
      center: [this.latitude, this.longitude],
      zoom: 4,
    });

    const tiles = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 18,
        minZoom: 4,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }
    );

    tiles.addTo(this.map);
  }

  ngOnInit(): void {
    this.initMap();
    this.subscription = this.ipService.ipInfoSubject.subscribe((value) => {
      if (!this.firstRun) {
        this.zoom = 13;
        this.longitude = value.location.lng;
        this.latitude = value.location.lat;
        console.log(this.longitude, this.latitude);
        if (this.marker) {
          this.map.removeLayer(this.marker);
        }

        this.marker = L.marker([this.latitude, this.longitude]).addTo(this.map);
        this.map.setView(this.marker.getLatLng(), this.zoom);
      } else {
        this.firstRun = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
