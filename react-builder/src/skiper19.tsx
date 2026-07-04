"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import React, { useRef, useState, useEffect } from "react";
import { annotate } from "rough-notation";

const timelineData = [
  { date: "DECEMBER 19, 2025", title: "The Foundation of Dronex", description: "The club Dronex was officially founded with just 4 members, united by a shared vision and hope to help aerial systems achieve greater heights." },
  { date: "FEBRUARY 21, 2026", title: "Team Expansion and Collaboration at AARUNYA", description: "Coinciding with our college fest, AARUNYA, the team grew to 15 members. During the fest, we connected with VyomDrones Pvt. Ltd., who provided us with high-end drones to showcase to the campus, a breakthrough that helped us significantly expand our horizons." },
  { date: "MARCH 15, 2026", title: "Setting Sights on SUAS 2026 and Securing Sponsorship", description: "We centered our core focus on preparing for the SUAS 2026 competition. Recognizing our potential, VyomDrones Pvt. Ltd. officially became our sponsors, placing their belief in our vision and promising to provide the essential components and parts for our drone." },
  { date: "MARCH 20, 2026", title: "The Birth of Team Trinetra", description: "Team Trinetra was officially born, established with a dual mission: saving lives through aerial innovation and competing in SUAS 2026. With the team members selected and technical domains fully locked in, the only hurdle left was to arrange the registration fee." },
  { date: "MARCH 29, 2026", title: "A Lifeline Extended and Registration Secured", description: "With only a few days left before the final April 1st deadline, our sponsors, VyomDrones Pvt. Ltd., stepped in to pay the registration fees. This crucial moment didn't just solidify our entry into the competition; it forged an unbreakable bond of trust and partnership between us." },
  { date: "APRIL 16, 2026", title: "Deconstructing the Competition: Inside and Out", description: "In the days following our registration, the team plunged into relentless, non-stop research and strategic meetings to map out the best path forward. We thoroughly dissected every single SUAS document, meticulously analyzing past participants' websites and technical design reports to truly master the blueprint of the competition." },
  { date: "APRIL 24, 2026", title: "The First Step into Reality: Our Initial Prototype", description: "We successfully assembled our first prototype using the drone framework provided by VyomDrones to develop a deeper, hands-on understanding of the project's technical complexities. While it lacked advanced onboard components like the LiDAR, camera, and Jetson, getting this initial build off the ground was a massive milestone and achievement for our team." },
  { date: "MAY 1, 2026", title: "Engineering the Core: Custom Design and 3D Printing", description: "Kuldeep began spearheading the design of our custom frame, pulley mechanism, and payloads. To kick off physical testing, we 3D-printed our first beacon component to evaluate its structural integrity and see exactly how it would hold up against the impact of ground landings." },
  { date: "MAY 15, 2026", title: "Simulating the Skies and Building our Digital Presence", description: "The technical backbone of the project began taking shape on two fronts. Moksh initiated the integration of our complex software stack — setting up Gazebo, ROS2, the ardupilot_gazebo bridge, ArduPilot SITL, and building Mission Planner from source alongside gimbal and camera systems. Simultaneously, Aryan began building out our team website section by section to document and share our journey with the world." },
  { date: "MAY 24, 2026", title: "Alignment, Architecture, and a Bold Design Pivot", description: "After dozens of collaborative meetings with VyomDrones and exhaustive internal team alignments, we locked onto our true trajectory — finalizing the payload dropping mechanism and pinpointing our exact hardware requirements. However, the website took an exciting turn when Ankit proposed shifting the entire theme to mirror the legendary ArduPilot ecosystem. Embracing the idea, Aryan pivoted, retaining the structural framework while completely rebuilding a fresh, high-tech atmosphere from scratch." },
  { date: "MAY 31, 2026", title: "Virtual Success, Lightweight Hardware, and First Deployment", description: "The end of the month marked major milestones across the board. Moksh completely finalized the software simulation stack, leaving everything primed and ready to be deployed onto the Jetson Orin NX hardware. Meanwhile, Kuldeep perfected the drone plate designs, achieving a flawless balance of structural stability and lightweight efficiency. To tie it all together, the redesigned ArduPilot-themed website was successfully brought to life and officially hosted on Vercel." },
  { date: "JUNE 2, 2026", title: "From Height Tests to the Skies: Our First Flight", description: "We took our prototype to the skies for its very first flight test, graduating from dropping beacons off building heights to real-time aerial testing. Conducted under the expert guidance of Raj Vardhan Sir from VyomDrones and our faculty coordinator, Dr. Yashwant Sawle, the flight was a massive success. However, behind the screens, a new challenge emerged. Looking at the freshly hosted site, Aryan realized that basing the theme on ArduPilot's classic look accidentally gave the website an antique feel — miles away from the cutting-edge, high tech vibe a drone team needs. Driven to fix it, he quietly set out to make a radical set of final changes completely on his own." },
  { date: "JUNE 12, 2026", title: "Wearing Pride, Assembling Power, and the Final Countdown", description: "The team finally received our official custom t-shirts, designed to represent our identity, our club, and our country all at once. Simultaneously, the final high-end drone components arrived, and Parth, Harsh, and Rishabh joined forces to design a fully custom Power Distribution Board (PDB) tailored specifically for our system. With our armor ready and our custom hardware locked in, we were finally prepared to put everything into motion for the main event." },
  { date: "JUNE 15, 2026", title: "Dissecting the Guidelines and Building Custom Power", description: "We closely studied the highly productive discussions on Discord between teams and the SUAS organizers, which gave us absolute clarity for our upcoming Flight Readiness Video submission. To ensure we didn't miss a single detail, we analyzed other teams' videos on YouTube and thoroughly re-reviewed the official guidelines. Simultaneously, we successfully completed spot-welding our custom battery packs. With the power system locked in, our final competition drone was fully assembled, ready to fly, and primed for the camera." },
  { date: "JUNE 18, 2026", title: "Lights, Camera, Action: The Flight Readiness Shoot", description: "Shoot day finally arrived, and it was an outstanding experience from start to finish. We proudly christened our final competition drone Mayoor, which took to the skies with Ankit at the controls as our official pilot. We strictly executed our pre-flight inspections — checking battery health, validating failsafes, and establishing a rigorous safety perimeter to guarantee a completely secure testing environment. With Mayoor's successful aerial footage captured, we decided to handle the final editing and secure validation from our sponsors before submitting the video the following day." },
  { date: "JUNE 20, 2026", title: "A Small Victory: Securing our Flight Order", description: "We finally got our official flight order. It might seem like a small thing, but to us, it felt like a huge win that we just couldn't keep to ourselves. It was such a great day — seeing our team's name on that list made all the sleepless nights and hard work over the past three months feel completely worth it." },
  { date: "JUNE 28, 2026", title: "Spreading the Word and Putting on the Finishing Touches", description: "With the heavy engineering and video submissions behind us, we took a moment to breathe and focus our energy on our social media channels, sharing our journey and insights with the wider community. A brief rest was definitely well-deserved. Meanwhile, the website was running incredibly smoothly, with the structural layout functioning perfectly and the new aesthetic beautifully integrated across every single page." }
];

const TimelineCard = ({ data, index }) => {
  const [expanded, setExpanded] = useState(false);

  // Alternate sides for a balanced look
  const isLeft = index % 2 === 0;

  // Calculate top offset with massive gap to prevent collision
  const yStart = 50;
  const yEnd = 3950;
  const yPos = yStart + (index / (timelineData.length - 1)) * (yEnd - yStart);

  return (
    <div
      style={{
        position: 'absolute',
        top: `${yPos}px`,
        left: '50%',
        width: '45vw',
        minWidth: '350px',
        maxWidth: '750px',
        zIndex: expanded ? 50 : 10,
        pointerEvents: "auto",
        fontFamily: "'Helvetica Neue', sans-serif",
        // Fixed Y transform (0) ensures connector NEVER moves when expanding
        transform: isLeft ? "translate(calc(-100% - 40px), 0)" : "translate(40px, 0)",
        scrollSnapAlign: 'center',
      }}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      onClick={() => setExpanded(!expanded)}
    >
      {/* Connector line fixed to the Date height */}
      <div
        style={{
          position: 'absolute',
          top: '12px',
          [isLeft ? 'right' : 'left']: '-40px',
          width: '40px',
          height: '2px',
          backgroundColor: 'rgba(255,255,255,0.2)',
        }}
      />
      {/* Connector dot on the line */}
      <div
        style={{
          position: 'absolute',
          top: '13px',
          [isLeft ? 'right' : 'left']: '-44px',
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: '#00D084',
          transform: 'translateY(-50%)',
          boxShadow: '0 0 10px rgba(0,208,132,0.8)'
        }}
      />

      <div className="relative cursor-pointer transition-opacity duration-300 opacity-80 hover:opacity-100">
        <div className={`flex flex-col ${isLeft ? 'text-right' : 'text-left'}`}>
          <div className="text-white tracking-wide leading-snug">
            <span className="font-semibold tracking-wider text-sm md:text-base text-[#00D084]" style={{ fontFamily: "'Helvetica Neue', sans-serif" }}>{data.date}</span>
            <div className="font-bold text-xl md:text-3xl mt-1" style={{ fontFamily: "'Helvetica Neue', sans-serif" }}>{data.title}</div>
          </div>
        </div>

        <div
          className={`grid transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1.0)] ${expanded ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0 mt-0'}`}
        >
          <div className="overflow-visible">
            <p className={`text-gray-300 text-base md:text-lg leading-relaxed font-light ${isLeft ? 'pr-5 border-r border-[#00D084]/40' : 'pl-5 border-l border-[#00D084]/40'}`} style={{ fontFamily: "'Helvetica Neue', sans-serif" }}>
              {data.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Skiper19 = () => {
  const containerRef = useRef(null);
  const [lineStartY, setLineStartY] = useState(0);
  
  // Draw the rough notation circle on mount
  useEffect(() => {
    const el = document.getElementById('annotate-journey');
    const container = containerRef.current;
    
    if (el && container) {
      // Small timeout ensures fonts have loaded and bounding box is correct
      setTimeout(() => {
        const annotation = annotate(el, { type: 'circle', color: '#00D084', strokeWidth: 4, padding: [10, 20] });
        annotation.show();
        
        // Calculate the bottom circumference of the circle relative to this container
        const elRect = el.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        setLineStartY(elRect.bottom - containerRect.top);
      }, 500);

      const handleResize = () => {
        const elRect = el.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        setLineStartY(elRect.bottom - containerRect.top);
      };
      
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  // Track scroll exactly within the bounds of this component container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 85%", "end bottom"]
  });

  // Smooth out the drawing
  const pathLength = useSpring(scrollYProgress, { stiffness: 50, damping: 20 });

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100vw", left: "50%", transform: "translateX(-50%)", height: "4400px", marginTop: "40px" }}>

      {/* Background faint vertical line */}
      <div
        style={{
          position: "absolute",
          top: "0",
          bottom: "0",
          left: "50%",
          width: "2px",
          backgroundColor: "rgba(255,255,255,0.05)",
          transform: "translateX(-50%)",
          zIndex: 0
        }}
      />

      {/* Animated vertical line */}
      <svg
        width="4"
        height="4400"
        viewBox="0 0 4 4400"
        fill="none"
        style={{ position: "absolute", top: "0", left: "50%", transform: "translateX(-50%)", zIndex: 1, overflow: "visible" }}
      >
        <motion.line
          x1="2"
          y1={lineStartY}
          x2="2"
          y2="4400"
          stroke="#00D084"
          strokeWidth="4"
          style={{ pathLength }}
        />
      </svg>

      {/* Cards container */}
      <div style={{ position: "absolute", top: "0", left: "0", width: "100%", height: "4400px", zIndex: 10 }}>
        {timelineData.map((data, idx) => (
          <TimelineCard key={idx} data={data} index={idx} />
        ))}
      </div>
    </div>
  );
};

export { Skiper19 };
