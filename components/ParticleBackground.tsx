'use client';
import React, { useEffect, useRef, useState } from 'react';

const SimpleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const mousePosition = useRef({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions with device pixel ratio for better resolution
    const setCanvasDimensions = () => {
      const pixelRatio = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * pixelRatio;
      canvas.height = window.innerHeight * pixelRatio;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(pixelRatio, pixelRatio);
    };

    // 3D particle class
    class Particle3D {
      x: number;
      y: number;
      z: number;
      radius: number;
      baseColor: string;
      color: string;
      vx: number;
      vy: number;
      vz: number;
      opacity: number;
      pulseSpeed: number;
      pulsePhase: number;

      constructor() {
        // Position in 3D space
        this.x = (Math.random() - 0.5) * canvas.width;
        this.y = (Math.random() - 0.5) * canvas.height;
        this.z = Math.random() * 1000;
        
        // Appearance
        this.radius = Math.random() * 2 + 1;
        
        // Random color between cyan and purple for futuristic look
        const hue = Math.random() * 60 + 180; // 180-240 range (cyan to blue)
        this.baseColor = `hsl(${hue}, 100%, 60%)`;
        this.color = this.baseColor;
        
        // Velocity
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.vz = Math.random() * 1 + 0.5;
        
        // Effects
        this.opacity = Math.random() * 0.8 + 0.2;
        this.pulseSpeed = Math.random() * 0.02 + 0.005;
        this.pulsePhase = Math.random() * Math.PI * 2;
      }

      update(deltaTime: number, mouseX: number, mouseY: number, isHovered: boolean) {
        // Move through 3D space
        this.x += this.vx * deltaTime;
        this.y += this.vy * deltaTime;
        this.z -= this.vz * deltaTime; // Moving toward viewer
        
        // Reset position when particle passes through screen
        if (this.z < 1) {
          this.z = 1000;
          this.x = (Math.random() - 0.5) * canvas.width;
          this.y = (Math.random() - 0.5) * canvas.height;
        }
        
        // Mouse interaction if hovered
        if (isHovered) {
          const dx = this.x - mouseX;
          const dy = this.y - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 150;
          
          if (dist < maxDist) {
            // Repel from mouse
            const force = (1 - dist / maxDist) * 0.2;
            this.vx += (dx / dist) * force;
            this.vy += (dy / dist) * force;
            
            // Limit velocity
            const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
            if (speed > 2) {
              this.vx = (this.vx / speed) * 2;
              this.vy = (this.vy / speed) * 2;
            }
          }
        }
        
        // Pulsating effect
        const pulse = Math.sin(this.pulsePhase) * 0.2 + 0.8;
        this.pulsePhase += this.pulseSpeed * deltaTime;
        
        // Update color with pulse
        const hue = parseInt(this.baseColor.slice(4), 10);
        this.color = `hsla(${hue}, 100%, ${60 + pulse * 10}%, ${this.opacity * pulse})`;
      }

      draw(ctx: CanvasRenderingContext2D) {
        // Calculate projected size based on z-position
        const scale = 900 / (900 + this.z);
        const projectedX = canvas.width / 2 + this.x * scale;
        const projectedY = canvas.height / 2 + this.y * scale;
        const projectedRadius = this.radius * scale * 1.5;
        
        // Only draw if on screen
        if (
          projectedX + projectedRadius > 0 &&
          projectedX - projectedRadius < canvas.width &&
          projectedY + projectedRadius > 0 &&
          projectedY - projectedRadius < canvas.height
        ) {
          // Glow effect
          const gradient = ctx.createRadialGradient(
            projectedX, projectedY, 0,
            projectedX, projectedY, projectedRadius * 2
          );
          gradient.addColorStop(0, this.color);
          gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
          
          ctx.beginPath();
          ctx.arc(projectedX, projectedY, projectedRadius * 2, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();
          
          // Core
          ctx.beginPath();
          ctx.arc(projectedX, projectedY, projectedRadius, 0, Math.PI * 2);
          ctx.fillStyle = this.color;
          ctx.fill();
          
          return {
            x: projectedX,
            y: projectedY,
            radius: projectedRadius,
            z: this.z,
            scale
          };
        }
        
        return null;
      }
    }

    // Create particles
    const particles: Particle3D[] = [];
    const createParticles = () => {
      particles.length = 0;
      const particleCount = Math.min(80, Math.floor((canvas.width * canvas.height) / 10000)); 
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle3D());
      }
    };

    // Animate particles
    let lastTime = 0;
    const animate = (timestamp: number) => {
      const deltaTime = timestamp - lastTime || 16.67;
      lastTime = timestamp;
      
      ctx.fillStyle = 'rgba(10, 15, 30, 0.2)'; // Dark blue with trail effect
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw all particles
      const visibleParticles = [];
      
      for (const particle of particles) {
        particle.update(
          deltaTime, 
          mousePosition.current.x, 
          mousePosition.current.y, 
          isHovered
        );
        
        const projectedParticle = particle.draw(ctx);
        if (projectedParticle) {
          visibleParticles.push(projectedParticle);
        }
      }
      
      // Draw connections in 3D space
      visibleParticles.sort((a, b) => b.z - a.z); // Sort by z-depth
      
      for (let i = 0; i < visibleParticles.length; i++) {
        const p1 = visibleParticles[i];
        
        // Connect to closest particles
        for (let j = i + 1; j < visibleParticles.length; j++) {
          const p2 = visibleParticles[j];
          const dx = p2.x - p1.x;
          const dy = p2.y - p1.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Scale connection distance threshold by z-position
          const connectionThreshold = 120 * Math.min(p1.scale, p2.scale);
          
          if (distance < connectionThreshold) {
            // Calculate opacity based on distance and z-position
            const opacity = (1 - distance / connectionThreshold) * 0.3 * Math.min(p1.scale, p2.scale);
            
            // Create gradient line
            const gradient = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
            gradient.addColorStop(0, `rgba(100, 200, 255, ${opacity})`);
            gradient.addColorStop(1, `rgba(150, 100, 255, ${opacity})`);
            
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = gradient;
            ctx.lineWidth = Math.min(p1.scale, p2.scale);
            ctx.stroke();
          }
        }
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };

    // Initialize
    setCanvasDimensions();
    createParticles();
    animationRef.current = requestAnimationFrame(animate);

    // Handle mouse movement
    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.current = {
        x: e.clientX,
        y: e.clientY
      };
    };

    // Handle window resize
    const handleResize = () => {
      setCanvasDimensions();
      createParticles();
    };

    // Event listeners
    window.addEventListener('resize', handleResize);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseenter', () => setIsHovered(true));
    canvas.addEventListener('mouseleave', () => setIsHovered(false));

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseenter', () => setIsHovered(true));
      canvas.removeEventListener('mouseleave', () => setIsHovered(false));
    };
  }, [isHovered]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10"
      style={{ 
        opacity: 1, // Full opacity for better effect
        background: 'linear-gradient(to bottom, #050510, #0a0a20)'
      }}
    />
  );
};

export default SimpleBackground;