'use client';

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const FuturisticBackground: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!mountRef.current) return;
    
    // Initialize Three.js
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0); // Transparent background
    mountRef.current.appendChild(renderer.domElement);
    
    // Camera position - moved further back to capture more of the scene
    camera.position.z = 45;
    
    // Enhanced color schemes with more vibrant colors
    const colorSchemes = [
      { main: new THREE.Color(0x00a2ff), accent: new THREE.Color(0x0062ff), trail: new THREE.Color(0x00ffea) }, // Bright blue
      { main: new THREE.Color(0xff00e6), accent: new THREE.Color(0xb400ff), trail: new THREE.Color(0xff71fc) }, // Electric purple
      { main: new THREE.Color(0x00ff88), accent: new THREE.Color(0x00ffa2), trail: new THREE.Color(0x92ffbd) }, // Neon green
      { main: new THREE.Color(0xff7700), accent: new THREE.Color(0xff5500), trail: new THREE.Color(0xffb700) }, // Amber orange
      { main: new THREE.Color(0xff003c), accent: new THREE.Color(0xff0000), trail: new THREE.Color(0xff6482) }, // Hot red
    ];
    
    let currentColorScheme = colorSchemes[0];
    let targetColorScheme = colorSchemes[0];
    let colorTransitionProgress = 0;
    
    // Create main particle system
    const particlesCount = 3000;
    const particlesGeometry = new THREE.BufferGeometry();
    
    // Create positions and colors for particles
    const positions = new Float32Array(particlesCount * 3);
    const colors = new Float32Array(particlesCount * 3);
    const sizes = new Float32Array(particlesCount);
    
    for (let i = 0; i < particlesCount * 3; i += 3) {
      // Position particles in a wide, side-focused distribution
      // This creates more particles on the sides and fewer in the middle
      const x = Math.random() < 0.7 
        ? (Math.random() < 0.5 ? -1 : 1) * (Math.random() * 30 + 20) 
        : (Math.random() - 0.5) * 40;
      
      positions[i] = x;
      positions[i + 1] = (Math.random() - 0.5) * 50;
      positions[i + 2] = (Math.random() - 0.5) * 50;
      
      // Set initial color
      colors[i] = currentColorScheme.main.r;
      colors[i + 1] = currentColorScheme.main.g;
      colors[i + 2] = currentColorScheme.main.b;
      
      // Varied particle sizes
      sizes[i/3] = Math.random() * 0.5 + 0.1;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particlesGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    // Improved particle shader material with vertex colors and custom size
    const particlesMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        pixelRatio: { value: window.devicePixelRatio }
      },
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        uniform float time;
        uniform float pixelRatio;
        
        void main() {
          vColor = color;
          
          // Slight animation effect
          vec3 pos = position;
          pos.x += sin(time * 0.001 + position.y * 0.05) * 0.5;
          pos.y += cos(time * 0.002 + position.x * 0.05) * 0.5;
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = size * pixelRatio * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        
        void main() {
          // Create softer, glowing particle
          float distance = length(gl_PointCoord - vec2(0.5, 0.5));
          if (distance > 0.5) discard;
          
          float intensity = 1.0 - distance * 2.0;
          intensity = pow(intensity, 1.5);
          
          gl_FragColor = vec4(vColor, intensity);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    
    // Create the particle system
    const particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particleSystem);
    
    // Add connecting lines between nearby particles
    const linesGeometry = new THREE.BufferGeometry();
    const linesCount = 800; // Fewer lines for better performance
    const lineMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending
    });
    
    const linePositions = new Float32Array(linesCount * 6); // 2 points per line, 3 components per point
    const lineColors = new Float32Array(linesCount * 6);
    
    // Initialize with empty lines
    linesGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    linesGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));
    
    const lines = new THREE.LineSegments(linesGeometry, lineMaterial);
    scene.add(lines);
    
    // Energy field effect (side tendrils)
    const createTendrils = () => {
      const tendrilsCount = 24;
      const tendrilsGeometry = new THREE.BufferGeometry();
      const tendrilsPositions = new Float32Array(tendrilsCount * 300 * 3); // 300 points per tendril
      const tendrilsColors = new Float32Array(tendrilsCount * 300 * 3);
      
      // Create tendrils on the sides
      for (let t = 0; t < tendrilsCount; t++) {
        const side = t % 2 === 0 ? -1 : 1; // alternate sides
        const baseX = side * (30 + Math.random() * 10); // Fixed position on the sides
        const baseY = (Math.random() - 0.5) * 40;
        const baseZ = (Math.random() - 0.5) * 40;
        
        // Color variation
        const colorIndex = Math.floor(Math.random() * colorSchemes.length);
        const tendrilColor = colorSchemes[colorIndex].trail;
        
        for (let i = 0; i < 300; i++) {
          const idx = (t * 300 + i) * 3;
          
          // Create flowing, swirling pattern
          const angle = i * 0.1 + t * 0.5;
          const radius = Math.sin(i * 0.05) * 5 + 2;
          
          tendrilsPositions[idx] = baseX + Math.sin(angle) * radius * 0.5; // Reduced X movement
          tendrilsPositions[idx + 1] = baseY + Math.cos(angle) * radius + i * 0.1;
          tendrilsPositions[idx + 2] = baseZ + Math.sin(angle * 0.7) * radius - i * 0.1;
          
          // Fade out color along the tendril
          const fade = 1 - i / 300;
          tendrilsColors[idx] = tendrilColor.r * fade;
          tendrilsColors[idx + 1] = tendrilColor.g * fade;
          tendrilsColors[idx + 2] = tendrilColor.b * fade;
        }
      }
      
      tendrilsGeometry.setAttribute('position', new THREE.BufferAttribute(tendrilsPositions, 3));
      tendrilsGeometry.setAttribute('color', new THREE.BufferAttribute(tendrilsColors, 3));
      
      const tendrilsMaterial = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
      });
      
      const tendrils = new THREE.LineSegments(tendrilsGeometry, tendrilsMaterial);
      scene.add(tendrils);
      
      return tendrils;
    };
    
    let tendrils = createTendrils();
    
    // Create AI shape patterns - focused on sides
    const createShape = () => {
      const shapeType = Math.floor(Math.random() * 4);
      
      // Choose new color scheme
      const newColorIndex = Math.floor(Math.random() * colorSchemes.length);
      targetColorScheme = colorSchemes[newColorIndex];
      colorTransitionProgress = 0;
      
      // Clear old target positions
      const targetPositions = new Float32Array(particlesCount * 3);
      
      // Remove old tendrils and create new ones
      scene.remove(tendrils);
      tendrils = createTendrils();
      
      if (shapeType === 0) {
        // Brain-like shape on sides
        for (let i = 0; i < particlesCount * 3; i += 3) {
          const side = Math.random() < 0.5 ? -1 : 1;
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.random() * Math.PI;
          const r = 10 + Math.random() * 4;
          
          targetPositions[i] = side * (20 + r * Math.sin(phi) * Math.cos(theta) * 0.5);
          targetPositions[i + 1] = r * Math.sin(phi) * Math.sin(theta) + Math.sin(phi * 8) * 2;
          targetPositions[i + 2] = r * Math.cos(phi) + Math.sin(theta * 8) * 2;
        }
      } else if (shapeType === 1) {
        // Data flow structure
        for (let i = 0; i < particlesCount * 3; i += 3) {
          const side = Math.random() < 0.5 ? -1 : 1;
          const baseX = side * (20 + Math.random() * 10);
          const flowLine = Math.floor(Math.random() * 15) - 7;
          
          targetPositions[i] = baseX;
          targetPositions[i + 1] = flowLine * 4 + Math.random() * 2;
          targetPositions[i + 2] = (Math.random() - 0.5) * 40;
        }
      } else if (shapeType === 2) {
        // Quantum pattern
        for (let i = 0; i < particlesCount * 3; i += 3) {
          const side = Math.random() < 0.5 ? -1 : 1;
          const t = Math.random() * Math.PI * 6;
          const radius = 12 + Math.random() * 8;
          
          targetPositions[i] = side * (20 + Math.cos(t * 3) * 4);
          targetPositions[i + 1] = Math.sin(t) * radius;
          targetPositions[i + 2] = Math.cos(t * 2) * radius;
        }
      } else {
        // Constellation pattern
        const numConstellations = 8;
        const pointsPerConstellation = particlesCount / numConstellations;
        
        for (let i = 0; i < particlesCount; i++) {
          const constellationIndex = Math.floor(i / pointsPerConstellation);
          const side = constellationIndex % 2 === 0 ? -1 : 1;
          
          // Create a constellation center
          const centerX = side * (25 + Math.random() * 10);
          const centerY = (Math.random() - 0.5) * 30;
          const centerZ = (Math.random() - 0.5) * 30;
          
          // Distribution around center
          const idx = i * 3;
          const distance = Math.random() * 10;
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.random() * Math.PI;
          
          targetPositions[idx] = centerX + distance * Math.sin(phi) * Math.cos(theta);
          targetPositions[idx + 1] = centerY + distance * Math.sin(phi) * Math.sin(theta);
          targetPositions[idx + 2] = centerZ + distance * Math.cos(phi);
        }
      }
      
      return targetPositions;
    };
    
    // Initial shape
    let targetPositions = createShape();
    
    // Track mouse position for interactivity
    const mouse = new THREE.Vector2();
    const mouseTolerance = 0.1;
    
    const onMouseMove = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    
    window.addEventListener('mousemove', onMouseMove);
    
    // Animation loop
    let lastTime = 0;
    const animate = (time: number) => {
      requestAnimationFrame(animate);
      
      const deltaTime = time - lastTime;
      lastTime = time;
      
      // Update time uniform for shader
      particlesMaterial.uniforms.time.value = time;
      
      // Slowly rotate tendrils
      if (tendrils) {
        tendrils.rotation.y += 0.001;
        tendrils.rotation.x += 0.0005;
      }
      
      // Rotate the particle system
      particleSystem.rotation.y += 0.0005;
      particleSystem.rotation.z += 0.0002;
      
      // Progress color transition
      if (colorTransitionProgress < 1) {
        colorTransitionProgress += 0.01;
        
        // Interpolate current color scheme
        currentColorScheme = {
          main: new THREE.Color().lerpColors(
            currentColorScheme.main,
            targetColorScheme.main,
            colorTransitionProgress
          ),
          accent: new THREE.Color().lerpColors(
            currentColorScheme.accent,
            targetColorScheme.accent,
            colorTransitionProgress
          ),
          trail: new THREE.Color().lerpColors(
            currentColorScheme.trail,
            targetColorScheme.trail,
            colorTransitionProgress
          )
        };
      }
      
      // Update particle positions and colors
      const positions = particlesGeometry.attributes.position.array as Float32Array;
      const colors = particlesGeometry.attributes.color.array as Float32Array;
      
      // Regenerate connections between particles
      let lineIndex = 0;
      
      for (let i = 0; i < particlesCount * 3; i += 3) {
        // Mouse interaction - particles react to cursor
        const particle = new THREE.Vector3(positions[i], positions[i + 1], positions[i + 2]);
        particle.project(camera);
        
        const distance = Math.sqrt(
          Math.pow(particle.x - mouse.x, 2) + 
          Math.pow(particle.y - mouse.y, 2)
        );
        
        // Apply forces to particles
        if (distance < mouseTolerance) {
          // Repulsion force
          const repulsionForce = (mouseTolerance - distance) * 0.1;
          const direction = new THREE.Vector3(
            particle.x - mouse.x,
            particle.y - mouse.y,
            0
          ).normalize();
          
          // Add repulsion to the particle in world space
          const repulsionVector = direction.multiplyScalar(repulsionForce);
          repulsionVector.unproject(camera);
          
          positions[i] += repulsionVector.x * 0.05;
          positions[i + 1] += repulsionVector.y * 0.05;
          positions[i + 2] += repulsionVector.z * 0.05;
          
          // Highlight particles near cursor with accent color
          colors[i] = currentColorScheme.accent.r;
          colors[i + 1] = currentColorScheme.accent.g;
          colors[i + 2] = currentColorScheme.accent.b;
        } else {
          // Use main color for particles away from cursor
          colors[i] = currentColorScheme.main.r;
          colors[i + 1] = currentColorScheme.main.g;
          colors[i + 2] = currentColorScheme.main.b;
          
          // Continue morphing towards target shape
          positions[i] += (targetPositions[i] - positions[i]) * 0.02;
          positions[i + 1] += (targetPositions[i + 1] - positions[i + 1]) * 0.02;
          positions[i + 2] += (targetPositions[i + 2] - positions[i + 2]) * 0.02;
        }
        
        // Create connections between nearby particles
        if (i % 9 === 0 && lineIndex < linesCount) { // Use every 3rd particle for connections
          let closestIndex = -1;
          let minDistance = 6; // Connection distance threshold
          
          // Find closest particle within threshold
          for (let j = 0; j < particlesCount * 3; j += 3) {
            if (i === j) continue;
            
            const dx = positions[i] - positions[j];
            const dy = positions[i + 1] - positions[j + 1];
            const dz = positions[i + 2] - positions[j + 2];
            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
            
            if (dist < minDistance) {
              minDistance = dist;
              closestIndex = j;
            }
          }
          
          // Create line between particles
          if (closestIndex >= 0) {
            const lineIdx = lineIndex * 6;
            
            // First point
            linePositions[lineIdx] = positions[i];
            linePositions[lineIdx + 1] = positions[i + 1];
            linePositions[lineIdx + 2] = positions[i + 2];
            
            // Second point
            linePositions[lineIdx + 3] = positions[closestIndex];
            linePositions[lineIdx + 4] = positions[closestIndex + 1];
            linePositions[lineIdx + 5] = positions[closestIndex + 2];
            
            // Set colors
            lineColors[lineIdx] = currentColorScheme.trail.r;
            lineColors[lineIdx + 1] = currentColorScheme.trail.g;
            lineColors[lineIdx + 2] = currentColorScheme.trail.b;
            
            lineColors[lineIdx + 3] = currentColorScheme.trail.r;
            lineColors[lineIdx + 4] = currentColorScheme.trail.g;
            lineColors[lineIdx + 5] = currentColorScheme.trail.b;
            
            lineIndex++;
          }
        }
      }
      
      // Update attributes that need updates
      particlesGeometry.attributes.position.needsUpdate = true;
      particlesGeometry.attributes.color.needsUpdate = true;
      linesGeometry.attributes.position.needsUpdate = true;
      linesGeometry.attributes.color.needsUpdate = true;
      
      renderer.render(scene, camera);
    };
    
    animate(0);
    
    // Change shape every 5 seconds
    const shapeInterval = setInterval(() => {
      targetPositions = createShape();
    }, 5000);
    
    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      particlesMaterial.uniforms.pixelRatio.value = window.devicePixelRatio;
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onMouseMove);
      clearInterval(shapeInterval);
      scene.remove(particleSystem);
      scene.remove(lines);
      scene.remove(tendrils);
      renderer.dispose();
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);
  
  return (
    <div 
      ref={mountRef} 
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        zIndex: -1,
        pointerEvents: 'none',
      }}
    />
  );
};

export default FuturisticBackground;