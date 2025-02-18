import { useState, useEffect, useRef } from 'react';
import * as THREE from "three";
import { PARTICLE_CONFIG, CAMERA_CONFIG } from '../constants/particle.constants';
import { vertexShader, fragmentShader } from '../shaders/particle.shaders';
import type { ParticlePositions, MousePosition, Rotation } from '../types/three.types';

import emailjs from '@emailjs/browser';

// Replace these with your actual EmailJS credentials
const EMAILJS_PUBLIC_KEY = '46Og2C95TYXyn25Gv';
const EMAILJS_SERVICE_ID = 'service_kapiig4';
const EMAILJS_TEMPLATE_ID = 'template_57hgqne';

const Toast = ({ status, message, onClose }: { status: 'success' | 'error', message: string, onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-24 right-4 z-50 animate-slide-in">
      <div className={`rounded-lg shadow-lg p-4 ${
        status === 'success' 
          ? 'bg-gradient-to-r from-cyan-500/90 to-teal-500/90 text-white' 
          : 'bg-gradient-to-r from-red-500/90 to-pink-500/90 text-white'
      }`}>
        <div className="flex items-center space-x-2">
          {status === 'success' ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
          <p className="font-medium">{message}</p>
        </div>
      </div>
    </div>
  );
};

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

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

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(PARTICLE_CONFIG.BACKGROUND_COLOR);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(CAMERA_CONFIG.FOV, window.innerWidth / window.innerHeight, CAMERA_CONFIG.NEAR, CAMERA_CONFIG.FAR);
    camera.position.z = CAMERA_CONFIG.POSITION_Z;
    camera.position.y = 0;
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
    const radius = Math.max(window.innerWidth, window.innerHeight) / 2;
    startTimeRef.current = Date.now() - 800;

    const spherePositions = new Float32Array(particleCount * 3);
    const originalPositions = new Float32Array(particleCount * 3);
    const targetPositions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      
      const r = radius;
      const shellFactor = Math.random();
      const finalRadius = r * (0.8 + shellFactor * 0.2);

      const index = i * 3;
      const disperseDistance = radius * 1.2;
      const angle = Math.random() * Math.PI * 2;
      spherePositions[index] = Math.cos(angle) * disperseDistance * (0.5 + Math.random() * 0.5);
      spherePositions[index + 1] = Math.sin(angle) * disperseDistance * (0.5 + Math.random() * 0.5);
      spherePositions[index + 2] = (Math.random() - 0.5) * disperseDistance * 0.8;

      originalPositions[index] = finalRadius * Math.sin(phi) * Math.cos(theta);
      originalPositions[index + 1] = finalRadius * Math.sin(phi) * Math.sin(theta);
      originalPositions[index + 2] = finalRadius * Math.cos(phi);

      targetPositions[index] = originalPositions[index];
      targetPositions[index + 1] = originalPositions[index + 1];
      targetPositions[index + 2] = originalPositions[index + 2];

      colors[index] = 0.8;
      colors[index + 1] = 0.9;
      colors[index + 2] = 1.0;
    }

    spherePositionsRef.current = {
      array: spherePositions,
      original: originalPositions,
      target: targetPositions,
      velocity: velocities,
      color: colors
    };

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

    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute("position", new THREE.BufferAttribute(spherePositions, 3));
    particlesGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const particleMesh = new THREE.Points(particlesGeometry, particleMaterial);
    particleMesh.position.y = 0;
    scene.add(particleMesh);
    particleMeshRef.current = particleMesh;

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      
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

    let frame = 0;
    const animate = () => {
      frame = requestAnimationFrame(animate);
      timeRef.current += 0.016;

      if (particleMeshRef.current && spherePositionsRef.current) {
        const positions = particleMeshRef.current.geometry.attributes.position.array;
        const originalPositions = spherePositionsRef.current.original;

        const elapsed = (Date.now() - startTimeRef.current) / 1000;
        const convergeDuration = 2.0;

        for (let i = 0; i < positions.length; i += 3) {
          if (elapsed < convergeDuration) {
            const dx = originalPositions[i] - positions[i];
            const dy = originalPositions[i + 1] - positions[i + 1];
            const dz = originalPositions[i + 2] - positions[i + 2];

            const progress = elapsed / convergeDuration;
            const easeProgress = progress < 0.5 
              ? 4 * progress * progress * progress 
              : 1 - Math.pow(-2 * progress + 2, 3) / 2;

            const speedFactor = 0.1 + (easeProgress * 0.1);
            positions[i] += dx * speedFactor;
            positions[i + 1] += dy * speedFactor;
            positions[i + 2] += dz * speedFactor;
          } else {
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
              
              const returnForce = 0.08;
              positions[i] += (originalPositions[i] - positions[i]) * returnForce;
              positions[i + 1] += (originalPositions[i + 1] - positions[i + 1]) * returnForce;
              positions[i + 2] += (originalPositions[i + 2] - positions[i + 2]) * returnForce;
            } else {
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

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(frame);
      if (mountRef.current && rendererRef.current) {
        const canvas = rendererRef.current.domElement;
        if (canvas.parentElement === mountRef.current) {
          mountRef.current.removeChild(canvas);
        }
      }
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');
    setShowToast(false);

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          to_name: formData.name,
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
          reply_to: formData.email,
          website_url: 'https://your-portfolio-url.com', // Update this with your actual portfolio URL
          subject: `Thanks for reaching out, ${formData.name}!`,
          auto_reply: `Thank you for contacting me! I've received your message and will get back to you as soon as possible, usually within 24-48 hours.`
        },
        EMAILJS_PUBLIC_KEY
      );

      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      setShowToast(true);
      
      // Reset form status after 5 seconds
      setTimeout(() => {
        setStatus('idle');
      }, 5000);
    } catch (error) {
      console.error('Failed to send email:', error);
      setStatus('error');
      setErrorMessage('Failed to send message. Please try again later.');
      setShowToast(true);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="relative min-h-screen bg-[#0a192f]">
      <div ref={mountRef} className="fixed top-0 left-0 w-full h-screen" />
      
      {showToast && (
        <Toast 
          status={status === 'success' ? 'success' : 'error'}
          message={status === 'success' 
            ? "Message sent successfully! I'll get back to you soon."
            : errorMessage}
          onClose={() => setShowToast(false)}
        />
      )}
      
      <div className="relative z-10 container mx-auto px-8 pt-32">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center mb-8">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-cyan-300 to-teal-300">
              Contact
            </h1>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#112240] border border-[#233554] rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-gray-100"
                required
                disabled={status === 'loading'}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#112240] border border-[#233554] rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-gray-100"
                required
                disabled={status === 'loading'}
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={6}
                className="w-full px-4 py-3 bg-[#112240] border border-[#233554] rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-gray-100 resize-none"
                required
                disabled={status === 'loading'}
              />
            </div>
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full px-6 py-3 bg-transparent border-2 border-cyan-400 text-cyan-400 rounded-lg font-medium 
                       hover:bg-cyan-400/10 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-[#0a192f]
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'loading' ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage; 