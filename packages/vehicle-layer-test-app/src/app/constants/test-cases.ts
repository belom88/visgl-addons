import { TestCase } from '../types';

export const TEST_CASES: TestCase[] = [
  {
    id: 'animation-2000',
    name: 'Animation 2000',
    description: 'Animated 2000 vehicles',
    layerProps: {
      vehiclesCountValue: 2000,
      vehiclesCountMinMax: [0, 0],
      animated: true,
      scale: 1,
    },
  },
  {
    id: 'animation-5000',
    name: 'Animation 5000',
    description: 'Animated 5000 vehicles',
    layerProps: {
      vehiclesCountValue: 5000,
      vehiclesCountMinMax: [0, 0],
      animated: true,
      scale: 1,
    },
  },
  {
    id: 'static-50000',
    name: 'Static 50000',
    description: 'Static 50000 vehicles',
    layerProps: {
      vehiclesCountValue: 50000,
      vehiclesCountMinMax: [0, 0],
      animated: false,
      scale: 1,
    },
  },
];
