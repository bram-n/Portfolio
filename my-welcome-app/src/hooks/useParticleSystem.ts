import * as THREE from 'three';
import { PARTICLE_CONFIG } from '../constants/particle.constants';
import type { ParticlePositions } from '../types/three.types';

export const useParticleSystem = () => {
  const initializeParticles = (): ParticlePositions => {
    const {
      COUNT: particleCount,
      RADIUS: radius
    } = PARTICLE_CONFIG;

    const spherePositions = new Float32Array(particleCount * 3);
    const originalPositions = new Float32Array(particleCount * 3);
    const targetPositions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    // ... particle initialization logic ...

    return {
      array: spherePositions,
      original: originalPositions,
      target: targetPositions,
      velocity: velocities,
      color: colors
    };
  };

  return { initializeParticles };
}; 