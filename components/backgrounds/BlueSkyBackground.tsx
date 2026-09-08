"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef, Suspense, useEffect, useState, type CSSProperties } from "react";
import * as THREE from "three";

/**
 * Saudade Mist Ribbon Background
 * Desktop: R3F fullscreen shader.
 * Mobile / coarse pointer: CSS gradient fallback so scroll never freezes WebGL.
 */

const fragmentShader = /* glsl */ `

precision highp float;

uniform float time;
uniform vec2 resolution;

// Stefan Gustavson Simplex 3D Noise
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 10.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  i = mod289(i);
  vec4 p = permute(permute(permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);

  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);

  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

// Low-octave FBM for organic domain warp
float fbmWarp(vec3 p) {
  float v = 0.0;
  float amp = 0.55;
  for (int i = 0; i < 3; i++) {
    v += amp * snoise(p);
    p = p * 2.04 + vec3(1.2, 3.4, 0.5);
    amp *= 0.48;
  }
  return v;
}

// 5-octave FBM for mist ribbons
float fbmField(vec3 p) {
  float v = 0.0;
  float amp = 0.5;
  float freq = 1.0;
  for (int i = 0; i < 5; i++) {
    v += amp * snoise(p * freq);
    freq *= 2.03;
    amp *= 0.5;
    p.xy = vec2(p.x * 0.995 - p.y * 0.1, p.x * 0.1 + p.y * 0.995);
  }
  return v;
}

// Density function with horizontal ribbon stretching, domain warp & counter-drift
float sampleFogDensity(vec2 uv, float t) {
  float zTime = t * 0.08;
  float aspect = resolution.x / max(resolution.y, 1.0);
  float aspectCorrection = aspect / (16.0 / 9.0);

  // Layer 1: drifts right at +0.02
  vec2 uv1 = uv;
  uv1.x = (uv1.x - 0.5) * aspectCorrection + 0.5;
  uv1.x += t * 0.02;
  vec2 st1 = vec2(uv1.x * 0.65, uv1.y * 2.2);
  vec2 warp1 = vec2(
    fbmWarp(vec3(st1 * 0.85, zTime * 0.5)),
    fbmWarp(vec3(st1 * 0.85 + vec2(5.3, 1.7), zTime * 0.5))
  );
  float field1 = fbmField(vec3(st1 + warp1 * 0.42, zTime));

  // Layer 2: drifts left at -0.012
  vec2 uv2 = uv;
  uv2.x = (uv2.x - 0.5) * aspectCorrection + 0.5;
  uv2.x -= t * 0.012;
  vec2 st2 = vec2(uv2.x * 0.85 + 11.2, uv2.y * 2.6 + 4.7);
  vec2 warp2 = vec2(
    fbmWarp(vec3(st2 * 0.8 + vec2(2.1, 8.4), zTime * 0.45)),
    fbmWarp(vec3(st2 * 0.8 + vec2(7.3, 3.2), zTime * 0.45))
  );
  float field2 = fbmField(vec3(st2 + warp2 * 0.38, zTime * 0.7));

  float rawNoise = 0.56 * field1 + 0.44 * field2;
  float normNoise = clamp(rawNoise * 0.5 + 0.5, 0.0, 1.0);
  return smoothstep(0.35, 0.75, normNoise);
}

float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;

  // 1. Vertical base gradient:
  // 上下兩側為深鈷藍，中間調淺營造層次漸層
  vec3 colBottom = vec3(0.05, 0.22, 0.72);
  vec3 colMid    = vec3(0.18, 0.46, 0.88); // 中間調淺的藍色
  vec3 colTop    = colBottom;              // 上層與下方相同

  float midBlend = smoothstep(0.0, 0.55, uv.y) * (1.0 - smoothstep(0.55, 1.0, uv.y));
  vec3 baseGrad  = mix(colBottom, colMid, midBlend);

  // 2. Cloud / fog field density
  float density = sampleFogDensity(uv, time);

  // 3. Color the fog
  vec3 fogLow  = vec3(0.06, 0.24, 0.65); // deep blue
  vec3 fogMid  = vec3(0.28, 0.58, 0.98); // richer blue
  vec3 fogHigh = vec3(0.90, 0.97, 1.00); // near-white cyan mist

  float tFogMid  = smoothstep(0.0, 0.55, density);
  float tFogHigh = smoothstep(0.45, 1.0, density);
  vec3 fogColor = mix(fogLow, fogMid, tFogMid);
  fogColor = mix(fogColor, fogHigh, tFogHigh);

  vec3 color = mix(baseGrad, fogColor, density * 0.88);

  // Add a little extra white only on the upper side of each band to fake backlight
  float eps = 0.012;
  float densityAbove = sampleFogDensity(uv + vec2(0.0, eps), time);
  float upperEdge = max(0.0, density - densityAbove);
  float backlight = smoothstep(0.03, 0.25, upperEdge) * smoothstep(0.2, 0.85, density);
  color += vec3(0.96, 0.99, 1.00) * (backlight * 0.45);

  // 4. Fixed static grain (固定的噪點，不隨時間跳動)
  vec2 grainSeed = gl_FragCoord.xy;
  float gLuma = hash12(grainSeed) - 0.5;
  float gChromaA = hash12(grainSeed + vec2(3.1, 7.7)) - 0.5;
  float gChromaB = hash12(grainSeed + vec2(9.3, 2.1)) - 0.5;

  vec3 grainVec = mix(vec3(gLuma), vec3(gChromaA, gLuma, gChromaB), 0.12);
  color += grainVec * 0.095;

  gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}
`;

const vertexShader = /* glsl */ `
void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

function MistRibbonScene() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport, size } = useThree();
  const uniforms = useRef({
    time: { value: 0 },
    resolution: { value: new THREE.Vector2(1, 1) },
  });

  useEffect(() => {
    uniforms.current.resolution.value.set(size.width, size.height);
  }, [size.width, size.height]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const material = meshRef.current.material as THREE.ShaderMaterial;
    material.uniforms.time.value = state.clock.elapsedTime;
    material.uniforms.resolution.value.set(size.width, size.height);
  });

  return (
    <mesh ref={meshRef} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={uniforms.current}
        depthWrite={false}
      />
    </mesh>
  );
}

function usePreferCssBackground() {
  const [preferCss, setPreferCss] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px), (pointer: coarse)");
    const update = () => setPreferCss(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return preferCss;
}

const cssFallbackStyle: CSSProperties = {
  position: "fixed",
  inset: 0,
  zIndex: -1,
  background:
    "radial-gradient(120% 80% at 50% 35%, rgba(46, 118, 224, 0.95) 0%, rgba(13, 56, 184, 0.98) 45%, rgba(13, 56, 184, 1) 100%), linear-gradient(180deg, #0d38b8 0%, #2e76e0 50%, #0d38b8 100%)",
  backgroundColor: "#0d38b8",
};

export function BlueSkyBackground() {
  const preferCss = usePreferCssBackground();

  if (preferCss) {
    return <div aria-hidden style={cssFallbackStyle} />;
  }

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: -1 }}>
      <Canvas
        dpr={1}
        frameloop="always"
        camera={{ position: [0, 0, 1] }}
        style={{ width: "100%", height: "100%" }}
        gl={{
          antialias: false,
          alpha: false,
          powerPreference: "default",
          failIfMajorPerformanceCaveat: false,
        }}
      >
        <Suspense fallback={null}>
          <MistRibbonScene />
        </Suspense>
      </Canvas>
    </div>
  );
}
