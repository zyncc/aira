"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function PreLoader() {
  const [isVisible, setIsVisible] = useState(true);
  const svgRef = useRef(null);
  const greenRef = useRef(null);
  const svgPathRef = useRef<SVGPathElement>(null);
  const preloaderRef = useRef(null);
  const [checkCookie, setCheckCookie] = useState(false);

  useEffect(() => {
    const cookies = document.cookie.split("; ");
    const checkCookie = cookies.find((row) => row.startsWith("preloader="));
    if (checkCookie) {
      setCheckCookie(true);
    }
  }, []);

  useEffect(() => {
    const timeline = gsap.timeline({
      onComplete: () => {
        // Completely remove preloader after animation
        setIsVisible(false);
        document.body.style.overflow = "";
        document.documentElement.style.overflow = "";
      },
    });

    // Prevent scrolling
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    gsap.set(svgRef.current, { y: 300, opacity: 0 });
    // Animate SVG in
    timeline.fromTo(
      svgRef.current,
      { y: 300, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" }
    );

    // Slide green background up to mask the SVG
    timeline.to(greenRef.current, {
      y: 0,
      duration: 1,
      ease: "power2.inOut",
    });

    timeline.to(
      svgPathRef.current,
      {
        fill: "#f3efec",
        duration: 0.5,
        ease: "power2.inOut",
      },
      "<" // sync with greenRef animation
    );

    // Slide up preloader off the screen
    timeline.to(preloaderRef.current, {
      y: "-100%",
      duration: 0.8,
      ease: "power2.inOut",
      delay: 0.2,
    });

    // Set Preloader Cookie
    const now = new Date();
    now.setDate(now.getDate() + 1);
    document.cookie = `preloader=false; path=/; expires=${now.toUTCString()};`;
  }, []);

  if (!isVisible) return null;
  if (checkCookie) return null;

  return (
    <div
      ref={preloaderRef}
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#f3efec]"
    >
      {/* SVG centered */}
      <div className="absolute z-50 flex items-center justify-center inset-0 pointer-events-none">
        <svg
          ref={svgRef}
          width="300"
          height="190"
          viewBox="0 0 406 190"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            ref={svgPathRef}
            fillRule="evenodd"
            clipRule="evenodd"
            d="M32.8881 145.32C32.8881 180.648 57.2081 182.696 74.3601 162.984V87.72C71.3587 93.2227 64.936 97.5035 53.1819 105.338L52.3441 105.896C39.0321 114.856 32.8881 131.24 32.8881 145.32ZM0.120117 149.928C0.120117 121.674 26.5141 110.456 45.6186 102.336L45.6201 102.336C46.2484 102.069 46.8688 101.805 47.4801 101.544L48.1072 101.278C64.6229 94.2731 74.3601 90.1432 74.3601 79.272V78.248C74.3601 68.776 70.5201 55.208 54.6481 55.208C38.2641 55.208 28.7921 72.616 25.9761 84.392L8.82412 77.224C22.6481 59.56 38.0081 52.904 54.6481 52.904C84.8561 52.904 106.104 71.592 106.104 101.544V163.24C106.104 170.273 110.252 172.89 113.227 174.768C114.367 175.488 115.336 176.099 115.832 176.808L74.3601 186.792V166.056C67.9601 175.016 52.3441 189.096 35.4481 189.096C15.4801 189.096 0.120117 172.2 0.120117 149.928ZM237.212 75.432C250.012 59.304 263.58 52.904 274.332 52.904C285.084 52.904 293.276 58.536 298.14 67.496L278.684 79.784C272.796 65.192 256.412 55.464 237.212 79.016V171.432C237.212 178.308 241.177 180.835 244.135 182.721C245.361 183.503 246.415 184.174 246.94 185H195.74C196.266 184.174 197.319 183.503 198.546 182.721C201.503 180.835 205.468 178.308 205.468 171.432V80.296C205.468 73.6058 201.509 71.0025 198.552 69.0581C197.323 68.2496 196.266 67.5551 195.74 66.728L218.78 61.352C220.161 61.0335 221.738 60.7097 223.426 60.3632C227.779 59.4698 234 56.5 237.212 48.4766V75.432ZM129.18 185C129.705 184.174 130.759 183.503 131.986 182.721C134.943 180.835 138.908 178.308 138.908 171.432V80.296C138.908 73.6058 134.949 71.0025 131.992 69.0581C130.763 68.2496 129.706 67.5551 129.18 66.728L170.652 57V171.432C170.652 178.308 174.617 180.835 177.575 182.721C178.801 183.503 179.855 184.174 180.38 185H129.18ZM322.138 145.32C322.138 180.648 346.458 182.696 363.61 162.984V87.72C360.609 93.2227 354.186 97.5034 342.432 105.338L341.594 105.896C328.282 114.856 322.138 131.24 322.138 145.32ZM289.37 149.928C289.37 121.674 315.764 110.456 334.869 102.336C335.497 102.069 336.118 101.805 336.73 101.544L337.357 101.278C353.873 94.2731 363.61 90.1432 363.61 79.272V78.248C363.61 68.776 359.77 55.208 343.898 55.208C327.514 55.208 318.042 72.616 315.226 84.392L298.074 77.224C311.898 59.56 327.258 52.904 343.898 52.904C374.106 52.904 395.354 71.592 395.354 101.544V163.24C395.354 170.273 399.502 172.89 402.477 174.768C403.617 175.488 404.586 176.099 405.082 176.808L363.61 186.792V166.056C357.21 175.016 341.594 189.096 324.698 189.096C304.73 189.096 289.37 172.2 289.37 149.928Z"
            fill="#56756E"
          />
          <circle cx="154" cy="26" r="20" fill="#C62200" />
        </svg>
      </div>

      {/* Green background sliding up to mask the SVG */}
      <div
        ref={greenRef}
        className="absolute inset-0 bg-[#56756E] z-20 translate-y-full"
      />
    </div>
  );
}
