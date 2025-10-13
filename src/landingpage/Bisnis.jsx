import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

// Gambar
import sectionBg from '../assets/hero-bg.png';
import cardImage from '../assets/rectangle.png';

// Data Slide
const slidesData = [
  {
    image: cardImage,
    title: "Bisnis",
    description:
      "Lorem ipsum dolor sit amet consectetur. Convallis tempus vitae nulla in consectetur sed feugiat nisi viverra eros vitae aliquet pulvinar.",
    link: "#", // placeholder
  },
  {
    image: cardImage,
    title: "Monitoring",
    description:
      "Eu tellus metus pellentesque proin elit nibh viverra. Convallis tempus vitae nulla in consectetur sed feugiat nisi viverra.",
    link: "#",
  },
  {
    image: cardImage,
    title: "Lokasi",
    description:
      "Lorem ipsum dolor sit amet consectetur. Convallis tempus vitae nulla in consectetur sed feugiat nisi viverra eros vitae aliquet pulvinar.",
    link: "#",
  },
  {
    image: cardImage,
    title: "TJSL",
    description:
      "Eu tellus metus pellentesque proin elit nibh viverra. Convallis tempus vitae nulla in consectetur sed feugiat nisi viverra.",
    link: "/tjsl", // 🔗 ini halaman TJSL yang udah kamu buat
  },
];

const Bisnis = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const timeoutRef = useRef(null);

  // Reset interval otomatis
  const resetTimeout = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(() => {
      setActiveIndex((prevIndex) =>
        prevIndex === slidesData.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    return () => resetTimeout();
  }, [activeIndex]);

  return (
    <section className="relative min-h-screen w-full flex items-center justify-center">
      {/* Background + Overlay */}
      <div
        className="absolute top-0 left-0 w-full h-full z-0"
        style={{
          backgroundImage: `url(${sectionBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* Konten */}
      <div className="relative z-10 container mx-auto px-8 lg:px-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Kiri: Teks */}
          <div className="text-white space-y-6">
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              {slidesData[activeIndex].title}
            </h1>
            <p className="text-lg text-gray-300 max-w-lg">
              {slidesData[activeIndex].description}
            </p>

            {/* Tombol Explore → sekarang pakai Link */}
            <Link
              to={slidesData[activeIndex].link}
              className="group inline-flex items-center space-x-2 text-white font-medium transition-all duration-300"
            >
              <span className="border-b-2 border-transparent group-hover:border-white pb-1 transition-all">
                Explore Now
              </span>
              <span className="transform group-hover:translate-x-1 transition-transform">
                →
              </span>
            </Link>
          </div>

          {/* Kanan: Slider Gambar */}
          <div className="relative h-[60vh] flex items-center justify-center">
            {slidesData.map((slide, index) => (
              <div
                key={index}
                className={`absolute w-3/4 max-w-sm h-full transition-all duration-700 ease-in-out transform
                  ${
                    activeIndex === index
                      ? 'opacity-100 translate-x-0 z-10'
                      : 'opacity-0 z-0'
                  }
                  ${activeIndex > index ? '-translate-x-full' : ''}
                  ${activeIndex < index ? 'translate-x-full' : ''}
                `}
              >
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover rounded-3xl shadow-2xl"
                />
              </div>
            ))}

            {/* Gambar next yang "ngintip" di belakang */}
            <div className="absolute w-3/4 max-w-sm h-full opacity-50 transform scale-90 -translate-x-8 z-0">
              <img
                src={slidesData[(activeIndex + 1) % slidesData.length].image}
                alt="next slide"
                className="w-full h-full object-cover rounded-3xl shadow-2xl"
              />
            </div>
          </div>
        </div>

        {/* Titik navigasi bawah */}
        <div className="absolute bottom-[-5vh] left-1/2 -translate-x-1/2 flex space-x-3">
          {slidesData.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                activeIndex === index
                  ? 'bg-white scale-125'
                  : 'bg-white/50 hover:bg-white'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Bisnis;
