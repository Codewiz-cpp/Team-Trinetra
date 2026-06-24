import React, { useEffect, useState } from 'react';
import { TextRoll } from './TextRoll';

export const BentoSubtitleWrapper: React.FC<{ text: string; parentElement: HTMLElement }> = ({ text, parentElement }) => {
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    parentElement.addEventListener('mouseenter', handleMouseEnter);
    parentElement.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      parentElement.removeEventListener('mouseenter', handleMouseEnter);
      parentElement.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [parentElement]);

  return <TextRoll isHovered={isHovered} center={false}>{text}</TextRoll>;
};
