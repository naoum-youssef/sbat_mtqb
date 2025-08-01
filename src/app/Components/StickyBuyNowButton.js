'use client';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Star } from 'lucide-react';

const StickyBuyNowButton = () => {
    const router = useRouter();

    const handleBuyNowClick = () => {
        // Smooth scroll to order form section
        const orderFormElement = document.querySelector('[data-section="order-form"]');
        if (orderFormElement) {
            orderFormElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        } else {
            // If no order form section found, you can redirect to a specific route
            // router.push('/order');

            // Or scroll to bottom of page where order form usually is
            window.scrollTo({
                top: document.body.scrollHeight,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="sticky-buy-button-container">


            {/* Buy Now Button */}
            <button
                onClick={handleBuyNowClick}
                className="sticky-buy-button"
                aria-label="إشتري الآن"
            >
                <ShoppingCart className="button-icon" size={20} />
                <span className="button-text">إشتري الآن!</span>
            </button>

            <style jsx>{`
                .sticky-buy-button-container {
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    z-index: 1000;
                    background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.7) 50%, transparent 100%);
                    padding: 12px 16px 20px;
                    pointer-events: none;
                }

                .social-proof {
                    pointer-events: auto;
                    margin-bottom: 12px;
                    display: flex;
                    justify-content: center;
                }

                .social-proof-content {
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(10px);
                    border-radius: 25px;
                    padding: 8px 16px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                }

                .rating-stars {
                    display: flex;
                    gap: 2px;
                }

                .star {
                    color: #fbbf24;
                    fill: #fbbf24;
                }

                .customer-count {
                    font-size: 13px;
                    font-weight: 600;
                    color: #1f2937;
                    white-space: nowrap;
                }

                .sticky-buy-button {
                    pointer-events: auto;
                    width: 100%;
                    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
                    border: none;
                    border-radius: 16px;
                    padding: 16px 24px;
                    color: white;
                    font-size: 18px;
                    font-weight: bold;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 
                        0 8px 25px rgba(245, 158, 11, 0.4),
                        0 0 0 0 rgba(245, 158, 11, 0.4);
                    position: relative;
                    overflow: hidden;
                    text-align: center;
                    min-height: 56px;
                }

                .sticky-buy-button:hover {
                    transform: translateY(-2px);
                    box-shadow: 
                        0 12px 35px rgba(245, 158, 11, 0.5),
                        0 0 0 0 rgba(245, 158, 11, 0.4);
                }

                .sticky-buy-button:active {
                    transform: translateY(0);
                    box-shadow: 
                        0 6px 20px rgba(245, 158, 11, 0.4),
                        0 0 0 0 rgba(245, 158, 11, 0.4);
                }

                .sticky-buy-button::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(
                        90deg,
                        transparent,
                        rgba(255, 255, 255, 0.2),
                        transparent
                    );
                    transition: left 0.5s;
                }

                .sticky-buy-button:hover::before {
                    left: 100%;
                }

                .button-icon {
                    flex-shrink: 0;
                }

                .button-text {
                    font-family: 'Cairo', sans-serif;
                    letter-spacing: 0.5px;
                }

                /* Pulse animation for extra attention */
                @keyframes pulse {
                    0% {
                        box-shadow: 0 8px 25px rgba(245, 158, 11, 0.4), 0 0 0 0 rgba(245, 158, 11, 0.4);
                    }
                    70% {
                        box-shadow: 0 8px 25px rgba(245, 158, 11, 0.4), 0 0 0 10px rgba(245, 158, 11, 0);
                    }
                    100% {
                        box-shadow: 0 8px 25px rgba(245, 158, 11, 0.4), 0 0 0 0 rgba(245, 158, 11, 0);
                    }
                }

                .sticky-buy-button {
                    animation: pulse 2s infinite;
                }

                /* Mobile responsiveness */
                @media (max-width: 768px) {
                    .sticky-buy-button-container {
                        padding: 10px 12px 16px;
                    }
                    
                    .sticky-buy-button {
                        font-size: 16px;
                        padding: 14px 20px;
                        border-radius: 14px;
                        min-height: 52px;
                    }
                    
                    .customer-count {
                        font-size: 12px;
                    }
                    
                    .social-proof-content {
                        padding: 6px 12px;
                        border-radius: 20px;
                    }
                }

                /* RTL Support */
                [dir="rtl"] .sticky-buy-button {
                    flex-direction: row-reverse;
                }

                /* Dark mode support */
                @media (prefers-color-scheme: dark) {
                    .social-proof-content {
                        background: rgba(31, 41, 55, 0.95);
                        border: 1px solid rgba(75, 85, 99, 0.3);
                    }
                    
                    .customer-count {
                        color: #f9fafb;
                    }
                }
            `}</style>
        </div>
    );
};

export default StickyBuyNowButton;