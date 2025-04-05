'use client';

import { useRef } from 'react';
import Image from 'next/image';

interface AudioRobotProps {
  imageSrc: string;
  audioSrc: string | string[];
  width?: number;
  height?: number;
  alt?: string;
  className?: string;
}

const AudioRobot = ({
  imageSrc,
  audioSrc,
  width = 400,
  height = 400,
  alt = "robot",
  className = "",
}: AudioRobotProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioFiles = Array.isArray(audioSrc) ? audioSrc : [audioSrc];
  
  const getRandomAudio = () => {
    const randomIndex = Math.floor(Math.random() * audioFiles.length);
    return audioFiles[randomIndex];
  };

  const handleClick = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }

    const randomAudio = getRandomAudio();
    audioRef.current = new Audio(randomAudio);
    
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(err => {
      console.error("Error playing audio:", err);
    });
  };
  
  return (
    <div className="cursor-pointer" onClick={handleClick}>
      <Image 
        src={imageSrc} 
        alt={alt} 
        width={width} 
        height={height} 
        className={className}
      />
    </div>
  );
};

export default AudioRobot;