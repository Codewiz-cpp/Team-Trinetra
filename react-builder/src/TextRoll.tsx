import React from 'react';
import { motion } from 'framer-motion';

const STAGGER = 0.015;

export const TextRoll: React.FC<{
  children: string;
  className?: string;
  center?: boolean;
  isHovered: boolean;
}> = ({ children, className, center = false, isHovered }) => {
  return (
    <motion.span
      initial="initial"
      animate={isHovered ? "hovered" : "initial"}
      className={className || ''}
      style={{
        position: 'relative',
        display: 'block',
        overflow: 'hidden',
        lineHeight: 1.4, // changed from 0.75 to match bento subtitle design
      }}
    >
      <div>
        {children.split("").map((l, i) => {
          const delay = center
            ? STAGGER * Math.abs(i - (children.length - 1) / 2)
            : STAGGER * i;

          return (
            <motion.span
              variants={{
                initial: { y: 0 },
                hovered: { y: "-100%" },
              }}
              transition={{ ease: "easeInOut", delay, duration: 0.15 }}
              style={{ display: 'inline-block', whiteSpace: 'pre' }}
              key={i}
            >
              {l === " " ? "\u00A0" : l}
            </motion.span>
          );
        })}
      </div>
      <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}>
        {children.split("").map((l, i) => {
          const delay = center
            ? STAGGER * Math.abs(i - (children.length - 1) / 2)
            : STAGGER * i;

          return (
            <motion.span
              variants={{
                initial: { y: "100%" },
                hovered: { y: 0 },
              }}
              transition={{ ease: "easeInOut", delay, duration: 0.15 }}
              style={{ display: 'inline-block', whiteSpace: 'pre' }}
              key={i}
            >
              {l === " " ? "\u00A0" : l}
            </motion.span>
          );
        })}
      </div>
    </motion.span>
  );
};
