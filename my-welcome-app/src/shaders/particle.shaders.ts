export const vertexShader = `
  attribute vec3 color;
  varying vec3 vColor;
  uniform float time;
  uniform float size;
  uniform float colorShift;
  
  vec3 shiftHue(vec3 color, float shift) {
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(color.bg, K.wz), vec4(color.gb, K.xy), step(color.b, color.g));
    vec4 q = mix(vec4(p.xyw, color.r), vec4(color.r, p.yzx), step(p.x, color.r));
    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    vec3 hsv = vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
    hsv.x = fract(hsv.x + shift);
    vec3 rgb = clamp(abs(mod(hsv.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
    return mix(vec3(hsv.z), rgb, hsv.y);
  }
  
  void main() {
    vColor = shiftHue(color, colorShift);
    
    // Add some movement based on time
    vec3 pos = position;
    float wave = sin(time * 0.5 + position.x * 0.02 + position.y * 0.03) * 2.0;
    pos.x += wave;
    pos.y += wave;
    
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    
    // Size variation based on position and time
    float sizeVariation = sin(time + position.x * 0.1 + position.y * 0.1) * 0.5 + 1.0;
    gl_PointSize = size * sizeVariation * (300.0 / -mvPosition.z);
    
    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const fragmentShader = `
  varying vec3 vColor;
  
  void main() {
    float r = length(2.0 * gl_PointCoord - 1.0);
    if (r > 1.0) {
      discard;
    }
    
    // Create a softer, more nebulous glow
    float glow = exp(-3.0 * r * r);
    
    // Add intensity variation
    float intensity = glow * (1.0 - r * 0.5);
    
    // Enhance the green component slightly
    vec3 color = vColor;
    color.g *= 1.2;
    
    gl_FragColor = vec4(color, intensity * 0.8);
  }
`; 