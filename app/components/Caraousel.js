"use client"
import React, { useEffect,useState } from 'react'
import Link from 'next/link';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Slider from "react-slick";



  const settings = {
    dots: true,
    fade: true,
    infinite: true,
    autoplay:true,
    speed: 2000,
    autoplaySpeed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
    waitForAnimate: false
  };

const Caraousel = () => {
  const [slides, setslides] = useState([]);

  useEffect(() => {
    const fetchSlides = async () => {
      const res = await fetch(`/api/carousel?section=main`);
      const data = await res.json();
      setslides(data);
    };
    fetchSlides();
  },[]);

  return (
    <Slider {...settings} className='h-full'>
      { Array.isArray(slides) && slides.map((slide) => (
        <div key={slide._id} className='h-[88vh]'>
          <Link href={slide.redirectUrl || "#"}><img src={slide.imageUrl} alt="" className='w-full h-full object-cover' /></Link>
        </div>
      ))}
    </Slider>
  )
}

export default Caraousel;
