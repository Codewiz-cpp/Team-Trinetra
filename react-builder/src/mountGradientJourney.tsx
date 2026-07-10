import React from 'react';
import { createRoot } from 'react-dom/client';
import GradientText from './GradientText';

const el = document.getElementById('gradient-journey-root');
if (el) {
  const root = createRoot(el);
  root.render(
    <GradientText
      colors={["#0eb880","#42edb4","#d7ece6"]}
      animationSpeed={3}
      showBorder={false}
      className="custom-class"
    >
      Journey
    </GradientText>
  );
}
