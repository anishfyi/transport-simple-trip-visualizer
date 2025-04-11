import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { TripInputComponent } from './components/trip-input/trip-input.component';
import { TripVisualizerComponent } from './components/trip-visualizer/trip-visualizer.component';
import { TripService } from './services/trip.service';
import { Observable } from 'rxjs';
import { Trip } from './models/trip.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, TripInputComponent, TripVisualizerComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Transport Simple Trip Visualizer';
  trips$: Observable<Trip[]>;

  constructor(private tripService: TripService) {
    this.trips$ = this.tripService.trips$;
  }
}
