# Trip Visualizer

## Author
Anish Kr Singh

## Tech Stack
- Frontend Framework: Angular 15
- Data Visualization: D3.js
- Styling: Tailwind CSS
- TypeScript
- RxJS for reactive programming

## Requirements

### Input Fields
- Start Point
- End Point

### Design Specifications
- Display first three characters of both starting and ending points
- Visual representation should adjust dynamically based on the number of trips

### Functionality Rules
1. **Continued Trips**
   - When trips are continuous (e.g., Bangalore to Chennai, Chennai to Ooty)
   - Represented by straight lines on Level 1
   - No arrows needed

2. **Non-Continued Trips**
   - When trips are not continuous (e.g., Bangalore to Chennai, Ooty to Bangalore)
   - Represented by straight lines with arrows on Level 1

3. **Consecutive Same Location Trips**
   - When consecutive trips have identical pickup and drop locations
   - These trips should be represented on Level 2

4. **Dynamic Scaling**
   - The design should automatically adjust to accommodate any number of trips
   - All elements should fit within the defined dimensions
   - Layout should remain clear and readable regardless of trip count

## Local Development Setup

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)
- Angular CLI (v15)

### Installation Steps
1. Clone the repository
   ```bash
   git clone <repository-url>
   cd trip-visualizer
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start the development server
   ```bash
   npm start
   ```

4. Open your browser and navigate to
   ```
   http://localhost:4200
   ```

### Available Scripts
- `npm start`: Start the development server
- `npm run build`: Build the project for production
- `npm test`: Run unit tests
