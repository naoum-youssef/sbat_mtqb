import UpperImages from "@/app/Components/UpperImages";
import LowerImages from "@/app/Components/LowerImages";
import OrderForm from "@/app/Components/OrderForm";
import StickyBuyNowButton from "@/app/Components/StickyBuyNowButton";
import ScrollingHeaderBar from "@/app/Components/ScrollingHeaderBar";
export default function Home() {
    return (
        <div>

            {/* Scrolling header bar at the very top */}
            <ScrollingHeaderBar />

            <UpperImages/>

            {/* Add data-section attribute to help the button find the order form */}
            <div data-section="order-form">
                <OrderForm/>
            </div>

            <LowerImages/>

            {/* Sticky Buy Now Button - will stay fixed at bottom */}
            <StickyBuyNowButton />
        </div>
    );
}