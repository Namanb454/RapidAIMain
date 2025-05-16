/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface BrandSliderProps {
    variant: 'examples';
    className?: string;
}

export const BrandSlider: React.FC<BrandSliderProps> = ({ variant, className = '' }) => {
    const ServiceSliderSettings = {
        infinite: true,
        speed: 5000,
        slidesToShow: 6,
        slidesToScroll: 1,
        autoplay: true,
        reverse: true,
        autoplaySpeed: 100,
        cssEase: "linear",
        direction: "horizontal",
        rtl: true,
        arrows: false,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 5,
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 3,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 2,
                },
            },
        ],
    };

    const TestimonialSliderSettings = {
        infinite: true,
        speed: 7000,
        slidesToShow: 5,
        slidesToScroll: 1,
        autoplay: true,
        reverse: true,
        autoplaySpeed: 100,
        cssEase: "linear",
        direction: "left",
        rtl: true,
        arrows: true,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 4.5,
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 3,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                },
            },
        ],
    };

    const client = [
        {
            'title': 'SaaS Development',
            'url': '/examples/captioned0.mp4'
        },
        {
            'title': 'SaaS Development',
            'url': '/examples/captioned1.mp4'
        },
        {
            'title': 'SaaS Development',
            'url': '/examples/captioned2.mp4'
        },
        {
            'title': 'SaaS Development',
            'url': '/examples/captioned3.mp4'
        },
        {
            'title': 'SaaS Development',
            'url': '/examples/captioned4.mp4'
        },
        {
            'title': 'SaaS Development',
            'url': '/examples/captioned5.mp4'
        },
        {
            'title': 'SaaS Development',
            'url': '/examples/captioned6.mp4'
        },
        {
            'title': 'SaaS Development',
            'url': '/examples/captioned7.mp4'
        },
        {
            'title': 'SaaS Development',
            'url': '/examples/captioned8.mp4'
        },
        {
            'title': 'SaaS Development',
            'url': '/examples/captioned9.mp4'
        },
        {
            'title': 'SaaS Development',
            'url': '/examples/captioned10.mp4'
        },
    ]

    const examplesSlider = () => (
        <div className={`w-full overflow-hidden ${className}`}>
            <Slider {...TestimonialSliderSettings} className="">
                {client.map((item, index) => (

                    <div key={index} className="p-2 overflow-hidden rounded-2xl">
                        <div className="w-fit mx-auto p-2 mb-5 shadow-md shadow-indigo-500 text-left rounded-2xl overflow-hidden">
                            <video className="h-96" autoPlay muted>
                                <source src={item.url}  className="rounded-2xl"/>
                            </video>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );

    return variant === 'examples' && examplesSlider();
};