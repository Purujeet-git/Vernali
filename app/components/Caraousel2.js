"use client";
import React, { useEffect, useState } from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import Image from 'next/image';

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 2000,
  arrows: true,
};

const Carousel2 = () => {
  const [slides, setSlides] = useState([]);

  useEffect(() => {
    const fetchSlides = async () => {
      const res = await fetch('/api/carousel?section=promotions');
      const data = await res.json();
      setSlides(data);
    };
    fetchSlides();
  }, []);

  return (
    <div className='flex items-center justify-center py-5'>
      <div className="slider-container w-[90vw] h-[40vh] overflow-hidden">
        <Slider {...settings}>
          {Array.isArray(slides) && slides.map((slide, i) => (
            <div key={i} className="w-full h-[40vh]">
              <Image
              height={500}
              width={500}
                src={slide.imageUrl}
                alt={`Slide ${i}`}
                className="w-full h-full object-contain"
              />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Carousel2;
