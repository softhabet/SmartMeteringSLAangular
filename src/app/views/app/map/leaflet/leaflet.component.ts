import { AfterViewInit, Component} from '@angular/core';
import { MapService, Icoord } from 'src/app/services/map.service';
import 'leaflet/dist/images/marker-shadow.png';
import * as L from 'leaflet';

@Component({
  selector: 'app-leaflet',
  templateUrl: './leaflet.component.html',
  styleUrls: ['./leaflet.component.scss']
})
export class LeafletComponent implements AfterViewInit {
  map;

  locations: Icoord[] = [];
  renderer: any;

  // smallIcon = new L.Icon({
  //   iconUrl: 'https://leafletjs.com/examples/custom-icons/marker-icon.png',
  //   shadowUrl: 'https://leafletjs.com/examples/custom-icons/marker-shadow.png',
  //   iconSize:    [10, 10],
  //   iconAnchor:  [10, 10],
  //   popupAnchor: [1, -34],
  //   shadowSize:  [10, 10]
  // });

  customMarker = new L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.4.0/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [10, 41],
    popupAnchor: [2, -40]
  });

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

    this.renderer = L.canvas({ padding: 0.5 });

    const mainLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      minZoom: 8,
      maxZoom: 17,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    mainLayer.addTo(this.map);

    this.mapService.getCoords().subscribe(
      (res) => {
        res.forEach((location) => {
          this.addMarker(location);
        });
      },
      (err) => {
        console.log(err);
      }
    );

    // this.mapService.getGeo().subscribe(
    //   (res) => {
    //     // L.geoJSON(res.geometry).addTo(this.map);
    //     console.log(res);
    //     L.geoJSON(res.geometry, {
    //       pointToLayer: (feature, lnglat) => {
    //         return L.marker(lnglat, { icon: this.customMarker });
    //       }
    //     });
    //     // console.log(res);
    //   },
    //   (err) => {
    //     console.log(err);
    //   }
    // );
  }

  // { icon: this.smallIcon }
  addMarker(location) {
    const marker = L.circleMarker([location.meterLat, location.meterLng], { renderer: this.renderer });
    marker.addTo(this.map);
    // marker.addTo(this.map).bindPopup(location.dcNumber);
  }

}
