import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  trips: { from: string; to: string }[] = [];

  onAddTrip(trip: { from: string; to: string }) {
    this.trips.push(trip);
  }

  onClearTrips() {
    this.trips = [];
  }

  onTripsChange(trips: { from: string; to: string }[]) {
    this.trips = trips;
  }

  onInitializeSampleData() {
    // This will be handled by the trip-visualizer component
  }
}
