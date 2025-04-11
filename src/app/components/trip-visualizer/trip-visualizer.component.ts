import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Trip } from '../../models/trip.model';
import { TripService } from '../../services/trip.service';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-trip-visualizer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trip-visualizer.component.html',
  styleUrls: ['./trip-visualizer.component.scss'],
  animations: [
    trigger('nodeAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'scale(0)' }))
      ])
    ]),
    trigger('pathAnimation', [
      transition(':enter', [
        style({ strokeDasharray: '{{pathLength}}', strokeDashoffset: '{{pathLength}}' }),
        animate('500ms ease-out', style({ strokeDashoffset: 0 }))
      ], { params: { pathLength: 0 } })
    ]),
    trigger('labelAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('300ms 150ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
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

  // Add new method to calculate path length
  getPathLength(from: string, to: string, level: number): number {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', this.getPathD(from, to, level));
    return path.getTotalLength();
  }

  trackByPath(index: number, path: any): string {
    return `${path.from}-${path.to}-${path.level}`;
  }

  trackByNode(index: number, node: any): string {
    return node.id;
  }
} 