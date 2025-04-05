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

    const setCanvasDimensions = () => {
      const pixelRatio = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * pixelRatio;
      canvas.height = window.innerHeight * pixelRatio;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(pixelRatio, pixelRatio);
    };

    class Particle3D {
      x!: number;
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
        if (canvas) {
          this.x = canvas ? (Math.random() - 0.5) * canvas.width : 0;
        }
        this.y = canvas ? (Math.random() - 0.5) * canvas.height : 0;
        this.z = Math.random() * 1000;
        
        this.radius = Math.random() * 2 + 1;
        
        const hue = Math.random() * 60 + 180; 
        this.baseColor = `hsl(${hue}, 100%, 60%)`;
        this.color = this.baseColor;
        
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.vz = Math.random() * 1 + 0.5;
        
        this.opacity = Math.random() * 0.8 + 0.2;
        this.pulseSpeed = Math.random() * 0.02 + 0.005;
        this.pulsePhase = Math.random() * Math.PI * 2;
      }

      update(deltaTime: number, mouseX: number, mouseY: number, isHovered: boolean) {
        this.x += this.vx * deltaTime;
        this.y += this.vy * deltaTime;
        this.z -= this.vz * deltaTime;
        
        if (this.z < 1) {
          this.z = 1000;
          this.x = canvas ? (Math.random() - 0.5) * canvas.width : 0;
          this.y = canvas ? (Math.random() - 0.5) * canvas.height : 0;
        }
        
        if (isHovered) {
          const dx = this.x - mouseX;
          const dy = this.y - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 150;
          
          if (dist < maxDist) {
            const force = (1 - dist / maxDist) * 0.2;
            this.vx += (dx / dist) * force;
            this.vy += (dy / dist) * force;
            
            const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
            if (speed > 2) {
              this.vx = (this.vx / speed) * 2;
              this.vy = (this.vy / speed) * 2;
            }
          }
        }
        
        const pulse = Math.sin(this.pulsePhase) * 0.2 + 0.8;
        this.pulsePhase += this.pulseSpeed * deltaTime;
        
        const hue = parseInt(this.baseColor.slice(4), 10);
        this.color = `hsla(${hue}, 100%, ${60 + pulse * 10}%, ${this.opacity * pulse})`;
      }

      draw(ctx: CanvasRenderingContext2D) {
        const scale = 900 / (900 + this.z);
        const projectedX = canvas ? canvas.width / 2 + this.x * scale : 0;
        const projectedY = canvas ? canvas.height / 2 + this.y * scale : 0;
        const projectedRadius = this.radius * scale * 1.5;
        
        if (
          projectedX + projectedRadius > 0 &&
          canvas && projectedX - projectedRadius < canvas.width &&
          projectedY + projectedRadius > 0 &&
          projectedY - projectedRadius < canvas.height
        ) {
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

    const particles: Particle3D[] = [];
    const createParticles = () => {
      particles.length = 0;
      const particleCount = Math.min(80, Math.floor((canvas.width * canvas.height) / 10000)); 
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle3D());
      }
    };

    let lastTime = 0;
    const animate = (timestamp: number) => {
      const deltaTime = timestamp - lastTime || 16.67;
      lastTime = timestamp;
      
      ctx.fillStyle = 'rgba(10, 15, 30, 0.2)'; 
      ctx.fillRect(0, 0, canvas.width, canvas.height);
   
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
      
      visibleParticles.sort((a, b) => b.z - a.z); 
      
      for (let i = 0; i < visibleParticles.length; i++) {
        const p1 = visibleParticles[i];
        
        for (let j = i + 1; j < visibleParticles.length; j++) {
          const p2 = visibleParticles[j];
          const dx = p2.x - p1.x;
          const dy = p2.y - p1.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
    
          const connectionThreshold = 120 * Math.min(p1.scale, p2.scale);
          
          if (distance < connectionThreshold) {
            const opacity = (1 - distance / connectionThreshold) * 0.3 * Math.min(p1.scale, p2.scale);
          
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

    setCanvasDimensions();
    createParticles();
    animationRef.current = requestAnimationFrame(animate);

    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.current = {
        x: e.clientX,
        y: e.clientY
      };
    };

    const handleResize = () => {
      setCanvasDimensions();
      createParticles();
    };

    window.addEventListener('resize', handleResize);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseenter', () => setIsHovered(true));
    canvas.addEventListener('mouseleave', () => setIsHovered(false));

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
        opacity: 1, 
        background: 'linear-gradient(to bottom, #050510, #0a0a20)'
      }}
    />
  );
};

export default SimpleBackground;