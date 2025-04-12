import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-trip-visualizer',
  templateUrl: './trip-visualizer.component.html',
  styleUrls: ['./trip-visualizer.component.scss']
})
export class TripVisualizerComponent implements OnInit {
  @Input() trips: { from: string; to: string }[] = [];
  @Output() tripsChange = new EventEmitter<{ from: string; to: string }[]>();
  @Output() initializeSampleData = new EventEmitter<void>();
  Math = Math; // Make Math available to the template

  ngOnInit() {
    this.prefillSampleData();
  }

  prefillSampleData() {
    const sampleRoutes = [
      { from: 'BLR', to: 'MAA' },
      { from: 'MAA', to: 'HYD' },
      { from: 'BLR', to: 'HYD' },
      { from: 'HYD', to: 'DEL' },
      { from: 'HYD', to: 'DEL' },
      { from: 'DEL', to: 'BLR' }
    ];

    this.trips = sampleRoutes;
    this.tripsChange.emit(this.trips);
  }

  onAddTrip(trip: { from: string; to: string }) {
    this.trips.push(trip);
    this.tripsChange.emit(this.trips);
  }

  onClearTrips() {
    this.trips = [];
    this.tripsChange.emit(this.trips);
  }

  getTripSegments() {
    const segments = [];
    
    // First pass: identify duplicate trips and their indices
    const duplicateIndices = new Set<number>();
    for (let i = 0; i < this.trips.length; i++) {
      for (let j = i + 1; j < this.trips.length; j++) {
        if (this.trips[i].from === this.trips[j].from && 
            this.trips[i].to === this.trips[j].to) {
          duplicateIndices.add(i);
          duplicateIndices.add(j);
        }
      }
    }
    
    for (let i = 0; i < this.trips.length; i++) {
      const trip = this.trips[i];
      const prev = this.trips[i - 1];
      let type = 'line';
      let level = duplicateIndices.has(i) ? 2 : 1;

      // Format the from/to to show only first 3 characters
      const formattedFrom = trip.from.substring(0, 3).toUpperCase();
      const formattedTo = trip.to.substring(0, 3).toUpperCase();

      // Check if it needs an arrow (non-continued trip)
      if (i > 0 && !duplicateIndices.has(i) && prev.to !== trip.from) {
        type = 'arrow';
      }

      // Determine color based on position and type
      let color;
      if (type === 'arrow') {
        color = '#f59e0b'; // Orange for non-continued trips
      } else if (level === 2) {
        color = '#6b7280'; // Grey for duplicate trips
      } else {
        // Color sequence for continued trips on level 1: purple, blue
        const colors = ['#8b5cf6', '#3b82f6'];
        color = colors[i % colors.length];
      }

      segments.push({ 
        from: formattedFrom, 
        to: formattedTo, 
        type, 
        level,
        originalFrom: trip.from,
        originalTo: trip.to,
        color
      });
    }
    return segments;
  }
} 