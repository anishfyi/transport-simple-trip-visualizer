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
  @Input() trips: Trip[] = [
    { id: '1', startPoint: 'PUNE', endPoint: 'DELHI', isContinued: false, isRepeated: false },
    { id: '2', startPoint: 'DELHI', endPoint: 'AAA', isContinued: false, isRepeated: false }
  ];
  
  // SVG dimensions and settings
  readonly NODE_RADIUS = 5;
  readonly HORIZONTAL_SPACING = 150;
  readonly SVG_PADDING = 40;
  readonly LABEL_OFFSET = 20;
  readonly PATH_LABEL_OFFSET = -10;
  
  nodes: { 
    id: string; 
    x: number; 
    y: number; 
    label: string;
    type: 'filled-blue' | 'empty';
  }[] = [];
  
  paths: { 
    id: string;
    from: string; 
    to: string; 
    type: string;
    label: string;
    showLabel: boolean;
  }[] = [];

  constructor(private tripService: TripService) {}

  ngOnInit(): void {
    console.log('Component initialized');
    this.updateVisualization();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['trips']) {
      console.log('Trips changed:', changes['trips'].currentValue);
      this.updateVisualization();
    }
  }

  private updateVisualization(): void {
    if (!this.trips.length) {
      console.log('No trips data available');
      return;
    }

    // Clear previous data
    this.nodes = [];
    this.paths = [];

    // Create unique locations map and track their order of appearance
    const locations = new Map<string, number>();
    this.trips.forEach(trip => {
      const startPoint = trip.startPoint.toUpperCase();
      const endPoint = trip.endPoint.toUpperCase();
      
      if (!locations.has(startPoint)) {
        locations.set(startPoint, locations.size);
      }
      if (!locations.has(endPoint)) {
        locations.set(endPoint, locations.size);
      }
    });

    // Create nodes with proper styling
    locations.forEach((index, location) => {
      this.nodes.push({
        id: location,
        x: index * this.HORIZONTAL_SPACING + this.SVG_PADDING,
        y: 40,
        label: location,
        type: location === 'PUNE' ? 'filled-blue' : 'empty'
      });
    });

    // Create paths with proper styling
    this.trips.forEach((trip, index) => {
      const startPoint = trip.startPoint.toUpperCase();
      const endPoint = trip.endPoint.toUpperCase();
      const pathType = this.getPathType(startPoint, endPoint);
      console.log('Creating path:', { from: startPoint, to: endPoint, type: pathType });
      
      this.paths.push({
        id: `path-${index}`,
        from: startPoint,
        to: endPoint,
        type: pathType,
        label: `${startPoint} - ${endPoint}`,
        showLabel: false
      });
    });

    console.log('Final nodes:', this.nodes);
    console.log('Final paths:', this.paths);
  }

  private getPathType(from: string, to: string): string {
    return `segment-${from.toLowerCase()}-${to.toLowerCase()}`;
  }

  getPathD(from: string, to: string): string {
    const start = this.getNodePosition(from);
    const end = this.getNodePosition(to);
    console.log('Path coordinates:', { from, to, start, end });
    return `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
  }

  getNodePosition(id: string): { x: number; y: number } {
    const node = this.nodes.find(n => n.id === id);
    if (!node) {
      console.warn('Node not found:', id);
      return { x: 0, y: 0 };
    }
    return { x: node.x, y: node.y };
  }

  getPathLabelPosition(from: string, to: string): { x: number; y: number } {
    const start = this.getNodePosition(from);
    const end = this.getNodePosition(to);
    return {
      x: (start.x + end.x) / 2,
      y: start.y - 10
    };
  }

  getSvgWidth(): number {
    if (!this.nodes.length) return 0;
    const lastNode = this.nodes[this.nodes.length - 1];
    return lastNode.x + this.SVG_PADDING * 2;
  }

  getSvgHeight(): number {
    return 100;
  }

  trackByNode(index: number, node: any): string {
    return node.id;
  }

  trackByPath(index: number, path: any): string {
    return path.id;
  }
} 