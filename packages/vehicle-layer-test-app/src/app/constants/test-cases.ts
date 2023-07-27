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
      dimentionalMode: '3D',
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
      dimentionalMode: '3D',
    },
  },
  {
    id: 'static-50000',
    name: 'Static 50K',
    description: 'Static 50K vehicles',
    layerProps: {
      vehiclesCountValue: 50000,
      vehiclesCountMinMax: [0, 0],
      animated: false,
      scale: 1,
      dimentionalMode: '3D',
    },
  },
  {
    id: '2d-50000',
    name: 'Static 2D 50K',
    description: 'Static 50K vehicles; sizeScale 0.15',
    layerProps: {
      vehiclesCountValue: 50000,
      vehiclesCountMinMax: [0, 0],
      animated: false,
      scale: 0.15,
      dimentionalMode: '2D',
    },
  },
];
