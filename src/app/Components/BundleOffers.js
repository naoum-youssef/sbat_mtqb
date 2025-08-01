import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Package, ShoppingCart, ChevronDown, Check, Percent, MessageCircle } from 'lucide-react';
import styles from "@/app/Components/OrderForm.module.css";
import WOO_CONFIG from "@/app/Components/wooConfig";

const BundleOffers = ({ formData, onOrderComplete }) => {
    const router = useRouter();
    const [selectedBundle, setSelectedBundle] = useState('bundle1');
    const [bundleSelections, setBundleSelections] = useState({
        bundle1: {
            color: 'white',
            size: '41'
        },
        bundle2: {
            item1: {color: 'white', size: '41'},
            item2: {color: 'black', size: '42'}
        }
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderError, setOrderError] = useState('');

    // Meta Pixel tracking function
    const trackPurchase = (buttonType, price) => {
        if (typeof window !== 'undefined' && window.fbq) {
            window.fbq('track', 'Purchase', {
                value: price,
                currency: 'MAD',
                content_name: buttonType === 'order' ? 'إتمام الطلب' : 'طلب عبر واتساب'
            })
        }
    }

    const colors = [
        {name: 'white', color: '#FFFFFF', arabicName: 'أبيض', border: '#E5E7EB'},
        {name: 'brown', color: '#8B4513', arabicName: 'بني', border: '#8B4513'},
        {name: 'black', color: '#000000', arabicName: 'أسود', border: '#000000'}
    ];

    const sizes = Array.from({ length: 5 }, (_, i) => 40 + i);

    const handleBundleSelection = (bundleType) => {
        setSelectedBundle(bundleType);
    };

    const handleSingleItemChange = (field, value) => {
        setBundleSelections(prev => ({
            ...prev,
            bundle1: {
                ...prev.bundle1,
                [field]: value
            }
        }));
    };

    const handleBundleItemChange = (itemKey, field, value) => {
        setBundleSelections(prev => ({
            ...prev,
            bundle2: {
                ...prev.bundle2,
                [itemKey]: {
                    ...prev.bundle2[itemKey],
                    [field]: value
                }
            }
        }));
    };

    const validateForm = () => {
        if (!formData.fullName?.trim()) {
            setOrderError('يرجى إدخال الاسم الكامل');
            return false;
        }
        if (!formData.phoneNumber?.trim()) {
            setOrderError('يرجى إدخال رقم الهاتف');
            return false;
        }
        if (!formData.deliveryAddress?.trim()) {
            setOrderError('يرجى إدخال عنوان التوصيل');
            return false;
        }
        return true;
    };

    // Function to create product if needed
    const createOrGetProduct = async (productName, price) => {
        try {
            // Try to find existing products
            const searchResponse = await fetch(`${WOO_CONFIG.url}/wp-json/wc/v3/products?search=${encodeURIComponent(productName)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + btoa(WOO_CONFIG.consumerKey + ':' + WOO_CONFIG.consumerSecret)
                }
            });

            if (searchResponse.ok) {
                const existingProducts = await searchResponse.json();
                if (existingProducts.length > 0) {
                    return existingProducts[0].id;
                }
            }

            // Create new product if not found
            const productData = {
                name: productName,
                type: 'simple',
                regular_price: price.toString(),
                description: 'منتج تم إنشاؤه تلقائياً من الموقع',
                short_description: productName,
                manage_stock: false,
                in_stock: true,
                status: 'publish'
            };

            const createResponse = await fetch(`${WOO_CONFIG.url}/wp-json/wc/v3/products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + btoa(WOO_CONFIG.consumerKey + ':' + WOO_CONFIG.consumerSecret)
                },
                body: JSON.stringify(productData)
            });

            if (createResponse.ok) {
                const newProduct = await createResponse.json();
                return newProduct.id;
            }

            return null;
        } catch (error) {
            console.error('Error creating/finding product:', error);
            return null;
        }
    };

    const handleOrderSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        // Track purchase with Meta Pixel
        const price = selectedBundle === 'bundle1' ? 299 : 550;
        trackPurchase('order', price);

        setIsSubmitting(true);
        setOrderError('');

        try {
            // Prepare order data based on bundle selection
            let totalPrice = 0;
            let orderSummary = '';
            let productName = '';

            if (selectedBundle === 'bundle1') {
                totalPrice = 299;
                productName = 'حذاء مغربي تقليدي';
                orderSummary = `1 حذاء - المقاس: ${bundleSelections.bundle1.size} - اللون: ${bundleSelections.bundle1.color}`;
            } else if (selectedBundle === 'bundle2') {
                totalPrice = 550;
                productName = 'عرض حذائين مغربيين';
                orderSummary = `2 أحذية - الأول: ${bundleSelections.bundle2.item1.size}/${bundleSelections.bundle2.item1.color} - الثاني: ${bundleSelections.bundle2.item2.size}/${bundleSelections.bundle2.item2.color}`;
            }

            // Get or create product
            const productId = await createOrGetProduct(productName, totalPrice);

            if (!productId) {
                throw new Error('فشل في إنشاء المنتج');
            }

            // Prepare line items
            let lineItems = [];
            if (selectedBundle === 'bundle1') {
                lineItems = [{
                    product_id: productId,
                    quantity: 1,
                    meta_data: [
                        { key: 'المقاس', value: bundleSelections.bundle1.size },
                        { key: 'اللون', value: bundleSelections.bundle1.color }
                    ]
                }];
            } else if (selectedBundle === 'bundle2') {
                lineItems = [{
                    product_id: productId,
                    quantity: 2,
                    meta_data: [
                        { key: 'الحذاء_الأول_المقاس', value: bundleSelections.bundle2.item1.size },
                        { key: 'الحذاء_الأول_اللون', value: bundleSelections.bundle2.item1.color },
                        { key: 'الحذاء_الثاني_المقاس', value: bundleSelections.bundle2.item2.size },
                        { key: 'الحذاء_الثاني_اللون', value: bundleSelections.bundle2.item2.color }
                    ]
                }];
            }

            // Create order directly with WooCommerce API
            const orderData = {
                status: "pending",
                currency: "MAD",
                billing: {
                    first_name: formData.fullName,
                    last_name: "",
                    email: formData.phoneNumber + '@customer.temp',
                    phone: formData.phoneNumber,
                    address_1: formData.deliveryAddress,
                    city: "Morocco",
                    country: "MA"
                },
                shipping: {
                    first_name: formData.fullName,
                    last_name: "",
                    address_1: formData.deliveryAddress,
                    city: "Morocco",
                    country: "MA"
                },
                line_items: lineItems,
                shipping_total: "0.00",
                total: totalPrice.toString(),
                meta_data: [
                    { key: 'طريقة_الطلب', value: 'موقع_الكتروني' },
                    { key: 'ملخص_الطلب', value: orderSummary }
                ]
            };

            // Make direct API call to WooCommerce
            const response = await fetch(`${WOO_CONFIG.url}/wp-json/wc/v3/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + btoa(WOO_CONFIG.consumerKey + ':' + WOO_CONFIG.consumerSecret)
                },
                body: JSON.stringify(orderData)
            });

            if (response.ok) {
                const order = await response.json();

                // Call the success callback
                if (onOrderComplete) {
                    onOrderComplete({
                        orderId: order.id,
                        orderNumber: order.number || order.id,
                        total: totalPrice
                    });
                }

                // Create URL parameters for the success page
                const searchParams = new URLSearchParams({
                    orderNumber: order.number || order.id,
                    orderId: order.id,
                    total: totalPrice.toString(),
                    customerName: encodeURIComponent(formData.fullName),
                    phone: encodeURIComponent(formData.phoneNumber),
                    address: encodeURIComponent(formData.deliveryAddress),
                    status: 'success'
                });

                // Redirect to success page
                router.push(`/success?${searchParams.toString()}`);
            } else {
                const errorData = await response.json();
                console.error('WooCommerce API Error:', errorData);
                setOrderError(errorData.message || 'حدث خطأ أثناء إنشاء الطلب');
            }

        } catch (error) {
            console.error('Order submission error:', error);
            setOrderError('حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // WhatsApp function with tracking
    const handleWhatsAppOrder = () => {
        if (!validateForm()) {
            return;
        }

        // Track purchase with Meta Pixel
        const price = selectedBundle === 'bundle1' ? 299 : 550;
        trackPurchase('whatsapp', price);

        const getColorName = (colorName) => {
            const color = colors.find(c => c.name === colorName);
            return color ? color.arabicName : colorName;
        };

        let shoeDetails = '';
        let price_text = '';
        let quantity = '';

        if (selectedBundle === 'bundle1') {
            quantity = '1 حذاء';
            price_text = '299 درهم';
            shoeDetails = `الحذاء: المقاس ${bundleSelections.bundle1.size}, اللون ${getColorName(bundleSelections.bundle1.color)}`;
        } else {
            quantity = '2 من الأحذية';
            price_text = '550 درهم';
            shoeDetails = `الحذاء الأول: المقاس ${bundleSelections.bundle2.item1.size}, اللون ${getColorName(bundleSelections.bundle2.item1.color)}, الحذاء الثاني: المقاس ${bundleSelections.bundle2.item2.size}, اللون ${getColorName(bundleSelections.bundle2.item2.color)}`;
        }

        const message = `طلب جديد:
الكمية: ${quantity}
السعر: ${price_text}
الاسم: ${formData.fullName}
رقم الهاتف: ${formData.phoneNumber}
العنوان: ${formData.deliveryAddress}
${shoeDetails}`;

        const whatsappNumber = '212694138093';
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    const ColorButton = ({ colorOption, isSelected, onClick }) => (
        <button
            onClick={() => onClick(colorOption.name)}
            className={`
                w-8 h-8 rounded-full border-2 flex items-center justify-center
                transition-all duration-200 hover:scale-110
                ${isSelected ? 'ring-2 ring-blue-500 ring-offset-1 scale-110' : ''}
            `}
            style={{
                backgroundColor: colorOption.color,
                borderColor: colorOption.border
            }}
        >
            {isSelected && (
                <Check className="w-4 h-4 text-gray-600" />
            )}
        </button>
    );

    const CustomSelect = ({ value, onChange, options, placeholder }) => (
        <div className="relative">
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="
                    appearance-none bg-white border-2 border-gray-200 rounded-lg
                    px-3 py-2 pr-8 text-sm font-medium
                    focus:border-blue-500 focus:outline-none
                    transition-colors duration-200
                "
            >
                {options.map(option => (
                    <option key={option} value={option}>{option}</option>
                ))}
            </select>
            <ChevronDown className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
    );

    return (
        <div className={`max-w-md mx-auto p-4 bg-gray-50 ${selectedBundle === 'bundle1' ? 'space-y-4' : 'space-y-4 min-h-screen'}`} dir="rtl">

            {orderError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {orderError}
                </div>
            )}

            {/* Single Item Bundle */}
            <div
                className={`
                    bg-white rounded-2xl shadow-lg border-2 transition-all duration-300
                    ${selectedBundle === 'bundle1' ? 'border-blue-500 shadow-blue-100' : 'border-gray-200'}
                `}
            >
                <div
                    className="p-4 cursor-pointer"
                    onClick={() => handleBundleSelection('bundle1')}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-teal-500 rounded-xl flex items-center justify-center">
                                <Package className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-gray-800">1 حذاء :</h3>
                                <div className="flex items-center gap-2">
                                    <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded text-xs font-medium">
                                        السعر العادي
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="text-left">
                            <div className="text-2xl font-bold text-gray-800">299 د.م</div>
                        </div>
                    </div>

                    {/* Selection Options for Single Item */}
                    {selectedBundle === 'bundle1' && (
                        <div className="mt-4 pt-4 border-t border-gray-100 space-y-4">
                            {/* Size Selection */}
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-700">المقاس:</span>
                                <CustomSelect
                                    value={bundleSelections.bundle1.size}
                                    onChange={(value) => handleSingleItemChange('size', value)}
                                    options={sizes}
                                    placeholder="اختر المقاس"
                                />
                            </div>

                            {/* Color Selection */}
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-700">اللون:</span>
                                <div className="flex gap-2">
                                    {colors.map((colorOption) => (
                                        <ColorButton
                                            key={colorOption.name}
                                            colorOption={colorOption}
                                            isSelected={bundleSelections.bundle1.color === colorOption.name}
                                            onClick={(color) => handleSingleItemChange('color', color)}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Bundle of 2 Items */}
            <div
                className={`
                    bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl shadow-lg border-2 transition-all duration-300
                    ${selectedBundle === 'bundle2' ? 'border-blue-500 shadow-blue-200' : 'border-cyan-200'}
                `}
            >
                <div
                    className="p-4 cursor-pointer"
                    onClick={() => handleBundleSelection('bundle2')}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-teal-500 rounded-xl flex items-center justify-center">
                                <Package className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-gray-800">
                                    2 من الأحذية :
                                </h3>
                                <div className="flex items-center gap-2">
                                    <span className="bg-cyan-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                        <Percent className="w-3 h-3" />
                                        وفر 25%
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="text-left">
                            <div className="text-sm text-gray-500 line-through">600.00 د.م</div>
                            <div className="text-2xl font-bold text-cyan-600"> 550 د.م</div>
                        </div>
                    </div>

                    {/* Selection Options for Bundle Items */}
                    {selectedBundle === 'bundle2' && (
                        <div className="mt-4 pt-4 border-t border-white/50 space-y-6">
                            {/* First Item */}
                            <div className="bg-white/70 rounded-xl p-4 backdrop-blur-sm">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                        1
                                    </div>
                                    <span className="font-medium text-gray-700">القطعة الأولى</span>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-600">المقاس:</span>
                                        <CustomSelect
                                            value={bundleSelections.bundle2.item1.size}
                                            onChange={(value) => handleBundleItemChange('item1', 'size', value)}
                                            options={sizes}
                                            placeholder="اختر المقاس"
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-600">اللون:</span>
                                        <div className="flex gap-2">
                                            {colors.map((colorOption) => (
                                                <ColorButton
                                                    key={colorOption.name}
                                                    colorOption={colorOption}
                                                    isSelected={bundleSelections.bundle2.item1.color === colorOption.name}
                                                    onClick={(color) => handleBundleItemChange('item1', 'color', color)}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Second Item */}
                            <div className="bg-white/70 rounded-xl p-4 backdrop-blur-sm">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                        2
                                    </div>
                                    <span className="font-medium text-gray-700">القطعة الثانية</span>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-600">المقاس:</span>
                                        <CustomSelect
                                            value={bundleSelections.bundle2.item2.size}
                                            onChange={(value) => handleBundleItemChange('item2', 'size', value)}
                                            options={sizes}
                                            placeholder="اختر المقاس"
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-600">اللون:</span>
                                        <div className="flex gap-2">
                                            {colors.map((colorOption) => (
                                                <ColorButton
                                                    key={colorOption.name}
                                                    colorOption={colorOption}
                                                    isSelected={bundleSelections.bundle2.item2.color === colorOption.name}
                                                    onClick={(color) => handleBundleItemChange('item2', 'color', color)}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
                {/* Continue Button */}
                <button
                    onClick={handleOrderSubmit}
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? (
                        <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            جاري إرسال الطلب...
                        </>
                    ) : (
                        <>
                            <ShoppingCart className="w-5 h-5" />
                            إتمام الطلب
                        </>
                    )}
                </button>

                {/* WhatsApp Button */}
                <button
                    onClick={handleWhatsAppOrder}
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <MessageCircle className="w-5 h-5" />
                    طلب عبر واتساب
                </button>
            </div>
        </div>
    );
};

export default BundleOffers;