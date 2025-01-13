import * as THREE from "three";
import { useEffect, useRef, useState } from "react";
import { useRouter } from 'next/router';
import { PARTICLE_CONFIG, CAMERA_CONFIG } from '../constants/particle.constants';
import { vertexShader, fragmentShader } from '../shaders/particle.shaders';
import type { ParticlePositions, MousePosition, Rotation } from '../types/three.types';

const WelcomeScreen: React.FC = () => {
  const router = useRouter();
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const particleMeshRef = useRef<THREE.Points | null>(null);
  const spherePositionsRef = useRef<ParticlePositions | null>(null);
  const mousePositionRef = useRef<MousePosition>({ x: 0, y: 0, prevX: 0, prevY: 0 });
  const timeRef = useRef(0);
  const rotationRef = useRef<Rotation>({ x: 0, y: 0 });
  
  const [isHovering, setIsHovering] = useState(false);
  const [isDispersing, setIsDispersing] = useState(false);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(PARTICLE_CONFIG.BACKGROUND_COLOR); // Warm off-white background
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(CAMERA_CONFIG.FOV, window.innerWidth / window.innerHeight, CAMERA_CONFIG.NEAR, CAMERA_CONFIG.FAR);
    camera.position.z = CAMERA_CONFIG.POSITION_Z;
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
    const radius = PARTICLE_CONFIG.RADIUS;

    const spherePositions = new Float32Array(particleCount * 3);
    const originalPositions = new Float32Array(particleCount * 3);
    const targetPositions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    // Initialize particle positions
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      
      const r = radius * (1 + (Math.random() - 0.5) * 0.1);
      const shellFactor = Math.random();
      const finalRadius = shellFactor > 0.8 ? r : r * (0.5 + shellFactor * 0.5);

      const index = i * 3;
      spherePositions[index] = finalRadius * Math.sin(phi) * Math.cos(theta);
      spherePositions[index + 1] = finalRadius * Math.sin(phi) * Math.sin(theta);
      spherePositions[index + 2] = finalRadius * Math.cos(phi);

      originalPositions[index] = spherePositions[index];
      originalPositions[index + 1] = spherePositions[index + 1];
      originalPositions[index + 2] = spherePositions[index + 2];

      targetPositions[index] = spherePositions[index];
      targetPositions[index + 1] = spherePositions[index + 1];
      targetPositions[index + 2] = spherePositions[index + 2];

      velocities[index] = (Math.random() - 0.5) * 0.05;
      velocities[index + 1] = (Math.random() - 0.5) * 0.05;
      velocities[index + 2] = (Math.random() - 0.5) * 0.05;

      // New warm color scheme: oranges to golds
      const distanceFromCenter = finalRadius / radius;
      const hue = PARTICLE_CONFIG.BASE_HUE + (distanceFromCenter * PARTICLE_CONFIG.HUE_RANGE); // Range from orange-gold (0.08) to lighter gold (0.13)
      const saturation = PARTICLE_CONFIG.BASE_SATURATION - (distanceFromCenter * 0.3); // More saturated in center
      const lightness = PARTICLE_CONFIG.BASE_LIGHTNESS + (distanceFromCenter * 0.2); // Brighter towards edges
      const color = new THREE.Color().setHSL(hue, saturation, lightness);
      colors[index] = color.r;
      colors[index + 1] = color.g;
      colors[index + 2] = color.b;
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
        size: { value: PARTICLE_CONFIG.BASE_SIZE },
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
    scene.add(particleMesh);
    particleMeshRef.current = particleMesh;

    // Mouse interaction setup
    const mouse = new THREE.Vector2();
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const raycaster = new THREE.Raycaster();
    const planeIntersect = new THREE.Vector3();

    // Animation loop
    let frame = 0;
    const animate = () => {
      frame = requestAnimationFrame(animate);
      timeRef.current += 0.016;

      if (particleMeshRef.current && spherePositionsRef.current) {
        const positions = particleMeshRef.current.geometry.attributes.position.array;
        const originalPositions = spherePositionsRef.current.original;
        const targetPositions = spherePositionsRef.current.target;
        const velocities = spherePositionsRef.current.velocity;

        const springStrength = isDispersing ? PARTICLE_CONFIG.SPRING_STRENGTH.DISPERSING : PARTICLE_CONFIG.SPRING_STRENGTH.NORMAL;
        const damping = isDispersing ? PARTICLE_CONFIG.DAMPING.DISPERSING : PARTICLE_CONFIG.DAMPING.NORMAL;
        const mouseInfluence = isHovering ? PARTICLE_CONFIG.MOUSE_INFLUENCE.HOVER : PARTICLE_CONFIG.MOUSE_INFLUENCE.NORMAL;
        const mouseSpeed = Math.sqrt(
          Math.pow(mousePositionRef.current.x - mousePositionRef.current.prevX, 2) +
          Math.pow(mousePositionRef.current.y - mousePositionRef.current.prevY, 2)
        ) * 3;

        (particleMeshRef.current.material as THREE.ShaderMaterial).uniforms.time.value = timeRef.current;

        // Add color shift based on hover and time
        const material = particleMeshRef.current.material as THREE.ShaderMaterial;
        const baseColorShift = timeRef.current * 0.05; // Very slow base color shift
        const hoverColorShift = isHovering ? Math.sin(timeRef.current * 2) * 0.2 : 0;
        material.uniforms.colorShift.value = baseColorShift + hoverColorShift;

        for (let i = 0; i < positions.length; i += 3) {
          const dx = positions[i] - planeIntersect.x;
          const dy = positions[i + 1] - planeIntersect.y;
          const dz = positions[i + 2] - planeIntersect.z;
          const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

          let targetX = originalPositions[i];
          let targetY = originalPositions[i + 1];
          let targetZ = originalPositions[i + 2];

          // Add breathing effect
          const breathingAmplitude = 1.5;
          const breathingSpeed = 1.2;
          const breathing = Math.sin(timeRef.current * breathingSpeed) * breathingAmplitude;
          
          // Add spiral wave effect
          const particleAngle = Math.atan2(originalPositions[i], originalPositions[i + 1]);
          const waveSpeed = 0.8;
          const waveFrequency = 3;
          const waveAmplitude = 0.8;
          const spiralWave = Math.sin(particleAngle * waveFrequency + timeRef.current * waveSpeed) * waveAmplitude;

          // Add vertical wave effect
          const verticalWaveSpeed = 1.5;
          const verticalWaveFrequency = 0.05;
          const verticalWaveAmplitude = 0.6;
          const verticalWave = Math.sin(originalPositions[i + 1] * verticalWaveFrequency + timeRef.current * verticalWaveSpeed) * verticalWaveAmplitude;

          if (isDispersing) {
            // Random dispersion direction when clicked
            const disperseDistance = PARTICLE_CONFIG.DISPERSE_DISTANCE;
            targetX += (Math.random() - 0.5) * disperseDistance;
            targetY += (Math.random() - 0.5) * disperseDistance;
            targetZ += (Math.random() - 0.5) * disperseDistance;
          } else {
            // Apply the combined effects to the target positions
            const distanceFromCenter = Math.sqrt(
              targetX * targetX + targetY * targetY + targetZ * targetZ
            );
            const normalizedDistance = distanceFromCenter / 40; // Normalize by radius
            
            // Scale effects based on distance from center
            const breathingEffect = breathing * normalizedDistance;
            const combinedWave = (spiralWave + verticalWave) * normalizedDistance;
            
            targetX *= 1 + breathingEffect * 0.02;
            targetY *= 1 + breathingEffect * 0.02;
            targetZ *= 1 + breathingEffect * 0.02;

            targetX += combinedWave;
            targetY += combinedWave;
            targetZ += combinedWave;
          }

          const dirX = dx / (distance || 1);
          const dirY = dy / (distance || 1);
          const dirZ = dz / (distance || 1);

          const mouseRadius = 45 + mouseSpeed * 2;
          const influence = Math.pow(Math.max(1 - distance / mouseRadius, 0), 2);
          const force = influence * mouseInfluence * (1 + mouseSpeed * 0.5);

          targetPositions[i] = targetX + (dirX * force * 1.5);
          targetPositions[i + 1] = targetY + (dirY * force * 1.5);
          targetPositions[i + 2] = targetZ + (dirZ * force * 1.5);

          const timeWave = Math.sin(timeRef.current * 2 + i * 0.0001) * 0.2;
          targetPositions[i] += dirX * timeWave;
          targetPositions[i + 1] += dirY * timeWave;
          targetPositions[i + 2] += dirZ * timeWave;

          const springForceX = (targetPositions[i] - positions[i]) * springStrength;
          const springForceY = (targetPositions[i + 1] - positions[i + 1]) * springStrength;
          const springForceZ = (targetPositions[i + 2] - positions[i + 2]) * springStrength;

          // Enhance hover effect
          if (isHovering) {
            const spiralAngle = timeRef.current * 2 + Math.atan2(dy, dx);
            const spiralStrength = 15 * influence;
            targetPositions[i] += Math.cos(spiralAngle) * spiralStrength;
            targetPositions[i + 1] += Math.sin(spiralAngle) * spiralStrength;
            
            // Add outward push effect
            const pushStrength = 10 * influence;
            targetPositions[i] += (dirX * pushStrength);
            targetPositions[i + 1] += (dirY * pushStrength);
            targetPositions[i + 2] += (dirZ * pushStrength);
          }

          // Enhance turbulence when hovering
          const turbulence = isHovering ? 
            Math.sin(timeRef.current * 3 + i * 0.1) * 0.025 + 
            Math.cos(timeRef.current * 2 + i * 0.05) * 0.025 : 
            Math.sin(timeRef.current + i * 0.05) * 0.005;

          // Add pulsing size effect
          const pulseFreq = isHovering ? 2.0 : 1.0;
          const pulseAmp = isHovering ? 1.0 : 0.3;
          material.uniforms.size.value = PARTICLE_CONFIG.BASE_SIZE + Math.sin(timeRef.current * pulseFreq) * pulseAmp;

          velocities[i] = (velocities[i] + springForceX + turbulence) * damping;
          velocities[i + 1] = (velocities[i + 1] + springForceY + turbulence) * damping;
          velocities[i + 2] = (velocities[i + 2] + springForceZ + turbulence) * damping;

          positions[i] += velocities[i];
          positions[i + 1] += velocities[i + 1];
          positions[i + 2] += velocities[i + 2];
        }

        particleMeshRef.current.geometry.attributes.position.needsUpdate = true;

        const rotationSpeed = PARTICLE_CONFIG.ROTATION_SPEED;
        const targetRotationY = mousePositionRef.current.x * 0.3;
        const targetRotationX = -mousePositionRef.current.y * 0.3;
        
        rotationRef.current.y += (targetRotationY - rotationRef.current.y) * rotationSpeed;
        rotationRef.current.x += (targetRotationX - rotationRef.current.x) * rotationSpeed;
        
        particleMeshRef.current.rotation.y = rotationRef.current.y;
        particleMeshRef.current.rotation.x = rotationRef.current.x;

        mousePositionRef.current.prevX = mousePositionRef.current.x;
        mousePositionRef.current.prevY = mousePositionRef.current.y;
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

    const handleMouseMove = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      mousePositionRef.current.x = mouse.x;
      mousePositionRef.current.y = mouse.y;

      raycaster.setFromCamera(mouse, cameraRef.current!);
      raycaster.ray.intersectPlane(plane, planeIntersect);

      planeIntersect.x = THREE.MathUtils.clamp(planeIntersect.x, -50, 50);
      planeIntersect.y = THREE.MathUtils.clamp(planeIntersect.y, -50, 50);

      const distanceFromCenter = Math.sqrt(mouse.x * mouse.x + mouse.y * mouse.y);
      setIsHovering(distanceFromCenter < 0.5);
    };

    const handleClick = () => {
      if (!isDispersing) {
        setIsDispersing(true);
        setTimeout(() => {
          router.push('/next-page'); // Replace with your desired route
        }, 1000);
      }
    };

    // Start animation and add event listeners
    animate();
    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleClick);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
      cancelAnimationFrame(frame);

      if (mountRef.current && rendererRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
    };
  }, [isHovering, isDispersing, router]);

  return <div className="w-full h-screen cursor-pointer" ref={mountRef} />;
};

export default WelcomeScreen;