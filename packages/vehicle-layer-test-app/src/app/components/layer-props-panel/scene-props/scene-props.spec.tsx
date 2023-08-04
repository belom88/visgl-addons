import { render } from '@testing-library/react';

import SceneProps from './scene-props';

describe('SceneProps', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <SceneProps
        animationState={false}
        vehiclesCount={1000}
        vehiclesCountMin={50}
        vehiclesCountMax={5000}
        onAnimationStateChange={vi.fn()}
        onVehiclesCountChange={vi.fn()}
      />
    );
    expect(baseElement).toBeTruthy();
  });
});
