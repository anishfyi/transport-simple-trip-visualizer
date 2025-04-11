import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Trip } from '../../models/trip.model';
import { TripService } from '../../services/trip.service';

@Component({
  selector: 'app-trip-visualizer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trip-visualizer.component.html',
  styleUrls: ['./trip-visualizer.component.scss']
})
export class TripVisualizerComponent implements OnInit, OnChanges {
  @Input() trips: Trip[] = [];
  
  // SVG dimensions and settings
  readonly NODE_RADIUS = 20;
  readonly LEVEL_HEIGHT = 100;
  readonly HORIZONTAL_SPACING = 150;
  readonly ARROW_LENGTH = 20;
  readonly SVG_PADDING = 40;
  
  // Visualization data
  nodes: { id: string; x: number; y: number; label: string }[] = [];
  paths: { 
    from: string; 
    to: string; 
    isContinued: boolean; 
    isRepeated: boolean;
    level: number;
  }[] = [];

  constructor(private tripService: TripService) {}

  ngOnInit(): void {
    this.updateVisualization();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['trips']) {
      this.updateVisualization();
    }
  }

  private updateVisualization(): void {
    if (!this.trips.length) return;

    // Clear previous data
    this.nodes = [];
    this.paths = [];

    // Create unique locations map
    const locations = new Set<string>();
    this.trips.forEach(trip => {
      locations.add(trip.startPoint);
      locations.add(trip.endPoint);
    });

    // Create nodes
    const locationArray = Array.from(locations);
    locationArray.forEach((location, index) => {
      this.nodes.push({
        id: location,
        x: index * this.HORIZONTAL_SPACING + this.SVG_PADDING,
        y: this.SVG_PADDING,
        label: location.substring(0, 3).toUpperCase()
      });
    });

    // Create paths
    this.trips.forEach((trip, index) => {
      const isContinued = this.tripService.isContinuedTrip(trip, this.trips[index - 1]);
      const isRepeated = this.tripService.isRepeatedTrip(trip, this.trips);
      const level = isRepeated ? 1 : 0;

      this.paths.push({
        from: trip.startPoint,
        to: trip.endPoint,
        isContinued,
        isRepeated,
        level
      });
    });
  }

  // Helper methods for SVG rendering
  getNodePosition(id: string): { x: number; y: number } {
    const node = this.nodes.find(n => n.id === id);
    return node ? { x: node.x, y: node.y } : { x: 0, y: 0 };
  }

  getPathD(from: string, to: string, level: number): string {
    const start = this.getNodePosition(from);
    const end = this.getNodePosition(to);
    const controlY = start.y + (this.LEVEL_HEIGHT * (level + 1));
    
    return `M ${start.x} ${start.y} 
            Q ${(start.x + end.x) / 2} ${controlY} 
            ${end.x} ${end.y}`;
  }

  getSvgWidth(): number {
    if (!this.nodes.length) return 0;
    const lastNode = this.nodes[this.nodes.length - 1];
    return lastNode.x + this.NODE_RADIUS + this.SVG_PADDING;
  }

  getSvgHeight(): number {
    return this.LEVEL_HEIGHT * 2 + this.SVG_PADDING * 2;
  }
} 