import moment from 'moment';
import { ROUTE_STUB } from './test-utils';
import { animateVehicles, createVehicles } from './vehicles-utils';

describe('utils/vehicles-utils', () => {
  describe('createVehicles', () => {
    it('should not create vehicles', () => {
      const result = createVehicles(10000, []);
      expect(result).toEqual([]);
    });

    it('should create vehicles', () => {
      const result = createVehicles(10000, [ROUTE_STUB]);
      expect(result.length).toEqual(10000);
    });
  });

  describe('animateVehicles', () => {
    it('should not animate vehicles', () => {
      const result = animateVehicles(
        [{ startDateTime: moment().toArray(), routeIndex: 0, pointIndex: 0 }],
        []
      );
      expect(result).toEqual([]);
    });

    it('should animate a vehicle', () => {
      const now = moment().toArray();
      const result = animateVehicles(
        [{ startDateTime: now, routeIndex: 0, pointIndex: 2 }],
        [ROUTE_STUB]
      );
      expect(result.length).toBe(1);
    });

    it('should animate a vehicle to the specific dateTime', () => {
      const nowMoment = moment();
      const nowArray = nowMoment.toArray();
      const result = animateVehicles(
        [{ startDateTime: nowArray, routeIndex: 0, pointIndex: 2 }],
        [ROUTE_STUB],
        nowMoment.add(2, 'seconds').toArray()
      );
      expect(result).toEqual([
        {
          bearing: 76.46523999104141,
          latitude: 37.79544914424243,
          longitude: -122.39689889903744,
        },
      ]);
    });
  });
});