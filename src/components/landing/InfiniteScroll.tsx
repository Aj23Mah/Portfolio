"use client"
import React, { useEffect } from 'react';
import '@/assets/css/InifiniteScroll.css';

export default function InfiniteScroll() {
    useEffect(() => {
        const scrollers = document.querySelectorAll(".scroller");

        if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            addAnimation();
        }

        function addAnimation() {
            scrollers.forEach((scroller) => {
                scroller.setAttribute("data-animated", "true"); // Use a string value for the attribute

                const scrollerInner = scroller.querySelector('.scroller__inner');
                if (!scrollerInner) return; // Skip if scrollerInner is null

                const scrollerContent = Array.from(scrollerInner.children);
                scrollerContent.forEach(item => {
                    const duplicatedItem = item.cloneNode(true);
                    duplicatedItem.setAttribute('aria-hidden', 'true'); // Use a string here too
                    scrollerInner.appendChild(duplicatedItem);
                });
            });
        }


    }, []);

    return (
        <section className="w-full container mx-auto py-10">
            {/*<div className="text-2xl text-center font-bold">Infinite Scroll Animation</div>*/}
            <div className="scroller" data-direction="left">
                <ul className="tag-list scroller__inner">
                    <li>HTML</li>
                    <li>CSS</li>
                    <li>JS</li>
                    <li>webdev</li>
                    <li>React</li>
                    <li>Next</li>
                    <li>Node</li>
                    <li>Express</li>
                    <li>Nest</li>
                    <li>scss</li>
                    <li>animation</li>
                    <li>Tailwind</li>
                    <li>Bootstrap</li>
                    <li>Mantine UI</li>
                    <li>Material UI</li>
                </ul>
            </div>
            <div className="scroller" data-direction="right">
                <ul className="tag-list scroller__inner">
                    <li>HTML</li>
                    <li>CSS</li>
                    <li>JS</li>
                    <li>webdev</li>
                    <li>React</li>
                    <li>Next</li>
                    <li>Node</li>
                    <li>Express</li>
                    <li>Nest</li>
                    <li>scss</li>
                    <li>animation</li>
                    <li>Tailwind</li>
                    <li>Bootstrap</li>
                    <li>Mantine UI</li>
                    <li>Material UI</li>
                </ul>
            </div>
        </section>
    );
};

