"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef, useMemo, Suspense, useEffect, useState } from "react";
import * as THREE from "three";

/**
 * Untitled blend / Sonorous — exact stops:
 * SILK #FFFFFF · AZURE #1D8EFF · INDIGO #306FCE · CYAN #00ECFF
 * Slow ink-like warp: the four stops knead together. Grain tile is static.
 */
const fragmentShader = `
precision highp float;

uniform vec2 resolution;
uniform float time;
uniform sampler2D grainMap;

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
  return 2.3 * mix(n_x.x, n_x.y, fade_xy.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 5; i++) {
    v += a * (cnoise(p) * 0.5 + 0.5);
    p = m * p;
    a *= 0.5;
  }
  return v;
}

vec3 overlay(vec3 base, vec3 blend) {
  return mix(2.0 * base * blend, 1.0 - 2.0 * (1.0 - base) * (1.0 - blend), step(0.5, base));
}

float blob(vec2 uv, vec2 c, vec2 scale) {
  vec2 d = (uv - c) * scale;
  return exp(-dot(d, d));
}

float blobR(vec2 uv, vec2 c, vec2 scale, float ang) {
  float ca = cos(ang);
  float sa = sin(ang);
  vec2 p = uv - c;
  vec2 r = vec2(ca * p.x + sa * p.y, -sa * p.x + ca * p.y) * scale;
  return exp(-dot(r, r));
}

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  float t = time * 0.08;

  vec3 silk   = vec3(1.000000, 1.000000, 1.000000);
  vec3 azure  = vec3(0.113725, 0.556863, 1.000000);
  vec3 indigo = vec3(0.188235, 0.435294, 0.807843);
  vec3 cyan   = vec3(0.000000, 0.925490, 1.000000);

  uv += (vec2(
    fbm(uv * 1.1 + vec2(t * 0.4, 0.0)),
    fbm(uv * 1.1 + vec2(2.7, t * 0.3))
  ) - 0.5) * 0.06;

  vec2 cA = vec2(0.78, 0.88) + 0.04 * vec2(sin(t * 0.6), cos(t * 0.5));
  vec2 cB = vec2(0.95, 0.68) + 0.03 * vec2(cos(t * 0.4), sin(t * 0.55));
  vec2 bA = vec2(0.38, 0.14) + 0.03 * vec2(sin(t * 0.35), cos(t * 0.4));
  vec2 bB = vec2(0.12, 0.36) + 0.04 * vec2(cos(t * 0.45), sin(t * 0.3));
  vec2 aA = vec2(0.22, 0.42) + 0.03 * vec2(sin(t * 0.5), cos(t * 0.35));
  vec2 sA = vec2(0.16, 0.74) + 0.05 * vec2(sin(t * 0.42), cos(t * 0.38));
  vec2 sB = vec2(0.46, 0.56) + 0.06 * vec2(cos(t * 0.36), sin(t * 0.44));
  vec2 sC = vec2(0.74, 0.44) + 0.05 * vec2(sin(t * 0.48), cos(t * 0.41));

  float wCyan = blob(uv, cA, vec2(2.2, 2.6)) * 1.4
              + blob(uv, cB, vec2(2.8, 2.4)) * 0.9;
  float wBlue = blob(uv, bA, vec2(1.8, 2.2)) * 1.5
              + blob(uv, bB, vec2(2.4, 2.0)) * 0.8
              + blob(uv, aA, vec2(2.6, 2.8)) * 0.55;
  float wSilk = blob(uv, sA, vec2(3.4, 1.7)) * 1.3
              + blobR(uv, sB, vec2(3.6, 1.35), -0.55) * 1.5
              + blobR(uv, sC, vec2(3.2, 1.6), -0.4) * 1.1;

  vec3 col = (cyan * wCyan + mix(indigo, azure, 0.35) * wBlue + silk * wSilk)
           / (wCyan + wBlue + wSilk + 1e-4);

  float g = texture2D(grainMap, gl_FragCoord.xy / 256.0).r;
  col = mix(col, overlay(col, vec3(g)), 0.32);

  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`;

const vertexShader = `
void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const midGray = (() => {
  const data = new Uint8Array([128, 128, 128, 255]);
  const tex = new THREE.DataTexture(data, 1, 1);
  tex.needsUpdate = true;
  return tex;
})();

function Scene() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport, size } = useThree();
  const [grainMap, setGrainMap] = useState<THREE.Texture>(midGray);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load("/backgrounds/film-grain.png", (tex) => {
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.magFilter = THREE.NearestFilter;
      tex.minFilter = THREE.NearestFilter;
      tex.generateMipmaps = false;
      tex.colorSpace = THREE.NoColorSpace;
      tex.needsUpdate = true;
      setGrainMap(tex);
    });
  }, []);

  const uniforms = useMemo(
    () => ({
      time: { value: 0 },
      resolution: { value: new THREE.Vector2(size.width, size.height) },
      grainMap: { value: midGray },
    }),
    [size.width, size.height],
  );

  useFrame((state) => {
    if (!meshRef.current) return;
    const material = meshRef.current.material as THREE.ShaderMaterial;
    material.uniforms.time.value = state.clock.getElapsedTime();
    material.uniforms.resolution.value.set(size.width, size.height);
    material.uniforms.grainMap.value = grainMap;
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

export function BlueSkyBackground() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: -1 }}>
      <Canvas
        dpr={1}
        camera={{ position: [0, 0, 1] }}
        style={{ width: "100%", height: "100%" }}
        gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
