import { AfterViewInit, Component} from '@angular/core';
import 'leaflet/dist/images/marker-shadow.png';
import { MapService, Icoord } from 'src/app/services/map.service';
import * as L from 'leaflet';

@Component({
  selector: 'app-leaflet',
  templateUrl: './leaflet.component.html',
  styleUrls: ['./leaflet.component.scss']
})
export class LeafletComponent implements AfterViewInit {
  map;

  locations: Icoord[] = [];

  // smallIcon = new L.Icon({
  //   iconUrl: 'https://leafletjs.com/examples/custom-icons/marker-icon.png',
  //   shadowUrl: 'https://leafletjs.com/examples/custom-icons/marker-shadow.png',
  //   iconSize:    [10, 10],
  //   iconAnchor:  [10, 10],
  //   popupAnchor: [1, -34],
  //   shadowSize:  [10, 10]
  // });

  constructor(private mapService: MapService) { }

  ngAfterViewInit(): void {
    this.createMap();
    window.dispatchEvent(new Event('resize'));
  }

  createMap() {
    const centreVilleTunis = {
      lat: 36.8003753,
      lng: 10.1863143
    };

    const zoomLevel = 10;

    this.map = L.map('map', {
      center: [centreVilleTunis.lat, centreVilleTunis.lng],
      zoom: zoomLevel
    });

    const mainLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      minZoom: 8,
      maxZoom: 17,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    mainLayer.addTo(this.map);

    // this.mapService.getCoords().subscribe(
    //   (res) => {
    //     res.forEach((location) => {
    //       this.addMarker(location);
    //     });
    //   },
    //   (err) => {
    //     console.log(err);
    //   }
    // );
  }

  // { icon: this.smallIcon }
  addMarker(location) {
    const marker = L.marker([location.meterLat, location.meterLng]);
    marker.addTo(this.map);
    // marker.addTo(this.map).bindPopup(location.dcNumber);
  }

}
