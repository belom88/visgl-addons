export type Vehicle = {
  latitude: number;
  longitude: number;
  bearing: number;
};

const METER_OFFSET = 10;
const METER_TO_LNGLAT_OFFSETS_CONSTANT = 111111;
const LAT_OFFSET = METER_OFFSET / METER_TO_LNGLAT_OFFSETS_CONSTANT;

const degreesToRadians = (degrees: number) => (Math.PI / 180) * degrees;
const getLngOffset = (latitude: number) =>
  METER_OFFSET /
  (METER_TO_LNGLAT_OFFSETS_CONSTANT * Math.cos(degreesToRadians(latitude)));

export const getPositions = (
  startPoint: {
    latitude: number;
    longitude: number;
  },
  amount: number
): Vehicle[] => {
  const amountInRow = amount ** 0.5;
  const result: Vehicle[] = [];
  let currentLatitude = startPoint.latitude;
  while (result.length < amount) {
    const lngOffset = getLngOffset(currentLatitude);
    for (let i = 0; i < amountInRow; i++) {
      result.push({
        latitude: currentLatitude,
        longitude: startPoint.longitude + i * lngOffset,
        bearing: 30
      });

      if (result.length >= amount) {
        break;
      }
    }
    currentLatitude += LAT_OFFSET;
  }
  return result;
};
