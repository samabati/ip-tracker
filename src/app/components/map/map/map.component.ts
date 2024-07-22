import { Component, OnDestroy, OnInit } from '@angular/core';
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
  longitude: number = 37.0902;
  latitude: number = -95.7129;

  subscription!: Subscription;

  options = {
    layers: [
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }),
    ],
    zoom: this.zoom,
    center: L.latLng([this.longitude, this.latitude]),
  };

  constructor(private ipService: IpService) {}

  ngOnInit(): void {
    this.subscription = this.ipService.ipInfoSubject.subscribe((value) => {
      this.zoom = 15;
      this.longitude = value.location.lgn;
      this.latitude = value.location.lat;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
