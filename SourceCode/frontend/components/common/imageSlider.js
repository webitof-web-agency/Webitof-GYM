"use client";
import React, { useEffect, useState } from "react";
import "swiper/css";
import Image from "next/image";

const ProductImageSlider = ({ thumbnail_image, images = [] }) => {
  const [SwiperComponents, setSwiperComponents] = useState(null);
  const [mainImage, setMainImage] = useState(thumbnail_image);

  useEffect(() => {
    let mounted = true;
    import("swiper/react").then((react) => {
      if (!mounted) return;
      setSwiperComponents({ Swiper: react.Swiper, SwiperSlide: react.SwiperSlide });
    });
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    setMainImage(thumbnail_image);
  }, [thumbnail_image]);

  if (!SwiperComponents) {
    return (
      <div className="w-full flex flex-col items-center">
        <div className="w-full flex justify-center mb-4">
          <div className="rounded-lg lg:h-[450px] h-[300px] w-full max-w-[500px] bg-gray-100 animate-pulse" />
        </div>
        <div className="w-full max-w-md grid grid-cols-4 gap-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-[80px] rounded-md bg-gray-100 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const { Swiper, SwiperSlide } = SwiperComponents;
  const allImages = [thumbnail_image, ...images].filter(Boolean);

  return (
    <div className="w-full flex flex-col items-center">
      {/* Main image */}
      <div className="w-full flex justify-center mb-4">
        <Image
          src={mainImage}
          alt="Product Main Image"
          width={500}
          height={500}
          className="rounded-lg lg:h-[450px] h-[300px] object-cover"
        />
      </div>

      {/* Thumbnail strip - simple click-to-select, no Thumbs module needed */}
      <Swiper
        spaceBetween={10}
        slidesPerView={4}
        className="w-full max-w-md"
      >
        {allImages.map((image, index) => (
          <SwiperSlide key={index} onClick={() => setMainImage(image)}>
            <Image
              src={image}
              alt={`Thumbnail ${index + 1}`}
              width={100}
              height={100}
              className={`cursor-pointer object-cover rounded-md h-[80px] w-full ${
                mainImage === image
                  ? "border-2 border-[#F97316]"
                  : "border border-transparent hover:border-slate-200"
              }`}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ProductImageSlider;

