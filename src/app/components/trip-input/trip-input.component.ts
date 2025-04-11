import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TripService } from '../../services/trip.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-trip-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './trip-input.component.html',
  styleUrls: ['./trip-input.component.scss']
})
export class TripInputComponent {
  tripForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private tripService: TripService
  ) {
    this.tripForm = this.fb.group({
      startPoint: ['', [Validators.required, Validators.minLength(2)]],
      endPoint: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  onSubmit(): void {
    if (this.tripForm.valid) {
      this.tripService.addTrip({
        startPoint: this.tripForm.value.startPoint,
        endPoint: this.tripForm.value.endPoint
      });
      this.tripForm.reset();
    }
  }

  clearForm(): void {
    this.tripForm.reset();
  }

  get startPoint() {
    return this.tripForm.get('startPoint');
  }

  get endPoint() {
    return this.tripForm.get('endPoint');
  }
} 