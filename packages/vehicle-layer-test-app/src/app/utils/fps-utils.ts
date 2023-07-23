/**
 * Calculate fps from previous frame time and this frame time
 * @param then - previout frame time
 * @param now - this frame time
 * @returns fps in a moment and new previous frame time for the next calculations
 */
export const calculateCurrentFps = (
  then: number,
  now: number
): { currentFps: number; newThen: number } => {
  now *= 0.001; // convert to seconds
  const deltaTime = now - then; // compute time since last frame
  const currentFps = 1 / deltaTime;
  return { currentFps, newThen: now };
};

/**
 * Update average fps with new value
 * @param fps - average fps object
 * @param currentFps - new fps
 * @returns - new average fps object
 */
export const updateAverageFps = (
  fps: { value: number; count: number },
  currentFps: number
): { value: number; count: number } => {
  const newValue = (fps.value * fps.count + currentFps) / (fps.count + 1);
  return {
    value: newValue,
    count: fps.count + 1,
  };
};
