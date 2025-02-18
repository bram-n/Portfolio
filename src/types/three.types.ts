export interface ParticlePositions {
  array: Float32Array;
  original: Float32Array;
  target: Float32Array;
  velocity: Float32Array;
  color: Float32Array;
}

export interface MousePosition {
  x: number;
  y: number;
  prevX: number;
  prevY: number;
}

export interface Rotation {
  x: number;
  y: number;
} 