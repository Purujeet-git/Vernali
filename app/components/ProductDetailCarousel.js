import React from "react";
import Slider from "react-slick";
import Image from "next/image";

const ProductDetailCarousel = ({ images }) => {
    const settings = {
        dots: true,
        fade: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        waitForAnimate: false
    };
    return (
        <div>
            <Slider {...settings}>
                {images.map((image,index) =>(
                    <div key={index} className="h-[80vh] flex justify-center items-center">
                        <Image height={1000} width={1000} src={image} alt={`Product Image ${index}`} className="h-full object-contain" />
                    </div>
                ))}
            </Slider>
        </div>
    )
}

export default ProductDetailCarousel