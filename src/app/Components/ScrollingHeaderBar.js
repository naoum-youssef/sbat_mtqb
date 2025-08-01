'use client';
import { Package2, Truck } from 'lucide-react';

const ScrollingHeaderBar = () => {
    return (
        <div className="bg-gradient-to-r from-red-600 via-red-500 to-red-600 text-white py-3 overflow-hidden relative">
            {/* Infinite scrolling content - no gaps, continuous loop */}
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
                        <Package2 className="w-4 h-4 text-yellow-300 flex-shrink-0" />
                        <span className="text-sm font-semibold">كمية محدودة</span>
                    </div>
                    <div className="flex items-center gap-2 mx-6">
                        <Truck className="w-4 h-4 text-green-300 flex-shrink-0" />
                        <span className="text-sm font-semibold">توصيل مجاني في جميع أنحاء المغرب</span>
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
                        <Package2 className="w-4 h-4 text-yellow-300 flex-shrink-0" />
                        <span className="text-sm font-semibold">كمية محدودة</span>
                    </div>
                    <div className="flex items-center gap-2 mx-6">
                        <Truck className="w-4 h-4 text-green-300 flex-shrink-0" />
                        <span className="text-sm font-semibold">توصيل مجاني في جميع أنحاء المغرب</span>
                    </div>
                </div>
            </div>

            {/* Infinite scroll CSS */}
            <style jsx>{`
                @keyframes infinite-scroll {
                    0% {
                        transform: translateX(100%);
                    }
                    100% {
                        transform: translateX(-100%);
                    }
                }
                
                .animate-infinite-scroll {
                    animation: infinite-scroll 15s linear infinite;
                    display: flex;
                    width: max-content;
                }

                /* Pause on hover */
                .animate-infinite-scroll:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </div>
    );
};

export default ScrollingHeaderBar;