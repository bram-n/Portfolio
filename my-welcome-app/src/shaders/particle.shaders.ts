export const vertexShader = `
  attribute vec3 color;
  varying vec3 vColor;
  uniform float time;
  uniform float size;
  uniform float colorShift;
  
  vec3 hueShift(vec3 color, float shift) {
    const vec3 k = vec3(0.57735, 0.57735, 0.57735);
    float cosAngle = cos(shift);
    return vec3(color * cosAngle + cross(k, color) * sin(shift) + k * dot(k, color) * (1.0 - cosAngle));
  }
  
  void main() {
    vColor = hueShift(color, colorShift);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = size * (300.0 / -mvPosition.z);
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
    
    float glow = exp(-r * 2.5);
    float alpha = 1.0 - smoothstep(0.5, 1.0, r);
    
    vec3 finalColor = vColor + glow * 0.6;
    
    gl_FragColor = vec4(finalColor, alpha * 0.85);
  }
`; 