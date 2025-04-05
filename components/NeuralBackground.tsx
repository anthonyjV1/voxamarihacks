"use client"
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const NeuralBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
   
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#080818');
 
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(renderer.domElement);
   
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0x4f46e5, 1);
    pointLight.position.set(0, 0, 3);
    scene.add(pointLight);
    
    const createHandDrawnCircle = (radius: number, color: number, x: number, y: number, z: number) => {
      const group = new THREE.Group();
      const segments = 32;
      const points: THREE.Vector3[] = [];
      
      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        const variation = 1 + (Math.random() * 0.15 - 0.075);
        const xPos = Math.cos(theta) * radius * variation;
        const yPos = Math.sin(theta) * radius * variation;
        points.push(new THREE.Vector3(xPos, yPos, 0));
      }
      
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.7
      });
      const circle = new THREE.Line(geometry, material);
      group.add(circle);
     
      for (let i = 0; i < 5; i++) {
        const linePoints = [];
        const start = Math.random() * Math.PI * 2;
        const length = radius * (0.5 + Math.random() * 0.5);
        linePoints.push(new THREE.Vector3(
          Math.cos(start) * radius * 0.7,
          Math.sin(start) * radius * 0.7,
          0
        ));
        linePoints.push(new THREE.Vector3(
          Math.cos(start) * radius * 0.7 + Math.random() * length - length/2,
          Math.sin(start) * radius * 0.7 + Math.random() * length - length/2,
          0
        ));
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(linePoints);
        const line = new THREE.Line(lineGeometry, material);
        group.add(line);
      }
      
      group.position.set(x, y, z);
      
      scene.add(group);
      return group;
    };
   
    interface Neuron {
      mesh: THREE.Mesh;
      originalY: number;
      pulsePhase: number;
      pulseSpeed: number;
    }
    
    const neurons: Neuron[] = [];
    const neuronGeometry = new THREE.SphereGeometry(0.06, 8, 8);
    const neuronMaterial = new THREE.MeshPhongMaterial({
      color: 0x4f46e5,
      emissive: 0x4f46e5,
      emissiveIntensity: 0.5,
    });
    
    const handDrawnElements: THREE.Group[] = [];
    for (let i = 0; i < 8; i++) {
      const radius = 0.3 + Math.random() * 0.7;
      const x = (Math.random() - 0.5) * 10;
      const y = (Math.random() - 0.5) * 10;
      const z = (Math.random() - 0.5) * 5 - 2;
      const color = new THREE.Color(0x4f46e5).getHex() + Math.floor(Math.random() * 0x222222);
      handDrawnElements.push(createHandDrawnCircle(radius, color, x, y, z));
    }
    
    for (let i = 0; i < 40; i++) {
      const x = (Math.random() - 0.5) * 10;
      const y = (Math.random() - 0.5) * 10;
      const z = (Math.random() - 0.5) * 5 - 2;
      const neuron = new THREE.Mesh(neuronGeometry, neuronMaterial);
      neuron.position.set(x, y, z);
      scene.add(neuron);
      neurons.push({
        mesh: neuron,
        originalY: y,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.5 + Math.random() * 2
      });
    }
    
    const connectionGeometry = new THREE.BufferGeometry();
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x4f46e5,
      transparent: true,
      opacity: 0.2,
    });
    
    const connectionPoints: THREE.Vector3[] = [];
    for (let i = 0; i < neurons.length; i += 2) {
      const neuron1 = neurons[i];
      const neuron2 = neurons[(i + 1) % neurons.length];
      connectionPoints.push(neuron1.mesh.position.clone());
      connectionPoints.push(neuron2.mesh.position.clone());
    }
    connectionGeometry.setFromPoints(connectionPoints);
    const connections = new THREE.LineSegments(connectionGeometry, lineMaterial);
    scene.add(connections);
    
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 500;
    const posArray = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 15;
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.arc(8, 8, 4, 0, Math.PI * 2);
      ctx.fill();
    }
    
    const particleTexture = new THREE.CanvasTexture(canvas);
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.05,
      map: particleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
    });
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
  
    const mouse = {
      x: 0,
      y: 0,
      target: {
        x: 0,
        y: 0
      }
    };
    
    const handleMouseMove = (event: MouseEvent) => {
      mouse.target.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.target.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);
   
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    
    const animate = () => {
      requestAnimationFrame(animate);
  
      mouse.x += (mouse.target.x - mouse.x) * 0.05;
      mouse.y += (mouse.target.y - mouse.y) * 0.05;
      
      const time = Date.now() * 0.001;
      neurons.forEach((neuron) => {
        const pulse = Math.sin(time * neuron.pulseSpeed + neuron.pulsePhase) * 0.5 + 0.5;
        neuron.mesh.position.y = neuron.originalY + Math.sin(time * 0.5) * 0.1;
        const material = neuron.mesh.material as THREE.MeshPhongMaterial;
        material.emissiveIntensity = 0.3 + pulse * 0.7;
        neuron.mesh.scale.set(
          1 + pulse * 0.3,
          1 + pulse * 0.3,
          1 + pulse * 0.3
        );
      });
    
      handDrawnElements.forEach((elem, i) => {
        elem.rotation.z += 0.001 * (i % 2 === 0 ? 1 : -1);
        elem.position.y += Math.sin(time * 0.2 + i) * 0.001;
      });
      
      particlesMesh.rotation.x += 0.0003;
      particlesMesh.rotation.y += 0.0003;
     
      camera.position.x += (mouse.x * 1 - camera.position.x) * 0.03;
      camera.position.y += (-mouse.y * 1 - camera.position.y) * 0.03;
      camera.lookAt(scene.position);
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
      renderer.dispose();
      scene.clear();
    };
  }, []);
  
  return <div ref={containerRef} className="absolute inset-0" />;
};

export default NeuralBackground;