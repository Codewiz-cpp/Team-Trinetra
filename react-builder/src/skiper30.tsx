"use client";

import { motion, MotionValue, useScroll, useTransform } from "framer-motion";
import Lenis from "lenis";
import SideRays from './SideRays';
import { useEffect, useRef, useState } from "react";

const images = [
  "images/p1.jpeg",
  "images/p2.jpeg",
  "images/p3.jpeg",
  "images/p21.jpeg",
  "images/p22.jpeg",
  "images/p23.jpeg",
  "images/p32.jpeg",
  "images/p31.jpeg",
  "images/p33.jpeg",
  "images/optimized/gazebo_sim.webp",
  "images/p41.png",
  "images/optimized/payload.webp",
];

const Skiper30 = () => {
  const gallery = useRef<HTMLDivElement>(null);
  const simTabRef = useRef<HTMLElement | null>(typeof document !== 'undefined' ? document.getElementById('sim-tab') : null);
  const [dimension, setDimension] = useState({ width: 0, height: 0 });

  const { scrollYProgress } = useScroll({
    target: gallery,
    container: simTabRef as React.RefObject<HTMLElement>,
    offset: ["start end", "end start"],
  });

  const { height } = dimension;
  const y = useTransform(scrollYProgress, [0, 1], [0, height * 2]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, height * 3.3]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, height * 1.25]);
  const y4 = useTransform(scrollYProgress, [0, 1], [0, height * 3]);

  useEffect(() => {
    const simTab = document.getElementById('sim-tab');
    const lenis = new Lenis({
      wrapper: simTab || window,
      content: document.getElementById('skiper30-root') || document.body,
    });

    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };

    const resize = () => {
      setDimension({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("resize", resize);
    requestAnimationFrame(raf);
    resize();

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <main className="relative w-full bg-black text-white">
      <div className="absolute top-0 left-0 w-full h-screen z-[5001] pointer-events-none overflow-hidden">
        <SideRays
          speed={2.5}
          rayColor1="#EAB308"
          rayColor2="#96c8ff"
          intensity={2}
          spread={1.9}
          origin="top-right"
          tilt={0}
          saturation={1.5}
          blend={0.8}
          falloff={1.7}
          opacity={1.0}
        />
      </div>
      <div className="absolute top-[163px] left-1/2 -translate-x-1/2 z-10 text-center w-full pointer-events-none flex flex-col items-center">
        <h1 style={{ fontFamily: 'gallery', fontSize: 'clamp(80px, 12vw, 250px)', fontWeight: 200, lineHeight: 1 }}>Galleria</h1>
        <p className="font-geist text-sm md:text-base uppercase tracking-[0.3em] text-gray-400 mt-4">The work behind the spotlight</p>
      </div>
      <div className="font-geist relative flex h-screen items-center justify-center gap-2">
        <div className="absolute left-1/2 bottom-[30px] grid -translate-x-1/2 content-start justify-items-center gap-6 text-center text-white z-20">
          <span className="relative text-xs uppercase leading-tight font-medium">
            SCROLL DOWN
          </span>
        </div>
      </div>

      <div
        ref={gallery}
        className="relative box-border flex h-[175vh] gap-[2vw] overflow-hidden bg-black p-[2vw]"
      >
        <Column images={[images[0], images[1], images[2]]} y={y} />
        <Column images={[images[3], images[4], images[5]]} y={y2} />
        <Column images={[images[6], images[7], images[8]]} y={y3} />
        <Column images={[images[9], images[10], images[11]]} y={y4} />
      </div>

      {/* Empty space to allow parallax to complete */}
      <div className="h-screen w-full"></div>

    </main>
  );
};

type ColumnProps = {
  images: string[];
  y: MotionValue<number>;
};

const Column = ({ images, y }: ColumnProps) => {
  return (
    <motion.div
      className="relative -top-[45%] flex h-full w-1/4 min-w-[250px] flex-col gap-[2vw] first:top-[-45%] [&:nth-child(2)]:top-[-95%] [&:nth-child(3)]:top-[-45%] [&:nth-child(4)]:top-[-75%]"
      style={{ y }}
    >
      {images.map((src, i) => (
        <div key={i} className="relative h-full w-full overflow-hidden">
          <img
            src={`${src}`}
            alt="image"
            className="pointer-events-none h-full w-full object-cover"
          />
        </div>
      ))}
    </motion.div>
  );
};

export { Skiper30 };

/**
 * Skiper 30 Parallax_002 — React + framer motion + lenis
 * Inspired by and adapted from https://www.siena.film/films/my-project-x
 * We respect the original creators. This is an inspired rebuild with our own taste and does not claim any ownership.
 * These animations aren’t associated with the siena.film . They’re independent recreations meant to study interaction design
 *
 * License & Usage:
 * - Free to use and modify in both personal and commercial projects.
 * - Attribution to Skiper UI is required when using the free version.
 * - No attribution required with Skiper UI Pro.
 *
 * Feedback and contributions are welcome.
 *
 * Author: @gurvinder-singh02
 * Website: https://gxuri.me
 * Twitter: https://x.com/Gur__vi
 */
