export const PARTICLE_CONFIG = {
  COUNT: 15000,
  RADIUS: 40,
  BASE_SIZE: 3.5,
  BACKGROUND_COLOR: 0xFFFBF5,
  
  // Color settings
  BASE_HUE: 0.08,
  HUE_RANGE: 0.05,
  BASE_SATURATION: 0.8,
  BASE_LIGHTNESS: 0.5,
  
  // Animation settings
  SPRING_STRENGTH: {
    NORMAL: 0.04,
    DISPERSING: 0.01
  },
  DAMPING: {
    NORMAL: 0.85,
    DISPERSING: 0.98
  },
  MOUSE_INFLUENCE: {
    NORMAL: 40,
    HOVER: 60
  },
  DISPERSE_DISTANCE: 200,
  ROTATION_SPEED: 0.03
} as const;

export const CAMERA_CONFIG = {
  FOV: 60,
  NEAR: 0.1,
  FAR: 1000,
  POSITION_Z: 120
} as const; 