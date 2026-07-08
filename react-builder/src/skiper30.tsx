"use client";

import { motion, MotionValue, useScroll, useTransform } from "framer-motion";
import Lenis from "lenis";
import SideRays from './SideRays';
import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const images = [
  "images/p1.webp",
  "images/p2.webp",
  "images/p3.webp",
  "images/p21.webp",
  "images/p22.webp",
  "images/p23.webp",
  "images/p32.webp",
  "images/p31.webp",
  "images/p33.webp",
  "images/optimized/gazebo_sim.webp",
  "images/p41.webp",
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
      <div className="font-geist relative flex h-screen items-center justify-center gap-2 overflow-hidden">
        {/* Bottom-Aligned Masonry Layout (Images fall down to the floor, original sizes) */}
        <div className="absolute inset-0 z-0 flex items-end justify-center gap-[18px] p-[36px] pointer-events-none opacity-60 pb-[10vh] overflow-hidden">
          {/* Column 1 */}
          <div className="flex flex-col justify-end items-end gap-[18px]">
            <img src="images/g1.webp" alt="g1" className="h-auto max-h-[35vh] w-auto object-contain" />
            <img src="images/g2.webp" alt="g2" className="h-auto max-h-[35vh] w-auto object-contain" />
          </div>
          {/* Column 2 */}
          <div className="flex flex-col justify-end items-center gap-[18px]">
            <img src="images/Trinetrahome.webp" alt="Trinetrahome" className="h-auto max-h-[40vh] w-auto object-contain" />
            <img src="images/optimized/team.webp" alt="team" className="h-auto max-h-[45vh] w-auto object-contain" />
          </div>
          {/* Column 3 */}
          <div className="flex flex-col justify-end items-start gap-[18px]">
            <img src="images/g3.webp" alt="g3" className="h-auto max-h-[35vh] w-auto object-contain" />
          </div>
        </div>
        {/* Dark gradient overlay so left is more opaque than right */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 to-black/70 z-0"></div>

        <div className="absolute left-1/2 bottom-[30px] grid -translate-x-1/2 content-start justify-items-center gap-6 text-center text-white z-20">
          <span className="relative text-sm uppercase leading-tight font-light tracking-widest">
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

      {/* Spacer and Horizontal Video Scroll above Footer */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .swiper-button-next, .swiper-button-prev {
          font-weight: 900 !important;
          text-shadow: 0 0 5px rgba(0,0,0,0.8);
        }
      `}} />
      <div className="w-full relative pt-[10vh] pb-[5vh] z-10 bg-black overflow-hidden cursor-grab active:cursor-grabbing">
        <Swiper
          style={{
            "--swiper-navigation-color": "#fff",
            "--swiper-navigation-size": "24px",
          } as React.CSSProperties}
          modules={[Navigation]}
          navigation={true}
          loop={true}
          slidesPerView="auto"
          spaceBetween={80}
          centeredSlides={true}
          className="w-full"
        >
          {/* Slide 1: Jetson Orin NX */}
          <SwiperSlide className="!w-[85vw] max-w-[1200px]">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-[0_0_10%] pt-[5px]">
                <span style={{ fontFamily: "'Elios Regular', sans-serif" }} className="text-[15px] tracking-[2px] text-white/35 whitespace-nowrap">01 / 03</span>
              </div>
              <div className="flex-[0_0_40%] flex flex-col gap-[15px] pt-[2px] whitespace-normal">
                <div style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }} className="text-[20px] font-bold tracking-[2px] uppercase text-white leading-none">
                  Jetson Orin NX
                </div>
                <div className="flex flex-col gap-[10px]">
                  <p style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }} className="text-[18px] font-light text-white/75 leading-[1.68] m-0">
                    Moksh explains our transition to the Jetson Orin NX. We utilize its incredible edge AI performance to process high-resolution LiDAR and optical data simultaneously.
                  </p>
                  <p style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }} className="text-[18px] font-light text-white/75 leading-[1.68] m-0">
                    This powerful compute module is the brain of Mayoor, enabling real-time obstacle avoidance, precision payload drops, and advanced autonomous path planning.
                  </p>
                </div>
              </div>
              <div className="flex-1 flex justify-center md:justify-end w-full">
                <iframe
                  src="https://drive.google.com/file/d/175YMYJNa_usICNy6SWrrRcjPywvceDVe/preview"
                  className="w-full max-w-[320px] aspect-[9/16] rounded-xl border-none shadow-2xl"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </SwiperSlide>

          {/* Slide 2: Loiter Auto */}
          <SwiperSlide className="!w-[85vw] max-w-[1200px]">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-[0_0_10%] pt-[5px]">
                <span style={{ fontFamily: "'Elios Regular', sans-serif" }} className="text-[15px] tracking-[2px] text-white/35 whitespace-nowrap">02 / 03</span>
              </div>
              <div className="flex-[0_0_40%] flex flex-col gap-[15px] pt-[2px] whitespace-normal">
                <div style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }} className="text-[20px] font-bold tracking-[2px] uppercase text-white leading-none">
                  Autonomous Loiter
                </div>
                <div className="flex flex-col gap-[10px]">
                  <p style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }} className="text-[18px] font-light text-white/75 leading-[1.68] m-0">
                    Early field testing of our autonomous loiter capabilities. We verified the drone's ability to maintain a rock-solid position hold and altitude under dynamic crosswinds.
                  </p>
                </div>
              </div>
              <div className="flex-1 flex justify-end w-full">
                <iframe
                  src="https://drive.google.com/file/d/1xz_wz6I6Mvcvr-mVrlT7VaXCvZVnIURV/preview"
                  className="w-full max-w-[600px] aspect-video rounded-xl border-none shadow-2xl bg-[#111]"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </SwiperSlide>

          {/* Slide 3: ESRI Integration */}
          <SwiperSlide className="!w-[85vw] max-w-[1200px]">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-[0_0_10%] pt-[5px]">
                <span style={{ fontFamily: "'Elios Regular', sans-serif" }} className="text-[15px] tracking-[2px] text-white/35 whitespace-nowrap">03 / 03</span>
              </div>
              <div className="flex-[0_0_40%] flex flex-col gap-[15px] pt-[2px] whitespace-normal">
                <div style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }} className="text-[20px] font-bold tracking-[2px] uppercase text-white leading-none">
                  ESRI Mapping
                </div>
                <div className="flex flex-col gap-[10px]">
                  <p style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }} className="text-[18px] font-light text-white/75 leading-[1.68] m-0">
                    A brief look at our ESRI mapping software integration. This system allows us to generate extremely precise waypoints and digital elevation models for the flight area.
                  </p>
                </div>
              </div>
              <div className="flex-1 flex justify-end w-full">
                <iframe
                  src="https://drive.google.com/file/d/1utohRBS6-_Ky6VVxCwMF_ZywwugGIWv0/preview"
                  className="w-full max-w-[600px] aspect-video rounded-xl border-none shadow-2xl bg-[#111]"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>

      {/* ── Site Footer ── */}
      <footer id="sp-footer" className="relative z-50">
        <div id="sp-footer-inner">
          <div id="sp-footer-left">
            <div id="sp-footer-brand">
              <img src="Trinetra.svg" alt="Trinetra Logo" className="sp-footer-logo" />
              <span className="sp-footer-brand-name">TRINETRA</span>
            </div>
            <div className="sp-footer-copyright">COPYRIGHT &copy; 2026 TEAM TRINETRA</div>
          </div>
          <div id="sp-footer-cols">
            <div className="sp-footer-col">
              <h4 className="sp-footer-col-head">SOCIAL</h4>
              <ul className="sp-footer-links">
                <li><a href="https://www.instagram.com/trinetra_team/" className="sp-footer-link">Instagram</a></li>
                <li><a href="#" className="sp-footer-link">LinkedIn</a></li>
                <li><a href="#" className="sp-footer-link">YouTube</a></li>
                <li><a href="#" className="sp-footer-link">X / Twitter</a></li>
              </ul>
            </div>
            <div className="sp-footer-col">
              <h4 className="sp-footer-col-head">CONTACT</h4>
              <ul className="sp-footer-links">
                <li><a href="mailto:team.trinetra2026@gmail.com" className="sp-footer-link">team.trinetra2026@gmail.com</a></li>
                <li><a href="#" className="sp-footer-link">Sponsor Enquiries</a></li>
                <li><a href="#" className="sp-footer-link">Join the Team</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
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
