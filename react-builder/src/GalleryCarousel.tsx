"use client";

import { motion, MotionValue, useScroll, useTransform } from "framer-motion";
import Lenis from "lenis";
// @ts-ignore
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

const galleryPhotos = [
  "images/Gallery/1.webp",
  "images/Gallery/11.webp",
  "images/Gallery/12.webp",
  "images/Gallery/13.webp",
  "images/Gallery/14.webp",
  "images/Gallery/15.webp",
  "images/Gallery/16.webp",
  "images/Gallery/17.webp",
  "images/Gallery/18.webp",
  "images/Gallery/19.webp",
  "images/Gallery/2.webp",
  "images/Gallery/21.webp",
  "images/Gallery/22.webp",
  "images/Gallery/23.webp",
  "images/Gallery/24.webp",
  "images/Gallery/25.webp",
  "images/Gallery/26.webp",
  "images/Gallery/3.webp",
  "images/Gallery/4.webp",
  "images/Gallery/5.webp",
  "images/Gallery/7.webp",
  "images/Gallery/g31.jpeg",
  "images/Gallery/g32.jpeg",
  "images/Gallery/g33.jpeg",
  "images/Gallery/g34.jpeg",
  "images/Gallery/g35.jpeg",
  "images/Gallery/g36.jpeg",
  "images/Gallery/g37.jpeg",
  "images/Gallery/g38.jpeg",
  "images/Gallery/g39.jpeg",
  "images/Gallery/g40.jpeg",
  "images/Gallery/g41.jpeg",
];

const Skiper30 = () => {
  const gallery = useRef<HTMLDivElement>(null);
  const simTabRef = useRef<HTMLElement | null>(typeof document !== 'undefined' ? document.getElementById('sim-tab') : null);
  const [dimension, setDimension] = useState({ width: 0, height: 0 });
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const photoLibraryScrollRef = useRef<HTMLDivElement>(null);

  const scrollLibrary = (direction: 'left' | 'right') => {
    if (photoLibraryScrollRef.current) {
      const scrollAmount = window.innerWidth * 0.5;
      photoLibraryScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

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
      <div className="absolute top-[50vh] md:top-[163px] left-1/2 -translate-x-1/2 -translate-y-1/2 md:translate-y-0 z-[60] text-center w-full pointer-events-none flex flex-col items-center">
        <h1 style={{ fontFamily: 'gallery', fontSize: 'clamp(80px, 12vw, 250px)', fontWeight: 200, lineHeight: 1 }}>Galleria</h1>
        <p className="font-geist text-sm md:text-base uppercase tracking-[0.3em] text-gray-400 mt-4">The work behind the spotlight</p>
      </div>
      <div className="font-geist relative flex h-screen items-center justify-center gap-2 overflow-hidden">
        {/* Bottom-Aligned Masonry Layout (Images fall down to the floor, original sizes) */}
        <div className="absolute inset-0 z-0 flex items-end justify-center gap-[18px] p-[36px] pointer-events-none opacity-60 pb-[10vh] overflow-hidden">
          {/* Column 1 */}
          <div className="flex flex-col justify-end items-end gap-[18px]">
            <img src="images/g1.webp" alt="g1" className="h-auto max-h-[35vh] max-w-[40vw] md:max-w-none w-auto object-contain" />
            <img src="images/g2.webp" alt="g2" className="h-auto max-h-[35vh] max-w-[40vw] md:max-w-none w-auto object-contain" />
          </div>
          {/* Column 2 */}
          <div className="flex flex-col justify-end items-center gap-[18px]">
            <img src="images/Trinetrahome.webp" alt="Trinetrahome" className="h-auto max-h-[40vh] max-w-[40vw] md:max-w-none w-auto object-contain" />
            <img src="images/optimized/team.webp" alt="team" className="h-auto max-h-[45vh] max-w-[40vw] md:max-w-none w-auto object-contain" />
          </div>
          {/* Column 3 */}
          <div className="hidden md:flex flex-col justify-end items-start gap-[18px]">
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
        {dimension.width > 0 && dimension.width < 768 ? (
          <>
            <Column images={images.slice(0, 6)} y={y} />
            <Column images={images.slice(6, 12)} y={y2} />
          </>
        ) : (
          <>
            <Column images={images.slice(0, 3)} y={y} />
            <Column images={images.slice(3, 6)} y={y2} />
            <Column images={images.slice(6, 9)} y={y3} />
            <Column images={images.slice(9, 12)} y={y4} />
          </>
        )}
      </div>

      {/* Photo Library Section */}
      <div className="relative w-full py-20 bg-black overflow-hidden z-20">
        <div className="flex flex-col items-center mb-16">
          <h2 style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }} className="text-white text-1xl md:text-2xl font-bold tracking-[2px] uppercase leading-none">Photo Library</h2>
          <div className="w-24 h-px bg-white/30 mt-6"></div>
        </div>

        {/* Horizontal scroll container without scrollbars */}
        <div className="relative group/library">
          {/* Scroll Arrows */}
          <button
            onClick={() => scrollLibrary('left')}
            className="absolute left-2 md:left-6 top-1/2 -translate-y-[100%] z-30 text-white bg-transparent border-none p-2 opacity-75 md:opacity-0 group-hover/library:opacity-100 transition-all duration-300 hover:text-gray-300 hover:scale-110 cursor-pointer"
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          <button
            onClick={() => scrollLibrary('right')}
            className="absolute right-2 md:right-6 top-1/2 -translate-y-[100%] z-30 text-white bg-transparent border-none p-2 opacity-75 md:opacity-0 group-hover/library:opacity-100 transition-all duration-300 hover:text-gray-300 hover:scale-110 cursor-pointer"
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>

          <div
            ref={photoLibraryScrollRef}
            className="w-full overflow-x-auto pb-10 hide-scrollbar scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <div className="grid grid-rows-2 grid-flow-col gap-4 px-[5vw] w-max">
              {galleryPhotos.map((src, i) => (
                <div
                  key={i}
                  className="relative h-[25vh] md:h-[35vh] aspect-[4/3] cursor-pointer group overflow-hidden"
                  onClick={() => setSelectedPhoto(src)}
                >
                  <img
                    src={src}
                    alt={`Gallery Photo ${i}`}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    style={{ borderRadius: 0 }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-md transition-all duration-300"
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            className="absolute top-8 left-8 text-white bg-transparent border-none hover:text-gray-300 z-50 p-2 cursor-pointer transition-transform duration-300 hover:scale-110"
            onClick={() => setSelectedPhoto(null)}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          <img
            src={selectedPhoto}
            alt="Expanded view"
            className="max-w-[90vw] max-h-[90vh] object-contain shadow-2xl"
            style={{ borderRadius: 0 }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Spacer and Horizontal Video Scroll above Footer */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .swiper-button-next, .swiper-button-prev {
          font-weight: 900 !important;
          text-shadow: 0 0 5px rgba(0,0,0,0.8);
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
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
      <footer id="sp-footer" className="hidden md:flex flex-col relative z-50">
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
      <MobileFooter />
    </main>
  );
};

type ColumnProps = {
  images: string[];
  y: MotionValue<number>;
  className?: string;
};

const AccordionItem = ({ title, children }: { title: string, children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={`acc-item ${isOpen ? 'active' : ''}`}>
      <div
        className="acc-header py-2 flex justify-between items-center cursor-pointer text-sm font-bold tracking-widest text-gray-400 hover:text-white transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{title}</span>
        <div className="plus-minus-btn">
          <div className="bar horizontal"></div>
          <div className="bar vertical"></div>
        </div>
      </div>
      <div className="acc-grid">
        <div className="acc-inner">
          <div className="acc-content pt-4 pb-4 text-xl text-white flex flex-col gap-4 font-medium">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

const MobileFooter = () => {
  return (
    <footer id="mobile-footer" className="flex md:hidden relative z-[9999] w-full bg-black text-white px-6 py-12 flex-col font-['Helvetica_Neue',Helvetica,Arial,sans-serif]">
      <div className="mb-16 flex flex-col gap-10">
        <div className="flex items-center gap-2">
          <img src="Trinetra.svg" alt="Trinetra Logo" className="w-6 h-6" style={{ filter: 'brightness(0) invert(1)' }} />
          <span className="text-xl font-bold tracking-widest">TRINETRA</span>
        </div>

        <div className="relative group w-[250px]" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
          <h4 className="text-xs tracking-[0.25em] text-gray-500 mb-2 uppercase font-bold">SPONSORED BY</h4>
          <div className="relative w-full h-16">
            <img src="images/optimized/vyomdrones.webp" alt="Vyom Drones" className="absolute inset-0 w-full h-full object-contain object-left opacity-90" />
          </div>
        </div>
      </div>

      <div className="footer-accordion w-full flex flex-col gap-6">
        <AccordionItem title="WORK WITH US">
          <a href="#" className="hover:text-gray-300 transition-colors">Join the Team</a>
          <a href="#" className="hover:text-gray-300 transition-colors">Sponsor Enquiries</a>
        </AccordionItem>
        <AccordionItem title="SOCIAL">
          <a href="#" className="hover:text-gray-300 transition-colors">X</a>
          <a href="#" className="hover:text-gray-300 transition-colors">YouTube</a>
          <a href="https://www.instagram.com/trinetra_team/" className="hover:text-gray-300 transition-colors">Instagram</a>
          <a href="#" className="hover:text-gray-300 transition-colors">Facebook</a>
          <a href="#" className="hover:text-gray-300 transition-colors">LinkedIn</a>
        </AccordionItem>
        <AccordionItem title="CONTACT">
          <a href="mailto:team.trinetra2026@gmail.com" className="hover:text-gray-300 transition-colors">team.trinetra2026@gmail.com</a>
        </AccordionItem>
      </div>

      <div className="mt-20 text-sm text-gray-400 font-medium tracking-wider">
        <div className="mb-4 text-white uppercase">COPYRIGHT &copy; 2026 TEAM TRINETRA</div>
      </div>
    </footer>
  );
};

const Column = ({ images, y, className = "" }: ColumnProps) => {
  return (
    <motion.div
      className={`relative -top-[45%] flex h-full w-1/2 md:w-1/4 min-w-[45vw] md:min-w-[250px] flex-col gap-[2vw] first:top-[-45%] [&:nth-child(2)]:top-[-95%] [&:nth-child(3)]:top-[-45%] [&:nth-child(4)]:top-[-75%] ${className}`}
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
