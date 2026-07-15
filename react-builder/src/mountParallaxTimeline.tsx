import React from 'react';
import { createRoot } from 'react-dom/client';
import { Skiper19 } from './ParallaxTimeline';

const container = document.getElementById('skiper19-root');
if (container) {
  const root = createRoot(container);
  root.render(<Skiper19 />);
}
