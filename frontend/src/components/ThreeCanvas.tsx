import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export const ThreeCanvas: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [webGlSupported, setWebGlSupported] = useState<boolean>(true);

  useEffect(() => {
    // Check WebGL availability
    const checkWebGL = () => {
      try {
        const canvas = document.createElement('canvas');
        return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
      } catch {
        return false;
      }
    };

    if (!checkWebGL()) {
      setWebGlSupported(false);
      return;
    }

    const container = mountRef.current;
    if (!container) return;

    // Detect user preference for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050811, 0.0018);

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 28;

    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x050811, 0);
      container.appendChild(renderer.domElement);
    } catch {
      setWebGlSupported(false);
      return;
    }

    // Interactive Mouse Coordinates with smooth lerping
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (prefersReducedMotion) return;
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // 1. Central Abstract Geometric Object: Rotating Wireframe Icosahedron & Inner Core
    const group = new THREE.Group();
    scene.add(group);

    // Outer wireframe sphere / icosahedron
    const outerGeo = new THREE.IcosahedronGeometry(7.5, isMobile ? 1 : 2);
    const outerMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.15,
    });
    const outerMesh = new THREE.Mesh(outerGeo, outerMat);
    group.add(outerMesh);

    // Inner subtle glow core
    const innerGeo = new THREE.IcosahedronGeometry(4.2, 1);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x8b5cf6,
      wireframe: true,
      transparent: true,
      opacity: 0.22,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    group.add(innerMesh);

    // Ring halo around the core
    const torusGeo = new THREE.TorusGeometry(10.5, 0.04, 8, 80);
    const torusMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.2,
    });
    const torusMesh = new THREE.Mesh(torusGeo, torusMat);
    torusMesh.rotation.x = Math.PI / 3;
    group.add(torusMesh);

    // 2. Network of Connected Floating Particles
    const particleCount = isMobile ? 80 : 160;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVelocities: { x: number; y: number; z: number }[] = [];

    const fieldRadius = 36;
    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * fieldRadius * 2;
      const y = (Math.random() - 0.5) * fieldRadius * 1.5;
      const z = (Math.random() - 0.5) * fieldRadius;

      particlePositions[i * 3] = x;
      particlePositions[i * 3 + 1] = y;
      particlePositions[i * 3 + 2] = z;

      particleVelocities.push({
        x: (Math.random() - 0.5) * 0.02,
        y: (Math.random() - 0.5) * 0.02,
        z: (Math.random() - 0.5) * 0.015,
      });
    }

    const particlesGeo = new THREE.BufferGeometry();
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    // Custom circular soft glow texture for points
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      gradient.addColorStop(0, 'rgba(0, 240, 255, 1)');
      gradient.addColorStop(0.35, 'rgba(56, 189, 248, 0.7)');
      gradient.addColorStop(0.7, 'rgba(139, 92, 246, 0.2)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 32, 32);
    }
    const particleTexture = new THREE.CanvasTexture(canvas);

    const particlesMat = new THREE.PointsMaterial({
      size: isMobile ? 1.0 : 1.4,
      map: particleTexture,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particleSystem = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particleSystem);

    // Dynamic Connection lines between nearby nodes
    const maxConnections = particleCount * 4;
    const linePositions = new Float32Array(maxConnections * 6);
    const linesGeo = new THREE.BufferGeometry();
    linesGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));

    const linesMat = new THREE.LineBasicMaterial({
      color: 0x0ea5e9,
      transparent: true,
      opacity: 0.12,
      blending: THREE.AdditiveBlending,
    });

    const linesMesh = new THREE.LineSegments(linesGeo, linesMat);
    scene.add(linesMesh);

    // Handle Window Resize
    const handleResize = () => {
      if (!renderer) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const speed = prefersReducedMotion ? 0.1 : 1.0;

      // Parallax mouse damping
      currentMouseX += (targetMouseX - currentMouseX) * 0.05;
      currentMouseY += (targetMouseY - currentMouseY) * 0.05;

      camera.position.x = currentMouseX * 3.5;
      camera.position.y = -currentMouseY * 2.5;
      camera.lookAt(0, 0, 0);

      // Rotate geometric shapes
      outerMesh.rotation.y += 0.12 * delta * speed;
      outerMesh.rotation.x += 0.07 * delta * speed;

      innerMesh.rotation.y -= 0.18 * delta * speed;
      innerMesh.rotation.z += 0.1 * delta * speed;

      torusMesh.rotation.z += 0.08 * delta * speed;

      // Move floating constellation particles
      const positions = particlesGeo.attributes.position.array as Float32Array;
      let lineIndex = 0;
      const linePositionsArr = linesGeo.attributes.position.array as Float32Array;
      const connectThreshold = isMobile ? 6.5 : 8.0;

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positions[i3] += particleVelocities[i].x * speed;
        positions[i3 + 1] += particleVelocities[i].y * speed;
        positions[i3 + 2] += particleVelocities[i].z * speed;

        // Boundary wrapping
        if (Math.abs(positions[i3]) > fieldRadius) particleVelocities[i].x *= -1;
        if (Math.abs(positions[i3 + 1]) > fieldRadius * 0.75) particleVelocities[i].y *= -1;
        if (Math.abs(positions[i3 + 2]) > fieldRadius * 0.5) particleVelocities[i].z *= -1;

        // Connect close neighbors
        for (let j = i + 1; j < particleCount; j++) {
          const j3 = j * 3;
          const dx = positions[i3] - positions[j3];
          const dy = positions[i3 + 1] - positions[j3 + 1];
          const dz = positions[i3 + 2] - positions[j3 + 2];
          const distSq = dx * dx + dy * dy + dz * dz;

          if (distSq < connectThreshold * connectThreshold && lineIndex < maxConnections * 6 - 6) {
            linePositionsArr[lineIndex++] = positions[i3];
            linePositionsArr[lineIndex++] = positions[i3 + 1];
            linePositionsArr[lineIndex++] = positions[i3 + 2];

            linePositionsArr[lineIndex++] = positions[j3];
            linePositionsArr[lineIndex++] = positions[j3 + 1];
            linePositionsArr[lineIndex++] = positions[j3 + 2];
          }
        }
      }

      particlesGeo.attributes.position.needsUpdate = true;

      // Clear remaining line coordinates
      for (let k = lineIndex; k < linePositionsArr.length; k++) {
        linePositionsArr[k] = 0;
      }
      linesGeo.setDrawRange(0, lineIndex / 3);
      linesGeo.attributes.position.needsUpdate = true;

      if (renderer) {
        renderer.render(scene, camera);
      }
    };

    animate();

    // Cleanup resources on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      outerGeo.dispose();
      outerMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      torusGeo.dispose();
      torusMat.dispose();
      particlesGeo.dispose();
      particlesMat.dispose();
      particleTexture.dispose();
      linesGeo.dispose();
      linesMat.dispose();

      if (renderer && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
        renderer.dispose();
      }
    };
  }, []);

  return (
    <>
      {/* 3D WebGL Canvas Layer */}
      <div
        ref={mountRef}
        aria-hidden="true"
        className="fixed inset-0 -z-10 pointer-events-none transition-opacity duration-1000"
        style={{ opacity: webGlSupported ? 1 : 0 }}
      />

      {/* Decorative gradient backdrops that guarantee contrast and readability */}
      <div
        aria-hidden="true"
        className="fixed inset-0 -z-20 pointer-events-none bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(14,165,233,0.15),rgba(5,8,17,0.95))]"
      />
      <div
        aria-hidden="true"
        className="fixed inset-0 -z-30 pointer-events-none bg-[#050811]"
      />

      {/* CSS Fallback if WebGL is unavailable */}
      {!webGlSupported && (
        <div
          aria-hidden="true"
          className="fixed inset-0 -z-10 pointer-events-none bg-[radial-gradient(circle_at_50%_40%,rgba(56,189,248,0.12)_0%,rgba(139,92,246,0.08)_40%,#050811_85%)] animate-pulse"
        />
      )}
    </>
  );
};
