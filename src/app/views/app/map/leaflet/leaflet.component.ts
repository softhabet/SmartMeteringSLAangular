import { AfterViewInit, Component} from '@angular/core';
import { MapService, Icoord } from 'src/app/services/map.service';
// import 'leaflet/dist/images/marker-shadow.png';
import * as L from 'leaflet';
import { Map, MapOptions, MarkerClusterGroup, MarkerClusterGroupOptions } from 'leaflet';
import 'leaflet.markercluster';
import { NgxSpinnerService } from 'ngx-bootstrap-spinner';

@Component({
  selector: 'app-leaflet',
  templateUrl: './leaflet.component.html',
  styleUrls: ['./leaflet.component.scss']
})
export class LeafletComponent implements AfterViewInit {
  map;

  checkModel: any = { left: false, middle: false, right: false };
  uncheckableRadioModelType = '';
  uncheckableRadioModelComm = '';

  filters: string[] = [];

  locations: Icoord[] = [];
  renderer: any;
  markerClusterData = [];

  customMarker = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.4.0/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [10, 41],
    popupAnchor: [2, -40]
  });
  markers: any;

  constructor(private mapService: MapService, private spinner: NgxSpinnerService) { }

  ngAfterViewInit(): void {
    this.createMap();
    window.dispatchEvent(new Event('resize'));
    this.spinner.show();
    this.mapService.getCoords().subscribe(
      (res) => {
        res.forEach((location) => {
          this.addMarker(location, 'white');
        });
        this.map.addLayer(this.markers);
        this.spinner.hide();
      },
      (err) => {
        console.log(err);
        this.spinner.hide();
      }
    );
  }

  createMap() {
    this.markers = L.markerClusterGroup();

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
  addMarker(location, markerColor) {
    const marker = L.circleMarker([location.meterLat, location.meterLng], { renderer: this.renderer });
    marker.setStyle({color: markerColor});
    // marker.addTo(this.map);
    this.markers.addLayer(marker);
    // marker.addTo(this.map).bindPopup(location.dcNumber);
  }

  loadFilteredMeters(filters: string[]) {
    this.markers.clearLayers();
    this.spinner.show();
    this.mapService.getFilteredCoords(filters).subscribe(
      (res) => {
        res.forEach((location) => {
          this.addMarker(location, 'green');
        });
        this.spinner.hide();
      },
      (err) => {
        console.log(err);
        this.spinner.hide();
      }
    );
  }

  addToFilters(filter: string) {
    if (this.filters.includes(filter)) {
      this.filters.splice(this.filters.indexOf(filter), 1);
    } else {
      if (filter === 'ELECTRICITY' || filter === 'GAZ' || filter === 'WATER') {
        this.filters = this.filters.filter(e => !['ELECTRICITY', 'GAZ', 'WATER'].includes(e));
        this.filters.push(filter);
      } else if (filter === 'P2P' || filter === 'PLC') {
        this.filters = this.filters.filter(e => !['P2P', 'PLC'].includes(e));
        this.filters.push(filter);
      }
    }
    console.log(this.filters);
    this.loadFilteredMeters(this.filters);
  }

}
