import React, { useEffect, useState } from 'react';
import { MdOutlineKeyboardArrowUp } from 'react-icons/md';

const Scroll = () => {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => {
        if (window.scrollY > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        const duration = 3000;
        const start = window.scrollY;
        const startTime = performance.now();

        const easeInOutQuad = (t, b, c, d) => {
            t /= d / 2;
            if (t < 1) return (c / 2) * t * t + b;
            t--;
            return (-c / 2) * (t * (t - 2) - 1) + b;
        };

        const scroll = (currentTime) => {
            const timeElapsed = currentTime - startTime;
            const run = easeInOutQuad(timeElapsed, start, -start, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) {
                requestAnimationFrame(scroll);
            }
        };

        requestAnimationFrame(scroll);
    };

    return (
        <div>
            {isVisible && (
                <button
                    onClick={scrollToTop}
                    className='fixed p-1 rounded-full bottom-5 right-5 bg-[#5572fc] shadow-lg text-white animate-bounce hover:scale-110 active:scale-95 transition-transform'
                >
                    <MdOutlineKeyboardArrowUp size={30} />
                </button>
            )}
        </div>
    );
};

export default Scroll;
