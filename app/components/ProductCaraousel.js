"use client"

import React from 'react';
import Slider from 'react-slick';
import Image from 'next/image';
const ProductCaraousel = ({images}) => {

    const settings = {
        dots:true,
        infinite:true,
        speed:800,
        slidesToShow:1,
        slidesToScroll:1,
    };
  return (
    <div >
      <Slider {...settings}>
        {images.map((image,index) =>(
            <div key={index} className="h-[40vh] flex justify-center items-center bg-green-100">
          <Image height={500} width={500} src={image} alt={`Product Image ${index}`} className="h-full object-contain" />
        </div>
        ))}
      </Slider>
    </div>
  )
}

export default ProductCaraousel
