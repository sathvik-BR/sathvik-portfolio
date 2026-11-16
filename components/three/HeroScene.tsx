"use client";

import React, { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { prefersReducedMotion } from "@/lib/motion";

interface GalaxyProps {
  isMobile: boolean;
  reducedMotion: boolean;
}

function GalaxyParticles({ isMobile, reducedMotion }: GalaxyProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const groupRef = useRef<THREE.Group>(null);

  const particleCount = isMobile ? 400 : 1500;
  const maxRadius = 6.2;
  const arms = 3;

  // Generate spiral galaxy positions and colors
  const { positions, colors, linePositions } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const col = new Float32Array(particleCount * 3);

    const violetColor = new THREE.Color("#7C5CFF");
    const cyanColor = new THREE.Color("#3DE0FF");
    const tempColor = new THREE.Color();

    const nodePositions: THREE.Vector3[] = [];

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      // Power distribution: more particles closer to the core
      const radius = Math.pow(Math.random(), 0.65) * maxRadius;
      const spinAngle = radius * 1.1;
      const armAngle = ((i % arms) * 2 * Math.PI) / arms;

      // Random scatter
      const randomX = (Math.pow(Math.random(), 2) - 0.5) * 0.45 * (radius * 0.3 + 0.3);
      const randomY = (Math.pow(Math.random(), 2) - 0.5) * 0.35 * (radius * 0.25 + 0.2);
      const randomZ = (Math.pow(Math.random(), 2) - 0.5) * 0.45 * (radius * 0.3 + 0.3);

      const x = Math.cos(armAngle + spinAngle) * radius + randomX;
      const y = randomY;
      const z = Math.sin(armAngle + spinAngle) * radius + randomZ;

      pos[i3] = x;
      pos[i3 + 1] = y;
      pos[i3 + 2] = z;

      if (!isMobile && i < 260) {
        nodePositions.push(new THREE.Vector3(x, y, z));
      }

      // Gradient color by normalized radius: violet at core -> cyan at perimeter
      const alpha = Math.min(Math.max(radius / maxRadius, 0), 1);
      tempColor.copy(violetColor).lerp(cyanColor, alpha);

      col[i3] = tempColor.r;
      col[i3 + 1] = tempColor.g;
      col[i3 + 2] = tempColor.b;
    }

    // Compute thin neural network connecting lines between nearby nodes (desktop only)
    let lineSegments: number[] = [];
    if (!isMobile && nodePositions.length > 0) {
      const maxDistance = 1.15;
      for (let a = 0; a < nodePositions.length; a++) {
        for (let b = a + 1; b < nodePositions.length; b++) {
          const dist = nodePositions[a].distanceTo(nodePositions[b]);
          if (dist < maxDistance) {
            lineSegments.push(
              nodePositions[a].x,
              nodePositions[a].y,
              nodePositions[a].z,
              nodePositions[b].x,
              nodePositions[b].y,
              nodePositions[b].z
            );
          }
        }
      }
    }

    return {
      positions: pos,
      colors: col,
      linePositions: new Float32Array(lineSegments),
    };
  }, [particleCount, isMobile]);

  // Texture for soft circular points
  const particleTexture = useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
    gradient.addColorStop(0.35, "rgba(255, 255, 255, 0.7)");
    gradient.addColorStop(0.8, "rgba(255, 255, 255, 0.1)");
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 32, 32);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);

  // Frame animation: continuous rotation + mouse parallax
  useFrame((state, delta) => {
    if (reducedMotion || !groupRef.current) return;

    // Slow galaxy rotation
    groupRef.current.rotation.y += delta * 0.055;

    // Mouse parallax easing
    const targetX = (state.pointer.x * 0.4);
    const targetY = (state.pointer.y * 0.3);

    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      -targetY * 0.35 + 0.3, // slight natural tilt
      0.04
    );
    groupRef.current.rotation.z = THREE.MathUtils.lerp(
      groupRef.current.rotation.z,
      targetX * 0.3,
      0.04
    );
  });

  return (
    <group ref={groupRef} rotation={[0.3, 0, 0]}>
      {/* Particles */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[colors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={isMobile ? 0.06 : 0.045}
          sizeAttenuation
          depthWrite={false}
          vertexColors
          transparent
          opacity={0.88}
          blending={THREE.AdditiveBlending}
          map={particleTexture || undefined}
        />
      </points>

      {/* Neural network connecting lines (desktop only) */}
      {!isMobile && linePositions.length > 0 && (
        <lineSegments ref={linesRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[linePositions, 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial
            color="#7C5CFF"
            transparent
            opacity={0.07}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </lineSegments>
      )}
    </group>
  );
}

export default function HeroScene() {
  const [isMobile, setIsMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    setReducedMotion(prefersReducedMotion());

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile, { passive: true });

    // Pause rendering when Hero is scrolled out of viewport
    const heroEl = document.getElementById("hero");
    if (heroEl && "IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          setIsVisible(entry.isIntersecting);
        },
        { threshold: 0.05 }
      );
      observer.observe(heroEl);
      return () => {
        observer.disconnect();
        window.removeEventListener("resize", checkMobile);
      };
    }

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div
      className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden select-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 2.4, 7], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        frameloop={isVisible && !reducedMotion ? "always" : "demand"}
      >
        <GalaxyParticles isMobile={isMobile} reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  );
}
