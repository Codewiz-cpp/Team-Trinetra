"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import React, { useRef, useState, useEffect } from "react";

const timelineData = [
  {
    title: "DroneX Club and VyomDrones",
    description: "Every great engineering story is written in the language of the problems it had to solve. For us, stepping onto the international stage for SUAS 2026 meant building specialized technical baselines completely from the ground up. We found our footing by combining the foundational energy of the DroneX Club with a crucial partnership with VyomDrones, which opened the doors to advanced hardware testing like the Jetson Orin NX and LiDAR systems."
  },
  {
    title: "Choosing Our Wings",
    description: "With the workspace secured, our first major design fork was deciding on the perfect aircraft configuration. The competition demanded a system capable of stable flight, high payload capacity, and autonomous accuracy. After endless technical report analysis and intense debates, we mapped the exact trade-offs required to lock in the ultimate flight strategy for the mission profile."
  },
  {
    title: "Structural Weight Optimization",
    description: "Once the architectural concept was set, the physical battle against weight optimization began. The drone had to lift serious payloads while remaining incredibly agile and strictly within the competition's weight threshold. Kuldeep tackled this head-on by continually trimming out mass through custom frame iterations to achieve a beautiful equilibrium of structural stability and featherlight efficiency."
  },
  {
    title: "Iterating the Payload Pulley",
    description: "This structural evolution paved the way for our custom payload delivery mechanism. Dropping ground beacons successfully required a reliable deployment system that could handle landing impacts without mechanical failure. Early tests involved dropping dummy beacons from building roofs, but after a string of mechanical pulley iterations, we graduated to flawless, real-time aerial drops under professional industry guidance.",
    images: ["images/Gallery/16.webp", "images/Gallery/17.webp"]
  },
  {
    title: "Front and Back Plate Evolution",
    description: "Simultaneously, we wrestled with the frame geometry itself, pushing through multiple front and back plate iterations. Securing custom components like the battery, PDB, and processing units required precise frame plates that wouldn't warp or flex under operational stress. This relentless push for optimization guaranteed our core electronic layout remained secure under pressure."
  },
  {
    title: "Refining the Digital Front",
    description: "Our optimization extended far beyond the hardware and into our public face. The website went through three complete thematic overhauls—evolving from a blank canvas to an old-school ArduPilot layout that felt too antique, before I stepped in to entirely rewrite the frontend into the premium, high-tech interface it is today."
  },
  {
    title: "Spot-Welding the 6S6P Battery",
    description: "The final milestones brought our heaviest engineering breakthroughs. Off-the-shelf power options couldn't meet our endurance requirements, so we custom-built our own battery packs, splitting and spot-welding a massive 6S6P cell structure to safely deliver high current within strict competition parameters."
  },
  {
    title: "Custom Vision Integration",
    description: "At the same moment, the brain of the drone was coming alive. Real-time object detection and classification required seamless communication between the onboard camera systems, a tracking gimbal, and the processing stack. Moksh seamlessly bridged the ROS2 and Gazebo simulation stack with our tracking hardware, training our vision algorithms on a custom-built dataset to ensure our drone could think and detect with absolute precision mid-flight."
  },
];

const TimelineCard = ({ data, index, isMobile }: { data: any, index: number, isMobile?: boolean }) => {
  const isLeft = isMobile ? false : index % 2 === 0;

  // Generous spacing per entry so picture slots are comfortable
  const yStart = 60;
  const yEnd = isMobile ? 4800 : 2400;
  let yPos = yStart + (index / (timelineData.length - 1)) * (yEnd - yStart);

  // Shift items down after the one with images (index 3)
  if (index > 3) {
    yPos += isMobile ? 300 : 250;
  }

  const leftPos = isMobile ? '30px' : '50%';
  const transformVal = isMobile
    ? "translate(30px, 0)"
    : (isLeft ? "translate(calc(-100% - 60px), 0)" : "translate(60px, 0)");
  const minW = isMobile ? '260px' : '350px';
  const wVal = isMobile ? 'calc(100vw - 80px)' : '42vw';
  const connectorWidth = isMobile ? '30px' : '60px';
  const connectorOffset = isMobile ? '-30px' : '-60px';
  const dotOffset = isMobile ? '-34px' : '-64px';

  return (
    <div
      style={{
        position: 'absolute',
        top: `${yPos}px`,
        left: leftPos,
        width: wVal,
        minWidth: minW,
        maxWidth: '700px',
        zIndex: 10,
        pointerEvents: "auto",
        fontFamily: "'Helvetica Neue', sans-serif",
        transform: transformVal,
        scrollSnapAlign: 'center',
      }}
    >
      {/* Connector line — runs from the card edge to the midline */}
      <div
        style={{
          position: 'absolute',
          top: '13px',
          [isLeft ? 'right' : 'left']: connectorOffset,
          width: connectorWidth,
          height: '2px',
          backgroundColor: '#00D084',
          opacity: 0.5,
        }}
      />
      {/* Glowing dot on the midline */}
      <div
        style={{
          position: 'absolute',
          top: '13px',
          [isLeft ? 'right' : 'left']: dotOffset,
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          backgroundColor: '#00D084',
          transform: 'translateY(-50%)',
          boxShadow: '0 0 14px rgba(0,208,132,0.9)',
        }}
      />

      <div className="relative">
        {/* Heading — green, no number prefix */}
        <div className={`flex flex-col ${isLeft ? 'text-right' : 'text-left'}`}>
          <h2
            style={{
              fontFamily: "'Helvetica Neue', sans-serif",
              fontSize: 'clamp(18px, 2vw, 26px)',
              fontWeight: 700,
              color: '#00D084',
              margin: 0,
              lineHeight: 1.2,
              letterSpacing: '-0.01em',
            }}
          >
            {data.title}
          </h2>
        </div>

        {/* Paragraph */}
        <div style={{ marginTop: '18px' }}>
          <p
            className={`${isLeft ? 'text-left' : 'text-left'}`}
            style={{
              fontFamily: "'Helvetica Neue', sans-serif",
              fontSize: 'clamp(15px, 1.2vw, 18px)',
              fontWeight: 300,
              lineHeight: 1.8,
              margin: 0,
              color: '#ffffff',
            }}
          >
            {data.description}
          </p>
        </div>

        {/* Images */}
        {data.images && (
          <div className="flex flex-wrap gap-4 mt-8">
            {data.images.map((img: string, i: number) => (
              <img key={i} src={img} alt={`${data.title} - ${i}`} className="w-[45%] md:w-[48%] object-cover" />
            ))}
          </div>
        )}

        {/* Extra breathing room below */}
        <div style={{ height: '80px' }} />
      </div>
    </div>
  );
};

const Skiper19 = () => {
  const containerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 85%", "end end"]
  });

  const pathLength = useSpring(scrollYProgress, { stiffness: 50, damping: 20 });

  const containerHeight = isMobile ? 5700 : 3150;

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100vw", left: "50%", transform: "translateX(-50%)", height: `${containerHeight}px`, marginTop: "40px" }}>

      {/* Faint background midline */}
      <div
        style={{
          position: "absolute",
          top: "0",
          bottom: "0",
          left: isMobile ? "30px" : "50%",
          width: "2px",
          backgroundColor: "rgba(255,255,255,0.05)",
          transform: "translateX(-50%)",
          zIndex: 0
        }}
      />

      {/* Animated green fill line */}
      <svg
        width="4"
        height={containerHeight}
        viewBox={`0 0 4 ${containerHeight}`}
        fill="none"
        style={{ position: "absolute", top: "0", left: isMobile ? "30px" : "50%", transform: "translateX(-50%)", zIndex: 1, overflow: "visible" }}
      >
        <motion.line
          x1="2"
          y1={0}
          x2="2"
          y2={containerHeight}
          stroke="#00D084"
          strokeWidth="3"
          style={{ pathLength }}
        />
      </svg>

      {/* Cards */}
      <div style={{ position: "absolute", top: "0", left: "0", width: "100%", height: `${containerHeight}px`, zIndex: 10 }}>
        {timelineData.map((data, idx) => (
          <TimelineCard key={idx} data={data} index={idx} isMobile={isMobile} />
        ))}
      </div>
    </div>
  );
};

export { Skiper19 };
