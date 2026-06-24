import React from 'react';
import { createRoot } from 'react-dom/client';
import { ExpandableSponsorButton } from './ExpandableSponsorButton';
import { BentoSubtitleWrapper } from './BentoSubtitleWrapper';

function initSponsorButton() {
  const container = document.getElementById('react-sponsor-button-root');
  if (container) {
    if (!container.hasChildNodes()) {
      const root = createRoot(container);
      root.render(<ExpandableSponsorButton />);
    }
  } else {
    console.warn("Could not find '#react-sponsor-button-root' to mount the React component.");
  }
}

function initBentoSubtitles() {
  const bentoItems = document.querySelectorAll('.bento-item');
  bentoItems.forEach((item) => {
    const subtitleEl = item.querySelector('.bento-subtitle');
    if (subtitleEl && !subtitleEl.hasAttribute('data-react-mounted')) {
      const text = subtitleEl.textContent || '';
      subtitleEl.textContent = ''; // clear text
      const root = createRoot(subtitleEl);
      root.render(<BentoSubtitleWrapper text={text} parentElement={item as HTMLElement} />);
      subtitleEl.setAttribute('data-react-mounted', 'true');
    }
  });
}

// Attach to window so it can be called from script.js after HTML injection
(window as any).mountSponsorButton = initSponsorButton;
(window as any).mountBentoSubtitles = initBentoSubtitles;

// Initialize on load
initBentoSubtitles();
