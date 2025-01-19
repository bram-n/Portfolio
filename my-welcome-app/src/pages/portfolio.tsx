import * as THREE from "three";
import { useEffect, useRef } from 'react';
import { PARTICLE_CONFIG, CAMERA_CONFIG } from '../constants/particle.constants';
import { vertexShader, fragmentShader } from '../shaders/particle.shaders';
import type { ParticlePositions, MousePosition, Rotation } from '../types/three.types';
import { TracingBeam } from '../components/TracingBeam';
import { ProjectsSection } from '../components/ProjectsSection';
import { AboutSection } from '../components/AboutSection';

const projectSections = [
  {
    title: "AI Projects",
    pattern: 'v-shape' as const,
    cards: [
      {
        title: "Deep Vector Autoregression",
        src: "/project1.jpg",
        description: "My Honors Economics Research project which utilizes a Deep VAR model to examine the relationship between Household Debt and GDP."
      }, 
      {
        title: "Weather Forecasting with Ensemble Deep Learning",
        src: "/project2.jpg",
        description: "Analysis of Random Forest, LSTM, and BiLSTM models for weather forecasting."
      },
      {
        title: "ClefAI Music Generator",
        src: "/Project-photos/ClefAI.png",
        description: "A program that generates musical melodies using Markov chains based on a MIDI file input."
      }
    ]
  },
  {
    title: "Software Projects",
    pattern: 'v-shape' as const,
    cards: [
      {
        title: "Voyage Job Search",
        src: "/Project-photos/Voyage.png",
        description: "Full-stack job search website"
      },
      {
        title: "Math Image to LaTeX Generator",
        src: "/Project-photos/MathLaTeXAI.png",
        description: "Using Google Gemini, we created a website that converts images of math equations into LaTeX code "
      }
    ]
  },
  {
    title: "Games",
    pattern: 'v-shape' as const,
    cards: [
      {
        title: "Terrestrial Intelligence",
        src: "/Project-photos/Terrestrial Intelligence.png",
        description: "Multiplayer3D FPS game developed with Unreal Engine, Blender, and open source assets. Includes mechanics such as wall running, double jump, crouch, and more."
      },
      {
        title: "Tank Battle",
        src: "/Project-photos/Tank Game.png",
        description: "Multiplayer tankgame with random terrain generation andterrain deformation."
      },
      {
        title: "Connect 4 Game with AI opponent",
        src: "/Project-photos/Connect4.png",
        description: "Connect 4 game with AI opponent that utilizes alpha-beta pruning to increase AI accuracy."
      }
    ]
  }
];

const PortfolioPage = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const particleMeshRef = useRef<THREE.Points | null>(null);
  const spherePositionsRef = useRef<ParticlePositions | null>(null);
  const mousePositionRef = useRef<MousePosition>({ x: 0, y: 0, prevX: 0, prevY: 0 });
  const timeRef = useRef(0);
  const rotationRef = useRef<Rotation>({ x: 0, y: 0 });
  const startTimeRef = useRef(Date.now());
  const isConvergingRef = useRef(true);
  const isScatteringRef = useRef(false);
  const hasScatteredRef = useRef(false);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(PARTICLE_CONFIG.BACKGROUND_COLOR);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(CAMERA_CONFIG.FOV, window.innerWidth / window.innerHeight, CAMERA_CONFIG.NEAR, CAMERA_CONFIG.FAR);
    camera.position.z = CAMERA_CONFIG.POSITION_Z;
    camera.position.y = 0; // Center the camera vertically
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance"
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Particle system setup
    const particleCount = PARTICLE_CONFIG.COUNT;
    const radius = Math.max(window.innerWidth, window.innerHeight) / 2; // Make sphere fill the screen

    // Start animation before mount to overlap with previous page
    startTimeRef.current = Date.now() - 800; // Increased overlap time

    const spherePositions = new Float32Array(particleCount * 3);
    const originalPositions = new Float32Array(particleCount * 3);
    const targetPositions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    // Initialize particle positions with wide dispersion
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      
      const r = radius;
      const shellFactor = Math.random();
      const finalRadius = r * (0.8 + shellFactor * 0.2);

      const index = i * 3;
      // Start with less dispersed positions for smoother transition
      const disperseDistance = radius * 1.2; // Reduced initial dispersion
      const angle = Math.random() * Math.PI * 2;
      spherePositions[index] = Math.cos(angle) * disperseDistance * (0.5 + Math.random() * 0.5); // More controlled randomness
      spherePositions[index + 1] = Math.sin(angle) * disperseDistance * (0.5 + Math.random() * 0.5);
      spherePositions[index + 2] = (Math.random() - 0.5) * disperseDistance * 0.8; // Reduced Z dispersion

      // Target positions are the sphere formation
      originalPositions[index] = finalRadius * Math.sin(phi) * Math.cos(theta);
      originalPositions[index + 1] = finalRadius * Math.sin(phi) * Math.sin(theta);
      originalPositions[index + 2] = finalRadius * Math.cos(phi);

      targetPositions[index] = originalPositions[index];
      targetPositions[index + 1] = originalPositions[index + 1];
      targetPositions[index + 2] = originalPositions[index + 2];

      // Set uniform colors
      colors[index] = 0.8;     // R
      colors[index + 1] = 0.9; // G
      colors[index + 2] = 1.0; // B
    }

    spherePositionsRef.current = {
      array: spherePositions,
      original: originalPositions,
      target: targetPositions,
      velocity: velocities,
      color: colors
    };

    // Shader material setup
    const particleMaterial = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        time: { value: 0 },
        size: { value: PARTICLE_CONFIG.BASE_SIZE * 3 },
        colorShift: { value: 0.0 }
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader
    });

    // Create particle geometry
    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute("position", new THREE.BufferAttribute(spherePositions, 3));
    particlesGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const particleMesh = new THREE.Points(particlesGeometry, particleMaterial);
    particleMesh.position.y = 0; // Center the sphere
    scene.add(particleMesh);
    particleMeshRef.current = particleMesh;

    // Add mouse move handler with hover effect
    const handleMouseMove = (e: MouseEvent) => {
      // Convert screen coordinates to normalized device coordinates (-1 to +1)
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      
      // Convert to world coordinates based on camera position and field of view
      const worldX = x * (window.innerWidth / 2);
      const worldY = y * (window.innerHeight / 2);
      
      mousePositionRef.current = {
        x: worldX,
        y: worldY,
        prevX: mousePositionRef.current.x,
        prevY: mousePositionRef.current.y
      };
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    let frame = 0;
    const animate = () => {
      frame = requestAnimationFrame(animate);
      timeRef.current += 0.016;

      if (particleMeshRef.current && spherePositionsRef.current) {
        const positions = particleMeshRef.current.geometry.attributes.position.array;
        const originalPositions = spherePositionsRef.current.original;

        const elapsed = (Date.now() - startTimeRef.current) / 1000;
        const convergeDuration = 2.0; // Longer duration for smoother transition

        // Update all particles
        for (let i = 0; i < positions.length; i += 3) {
          if (elapsed < convergeDuration) {
            // Initial convergence to sphere with smoother easing
            const dx = originalPositions[i] - positions[i];
            const dy = originalPositions[i + 1] - positions[i + 1];
            const dz = originalPositions[i + 2] - positions[i + 2];

            const progress = elapsed / convergeDuration;
            // Smoother easing function (cubic bezier approximation)
            const easeProgress = progress < 0.5 
              ? 4 * progress * progress * progress 
              : 1 - Math.pow(-2 * progress + 2, 3) / 2;

            // Gradually increase movement speed
            const speedFactor = 0.1 + (easeProgress * 0.1);
            positions[i] += dx * speedFactor;
            positions[i + 1] += dy * speedFactor;
            positions[i + 2] += dz * speedFactor;
          } else {
            // Hover effect with corrected mouse position
            const mouseX = mousePositionRef.current.x;
            const mouseY = mousePositionRef.current.y;
            
            const dx = positions[i] - mouseX;
            const dy = positions[i + 1] - mouseY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            const repelRadius = radius * 0.15;
            if (distance < repelRadius) {
              const force = (1 - distance / repelRadius) * 12;
              const angle = Math.atan2(dy, dx);
              positions[i] += Math.cos(angle) * force;
              positions[i + 1] += Math.sin(angle) * force;
              
              // Smoother return to original position
              const returnForce = 0.08;
              positions[i] += (originalPositions[i] - positions[i]) * returnForce;
              positions[i + 1] += (originalPositions[i + 1] - positions[i + 1]) * returnForce;
              positions[i + 2] += (originalPositions[i + 2] - positions[i + 2]) * returnForce;
            } else {
              // Gentler return to original position
              const returnSpeed = 0.04;
              positions[i] += (originalPositions[i] - positions[i]) * returnSpeed;
              positions[i + 1] += (originalPositions[i + 1] - positions[i + 1]) * returnSpeed;
              positions[i + 2] += (originalPositions[i + 2] - positions[i + 2]) * returnSpeed;
            }
          }
        }

        particleMeshRef.current.geometry.attributes.position.needsUpdate = true;
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    // Event handlers
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return;
      const width = window.innerWidth;
      const height = window.innerHeight;
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    };

    animate();
    window.addEventListener("resize", handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(frame);
      if (mountRef.current && rendererRef.current) {
        const canvas = rendererRef.current.domElement;
        if (canvas.parentElement === mountRef.current) {
          mountRef.current.removeChild(canvas);
        }
      }
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#0a192f] via-[#0d1f3b] to-[#112240]">
      <div ref={mountRef} className="fixed top-0 left-0 w-full h-screen opacity-40" />
      
      <div className="relative z-10">
        <TracingBeam>
          <main className="flex flex-col w-full px-0 py-8 md:px-0 lg:px-0 max-w-[1460px] mx-auto">
            <ProjectsSection projectSections={projectSections} />
            <AboutSection />
          </main>
        </TracingBeam>
      </div>
    </div>
  );
};

export default PortfolioPage; 