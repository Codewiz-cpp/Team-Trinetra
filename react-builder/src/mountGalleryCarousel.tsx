import React from 'react';
import { createRoot } from 'react-dom/client';
import { Skiper30 } from './GalleryCarousel';

const container = document.getElementById('skiper30-root');
const simTab = document.getElementById('sim-tab');

if (container && simTab) {
  const observer = new IntersectionObserver((entries) => {
    if (entries[0]?.isIntersecting) {
      observer.disconnect();
      const root = createRoot(container);
      root.render(<Skiper30 />);
    }
  });
  observer.observe(simTab);
}
