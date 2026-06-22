import React from 'react';
import { createRoot } from 'react-dom/client';
import { ExpandableSponsorButton } from './ExpandableSponsorButton';

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

// Attach to window so it can be called from script.js after HTML injection
(window as any).mountSponsorButton = initSponsorButton;
