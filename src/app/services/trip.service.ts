import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Trip } from '../models/trip.model';

@Injectable({
  providedIn: 'root'
})
export class TripService {
  private trips: Trip[] = [];
  private tripsSubject = new BehaviorSubject<Trip[]>([]);
  trips$: Observable<Trip[]> = this.tripsSubject.asObservable();

  constructor() {}

  addTrip(trip: Omit<Trip, 'id' | 'isContinued' | 'isRepeated'>): void {
    const newTrip: Trip = {
      ...trip,
      id: this.generateId(),
      isContinued: this.isContinuedTrip(trip, this.trips[this.trips.length - 1]),
      isRepeated: this.isRepeatedTrip(trip, this.trips)
    };

    this.trips.push(newTrip);
    this.updateTripRelationships();
    this.tripsSubject.next([...this.trips]);
  }

  clearTrips(): void {
    this.trips = [];
    this.tripsSubject.next([]);
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  isContinuedTrip(trip: Omit<Trip, 'id' | 'isContinued' | 'isRepeated'>, previousTrip?: Trip): boolean {
    if (!previousTrip) return false;
    return previousTrip.endPoint === trip.startPoint;
  }

  isRepeatedTrip(trip: Omit<Trip, 'id' | 'isContinued' | 'isRepeated'>, allTrips: Trip[]): boolean {
    return allTrips.some(existingTrip => 
      existingTrip.startPoint === trip.startPoint && 
      existingTrip.endPoint === trip.endPoint
    );
  }

  private updateTripRelationships(): void {
    this.trips.forEach((trip, index) => {
      if (index > 0) {
        trip.isContinued = this.isContinuedTrip(trip, this.trips[index - 1]);
      }
      if (index < this.trips.length - 1) {
        trip.isRepeated = this.isRepeatedTrip(trip, this.trips.slice(index + 1));
      }
    });
  }
} 