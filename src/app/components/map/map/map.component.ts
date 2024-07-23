import { Component, OnDestroy, OnInit } from '@angular/core';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import * as L from 'leaflet';
import { IpService } from '../../../services/ip.service';
import { Subscription } from 'rxjs';
import { icon, Icon, PointExpression } from 'leaflet';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [LeafletModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css',
})
export class MapComponent implements OnInit, OnDestroy {
  private customIcon!: Icon;
  zoom: number = 4;
  longitude: number = -98.5795;
  latitude: number = 39.8283;
  map!: L.Map; // Declare a map variable
  firstRun = true;
  marker: L.Marker | null = null; // Add this line to declare a marker variable

  subscription!: Subscription;

  constructor(private ipService: IpService) {
    const iconSize: PointExpression = [56, 46]; // adjust size as needed
    this.customIcon = icon({
      iconUrl: 'assets/custom-marker.svg',
      iconSize: iconSize,
      iconAnchor: [iconSize[0] / 2, iconSize[1]], // point of the icon which will correspond to marker's location
      popupAnchor: [0, -iconSize[1]], // point from which the popup should open relative to the iconAnchor
    });
  }

  private initMap(): void {
    this.map = L.map('maps-container', {
      center: [this.latitude, this.longitude],
      zoom: 4,
      dragging: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      touchZoom: false,
      boxZoom: false,
      zoomControl: false, // Add this line to remove zoom controls
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

        this.marker = L.marker([this.latitude, this.longitude], {
          icon: this.customIcon,
        }).addTo(this.map);
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
