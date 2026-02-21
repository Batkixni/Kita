"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef, useMemo, Suspense, useEffect, useState } from "react";
import * as THREE from "three";

const fragmentShader = `
precision highp float;

uniform vec2 resolution;
uniform float time;
uniform vec2 mouse;
uniform vec2 mouseHistory[20];
uniform float isDark;

vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
vec2 fade(vec2 t) { return t * t * t * (t * (t * 6.0 - 15.0) + 10.0); }

float cnoise(vec2 P) {
  vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
  Pi = mod289(Pi);
  vec4 ix = Pi.xzxz;
  vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;
  vec4 i = permute(permute(ix) + iy);
  vec4 gx = fract(i * (1.0 / 41.0)) * 2.0 - 1.0;
  vec4 gy = abs(gx) - 0.5;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;
  vec2 g00 = vec2(gx.x, gy.x);
  vec2 g10 = vec2(gx.y, gy.y);
  vec2 g01 = vec2(gx.z, gy.z);
  vec2 g11 = vec2(gx.w, gy.w);
  vec4 norm = taylorInvSqrt(vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11)));
  g00 *= norm.x; g01 *= norm.y; g10 *= norm.z; g11 *= norm.w;
  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));
  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
  return 2.3 * n_xy;
}

float fbm(vec2 p) {
  float value = -0.2;
  float amplitude = 1.0;
  float frequency = 2.0;
  for (int i = 0; i < 6; i++) {
    value += amplitude * abs(cnoise(p));
    p *= frequency;
    amplitude *= 0.4;
  }
  return value;
}

float pattern(vec2 p, float t) {
  vec2 q = p + t * 0.03;
  vec2 r = p + sin(t * 0.015) * 0.3;
  return fbm(p + fbm(q + fbm(r)));
}

float dither8x8(vec2 pos, float val) {
  int x = int(mod(pos.x, 8.0));
  int y = int(mod(pos.y, 8.0));
  int idx = x + y * 8;
  float thresholds[64];
  thresholds[0] = 0.015625; thresholds[1] = 0.515625; thresholds[2] = 0.140625; thresholds[3] = 0.640625;
  thresholds[4] = 0.046875; thresholds[5] = 0.546875; thresholds[6] = 0.171875; thresholds[7] = 0.671875;
  thresholds[8] = 0.765625; thresholds[9] = 0.265625; thresholds[10] = 0.890625; thresholds[11] = 0.390625;
  thresholds[12] = 0.796875; thresholds[13] = 0.296875; thresholds[14] = 0.921875; thresholds[15] = 0.421875;
  thresholds[16] = 0.203125; thresholds[17] = 0.703125; thresholds[18] = 0.078125; thresholds[19] = 0.578125;
  thresholds[20] = 0.234375; thresholds[21] = 0.734375; thresholds[22] = 0.109375; thresholds[23] = 0.609375;
  thresholds[24] = 0.953125; thresholds[25] = 0.453125; thresholds[26] = 0.828125; thresholds[27] = 0.328125;
  thresholds[28] = 0.984375; thresholds[29] = 0.484375; thresholds[30] = 0.859375; thresholds[31] = 0.359375;
  thresholds[32] = 0.0625; thresholds[33] = 0.5625; thresholds[34] = 0.1875; thresholds[35] = 0.6875;
  thresholds[36] = 0.03125; thresholds[37] = 0.53125; thresholds[38] = 0.15625; thresholds[39] = 0.65625;
  thresholds[40] = 0.8125; thresholds[41] = 0.3125; thresholds[42] = 0.9375; thresholds[43] = 0.4375;
  thresholds[44] = 0.78125; thresholds[45] = 0.28125; thresholds[46] = 0.90625; thresholds[47] = 0.40625;
  thresholds[48] = 0.25; thresholds[49] = 0.75; thresholds[50] = 0.125; thresholds[51] = 0.625;
  thresholds[52] = 0.21875; thresholds[53] = 0.71875; thresholds[54] = 0.09375; thresholds[55] = 0.59375;
  thresholds[56] = 1.0; thresholds[57] = 0.5; thresholds[58] = 0.875; thresholds[59] = 0.375;
  thresholds[60] = 0.96875; thresholds[61] = 0.46875; thresholds[62] = 0.84375; thresholds[63] = 0.34375;
  return val > thresholds[idx] ? 1.0 : 0.0;
}

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec2 pos = uv - 0.5;
  pos.x *= resolution.x / resolution.y;

  // Mouse trail effect using history only (no cursor at current position)
  float mouseInfluence = 0.0;
  float cursorRadius = 0.06;

  // Only draw trail from history, skip index 0 (most recent = current position)
  for (int i = 1; i < 20; i++) {
    vec2 histPos = mouseHistory[i] / resolution;
    float dist = length(uv - histPos);
    float t = float(i) / 20.0;
    // Trail gets wider and fainter towards the end (older positions)
    float radius = cursorRadius * (0.3 + 0.7 * (1.0 - t));
    float influence = smoothstep(radius, 0.0, dist) * (1.0 - t) * 0.6;
    mouseInfluence = max(mouseInfluence, influence);
  }

  // Base pattern
  float n = pattern(pos * 1.5, time);
  n += mouseInfluence * 0.5;

  // Pixelate
  vec2 pixelPos = floor(gl_FragCoord.xy / 2.0) * 2.0;
  float dithered = dither8x8(pixelPos, n);

  // Colors based on theme
  vec3 col;
  if (isDark > 0.5) {
    vec3 dark = vec3(0.04);
    vec3 light = vec3(0.12);
    col = mix(dark, light, dithered);
  } else {
    vec3 light = vec3(0.98);
    vec3 dark = vec3(0.82);
    col = mix(light, dark, dithered);
  }

  gl_FragColor = vec4(col, 1.0);
}
`;

const vertexShader = `
void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

function Scene() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport, size } = useThree();

  const mouseHistory = useRef<{ x: number; y: number }[]>(
    Array(20).fill({ x: 0, y: 0 }),
  );
  const currentPos = useRef({ x: 0, y: 0 });
  const frameCount = useRef(0);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };
    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const uniforms = useMemo(
    () => ({
      time: { value: 0 },
      resolution: { value: new THREE.Vector2(size.width, size.height) },
      mouse: { value: new THREE.Vector2(0, 0) },
      mouseHistory: { value: Array(20).fill(new THREE.Vector2(0, 0)) },
      isDark: { value: 0 },
    }),
    [size.width, size.height],
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      currentPos.current.x = e.clientX;
      currentPos.current.y = size.height - e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [size.height]);

  useFrame((state) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.time.value = state.clock.getElapsedTime();
      material.uniforms.resolution.value.set(size.width, size.height);
      material.uniforms.isDark.value = isDark ? 1 : 0;
      material.uniforms.mouse.value.x = currentPos.current.x;
      material.uniforms.mouse.value.y = currentPos.current.y;

      // Update history every few frames for trail effect
      frameCount.current++;
      if (frameCount.current % 2 === 0) {
        mouseHistory.current.unshift({
          x: currentPos.current.x,
          y: currentPos.current.y,
        });
        mouseHistory.current.pop();

        // Update shader uniform
        material.uniforms.mouseHistory.value = mouseHistory.current.map(
          (p) => new THREE.Vector2(p.x, p.y),
        );
      }
    }
  });

  return (
    <mesh ref={meshRef} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}

export function PixelDyeBackground() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: -1 }}>
      <Canvas
        dpr={1}
        camera={{ position: [0, 0, 1] }}
        style={{ width: "100%", height: "100%" }}
        gl={{ antialias: false, alpha: false }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
