export interface Trip {
  id: string;             // Unique identifier 
  startPoint: string;     // Full name of start location
  endPoint: string;       // Full name of end location
  isContinued: boolean;   // Whether this trip continues from the previous
  isRepeated: boolean;    // Whether this trip is identical to consecutive trips
} 