'use client';
import { Package2, Truck, Star } from 'lucide-react';

const ScrollingHeaderBar = () => {
    return (
        <div className="scrolling-header-container">
            {/* Infinite scrolling content */}
            <div className="flex animate-infinite-scroll">
                <div className="flex whitespace-nowrap items-center">
                    <div className="flex items-center gap-2 mx-6">
                        <Package2 className="w-4 h-4 text-yellow-300 flex-shrink-0" />
                        <span className="text-sm font-semibold">كمية محدودة</span>
                    </div>
                    <div className="flex items-center gap-2 mx-6">
                        <Truck className="w-4 h-4 text-green-300 flex-shrink-0" />
                        <span className="text-sm font-semibold">توصيل مجاني في جميع أنحاء المغرب</span>
                    </div>
                    <div className="flex items-center gap-2 mx-6">
                        <div className="flex gap-1">
                            <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                            <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                            <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                            <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                            <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                        </div>
                        <span className="text-sm font-semibold">تقييم 5 نجوم</span>
                    </div>
                    <div className="flex items-center gap-2 mx-6">
                        <Package2 className="w-4 h-4 text-yellow-300 flex-shrink-0" />
                        <span className="text-sm font-semibold">كمية محدودة</span>
                    </div>
                    <div className="flex items-center gap-2 mx-6">
                        <Truck className="w-4 h-4 text-green-300 flex-shrink-0" />
                        <span className="text-sm font-semibold">توصيل مجاني في جميع أنحاء المغرب</span>
                    </div>
                    <div className="flex items-center gap-2 mx-6">
                        <div className="flex gap-1">
                            <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                            <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                            <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                            <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                            <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                        </div>
                        <span className="text-sm font-semibold">تقييم 5 نجوم</span>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .scrolling-header-container {
                    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
                    color: white;
                    py: 12px;
                    overflow: hidden;
                    position: relative;
                    box-shadow: 
                        0 4px 15px rgba(245, 158, 11, 0.3),
                        0 0 0 0 rgba(245, 158, 11, 0.3);
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                }

                .scrolling-header-container::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(
                        90deg,
                        transparent,
                        rgba(255, 255, 255, 0.1),
                        transparent
                    );
                    animation: shimmer 3s ease-in-out infinite;
                }

                @keyframes shimmer {
                    0% {
                        left: -100%;
                    }
                    50% {
                        left: 100%;
                    }
                    100% {
                        left: 100%;
                    }
                }

                @keyframes infinite-scroll {
                    0% {
                        transform: translateX(100%);
                    }
                    100% {
                        transform: translateX(-100%);
                    }
                }
                
                .animate-infinite-scroll {
                    animation: infinite-scroll 20s linear infinite;
                    display: flex;
                    width: max-content;
                    padding: 12px 0;
                }

                /* Pause on hover */
                .animate-infinite-scroll:hover {
                    animation-play-state: paused;
                }

                /* Text styling similar to sticky button */
                span {
                    font-family: 'Cairo', sans-serif;
                    letter-spacing: 0.3px;
                    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
                }

                /* Mobile responsiveness */
                @media (max-width: 768px) {
                    .animate-infinite-scroll {
                        padding: 8px 0;
                    }
                    
                    span {
                        font-size: 12px;
                    }
                }

                /* RTL Support */
                [dir="rtl"] .animate-infinite-scroll {
                    direction: rtl;
                }
            `}</style>
        </div>
    );
};

export default ScrollingHeaderBar;