import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-trip-input',
  templateUrl: './trip-input.component.html',
  styleUrls: ['./trip-input.component.scss']
})
export class TripInputComponent implements OnInit {
  @Output() addTrip = new EventEmitter<{ from: string; to: string }>();
  @Output() clearTrips = new EventEmitter<void>();
  @Output() initializeSampleData = new EventEmitter<void>();

  ngOnInit() {
    this.initializeSampleData.emit();
  }

  onAddTrip(from: string, to: string) {
    if (from.trim() && to.trim()) {
      this.addTrip.emit({
        from: from.slice(0, 3).toUpperCase(),
        to: to.slice(0, 3).toUpperCase()
      });
    }
  }

  onClearTrips() {
    this.clearTrips.emit();
  }
} 