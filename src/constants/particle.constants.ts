export const PARTICLE_CONFIG = {
  COUNT: 15000,
  RADIUS: 30,
  BASE_SIZE: 4.33,
  BACKGROUND_COLOR: 0x0a192f,
  
  // Color configuration for green nebula effect
  BASE_HUE: 0.35,
  HUE_RANGE: 0.1,
  BASE_SATURATION: 0.8,
  BASE_LIGHTNESS: 0.6,
  
  // Movement configuration - smoother transitions
  SPRING_STRENGTH: {
    NORMAL: 0.02,
    DISPERSING: 0.01
  },
  DAMPING: {
    NORMAL: 0.95,
    DISPERSING: 0.98
  },
  MOUSE_INFLUENCE: {
    NORMAL: 25,
    HOVER: 35
  },
  
  ROTATION_SPEED: 0.02,
  DISPERSE_DISTANCE: 200,
} as const;

export const CAMERA_CONFIG = {
  FOV: 60,
  NEAR: 0.1,
  FAR: 2000,
  POSITION_Z: 120,
} as const; 