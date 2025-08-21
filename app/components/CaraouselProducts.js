"use client";
import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const CaraouselProducts = () => {
  const [slides, setSlides] = useState([]);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const res = await fetch("/api/carousel?section=productGrid");
        const data = await res.json();
        setSlides(data);
      } catch (error) {
        // console.error("Error fetching slides:", error);
      }
    };
    fetchSlides();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4, // Change as needed
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 3 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <div className="px-4 py-6 w-full h-[45vh]">
      <Slider {...settings}>
        {Array.isArray(slides) &&
          slides.map((slide, i) => (
            <div key={i} className="p-2">
              <div className="h-[250px] w-full flex items-center justify-center border rounded shadow bg-white">
                <img
                  src={slide.imageUrl}
                  alt={`Slide ${i}`}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            </div>
          ))}
      </Slider>
    </div>
  );
};

export default CaraouselProducts;
