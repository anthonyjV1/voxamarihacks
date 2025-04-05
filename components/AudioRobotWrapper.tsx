'use client';

import AudioRobot from './AudioRobot';

interface AudioRobotWrapperProps {
  imageSrc: string;
  audioSrc: string | string[];
  width?: number;
  height?: number;
  alt?: string;
  className?: string;
}

export default function AudioRobotWrapper(props: AudioRobotWrapperProps) {
  return <AudioRobot {...props} />;
}