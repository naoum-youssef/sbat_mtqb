'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Phone, MapPin, Package, AlertCircle, CheckCircle, ShoppingCart, MessageCircle } from 'lucide-react';
import BundleOffers from "@/app/Components/BundleOffers";
import WOO_CONFIG from "@/app/Components/wooConfig";

const OrderForm = () => {
    const router = useRouter();

    const [formData, setFormData] = useState({
        fullName: '',
        phoneNumber: '',
        deliveryAddress: ''
    });

    // Add state for bundle selections
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

    // Add fieldErrors state for validation
    const [fieldErrors, setFieldErrors] = useState({
        fullName: false,
        phoneNumber: false,
        deliveryAddress: false
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderError, setOrderError] = useState('');

    // Colors configuration
    const colors = [
        {name: 'white', color: '#FFFFFF', arabicName: 'أبيض', border: '#E5E7EB'},
        {name: 'brown', color: '#8B4513', arabicName: 'بني', border: '#8B4513'},
        {name: 'black', color: '#000000', arabicName: 'أسود', border: '#000000'}
    ];

    // Meta Pixel tracking functions
    const trackPurchase = (buttonType, price) => {
        if (typeof window !== 'undefined' && window.fbq) {
            window.fbq('track', 'Purchase', {
                value: price,
                currency: 'MAD',
                content_name: buttonType === 'order' ? 'حذاء مغربي تقليدي - إتمام الطلب' : 'حذاء مغربي تقليدي - طلب عبر واتساب',
                content_category: 'أحذية',
                content_type: 'product'
            });
        }
    };

    const trackViewContent = () => {
        if (typeof window !== 'undefined' && window.fbq) {
            window.fbq('track', 'ViewContent', {
                content_name: 'نموذج طلب الأحذية المغربية',
                content_category: 'أحذية',
                value: 299,
                currency: 'MAD'
            });
        }
    };

    const trackInitiateCheckout = () => {
        if (typeof window !== 'undefined' && window.fbq) {
            window.fbq('track', 'InitiateCheckout', {
                content_name: 'بدء عملية الطلب - أحذية مغربية',
                value: selectedBundle === 'bundle1' ? 299 : 550,
                currency: 'MAD'
            });
        }
    };

    const trackLead = (leadType) => {
        if (typeof window !== 'undefined' && window.fbq) {
            window.fbq('track', 'Lead', {
                content_name: leadType === 'whatsapp' ? 'عميل محتمل - واتساب' : 'عميل محتمل - نموذج',
                content_category: 'أحذية'
            });
        }
    };

    // Track page view when component loads
    useEffect(() => {
        trackViewContent();
    }, []);

    // Validate a single field
    const validateField = (name, value) => {
        let error = false;

        switch (name) {
            case 'fullName':
                error = !value.trim() || value.trim().length < 2;
                break;
            case 'phoneNumber':
                // Moroccan phone number validation: starts with 05, 06, or 07 and has 10 digits
                const moroccanPhonePattern = /^(0[5-7]\d{8})$/;
                error = value.trim() === '' || !moroccanPhonePattern.test(value.trim());
                break;
            case 'deliveryAddress':
                error = value.trim() === '' || value.trim().length < 5;
                break;
            default:
                break;
        }

        setFieldErrors(prev => ({
            ...prev,
            [name]: error
        }));

        return !error;
    };

    // Modified handleInputChange with validation and tracking
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Track first interaction (only once per field)
        if (!formData[name] && value) {
            trackInitiateCheckout();
        }

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear any existing order error when user starts typing
        if (orderError) {
            setOrderError('');
        }

        // Validate after a short delay to allow typing
        setTimeout(() => validateField(name, value), 500);
    };

    // Add validateForm function
    const validateForm = () => {
        // Reset previous errors
        setOrderError('');

        // Check if required fields are empty
        if (!formData.fullName.trim()) {
            setOrderError('يرجى إدخال الاسم الكامل');
            setFieldErrors(prev => ({ ...prev, fullName: true }));
            return false;
        }

        if (formData.fullName.trim().length < 2) {
            setOrderError('يرجى إدخال اسم صحيح (على الأقل حرفين)');
            setFieldErrors(prev => ({ ...prev, fullName: true }));
            return false;
        }

        if (!formData.phoneNumber.trim()) {
            setOrderError('يرجى إدخال رقم الهاتف');
            setFieldErrors(prev => ({ ...prev, phoneNumber: true }));
            return false;
        }

        // Validate phone number format
        const moroccanPhonePattern = /^(0[5-7]\d{8})$/;
        if (!moroccanPhonePattern.test(formData.phoneNumber.trim())) {
            setOrderError('يرجى إدخال رقم هاتف صحيح مكون من 10 أرقام يبدأ ب 06 أو 07 أو 05');
            setFieldErrors(prev => ({ ...prev, phoneNumber: true }));
            return false;
        }

        if (!formData.deliveryAddress.trim()) {
            setOrderError('يرجى إدخال عنوان التوصيل');
            setFieldErrors(prev => ({ ...prev, deliveryAddress: true }));
            return false;
        }

        // Validate that the address is detailed enough
        if (formData.deliveryAddress.trim().length < 5) {
            setOrderError('يرجى إدخال عنوان مفصل للتوصيل (على الأقل 5 أحرف)');
            setFieldErrors(prev => ({ ...prev, deliveryAddress: true }));
            return false;
        }

        // If all validations pass
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
        trackLead('form');

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
                    quantity: 1,
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

                console.log('✅ Order created successfully - Server-side notifications will be triggered automatically');

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
        trackLead('whatsapp');

        const getColorName = (colorName) => {
            const color = colors.find(c => c.name === colorName);
            return color ? color.arabicName : colorName;
        };

        let shoeDetails = '';
        let priceText = '';
        let quantity = '';

        if (selectedBundle === 'bundle1') {
            quantity = '1 حذاء';
            priceText = '299 درهم';
            shoeDetails = `الحذاء: المقاس ${bundleSelections.bundle1.size}, اللون ${getColorName(bundleSelections.bundle1.color)}`;
        } else {
            quantity = '2 من الأحذية';
            priceText = '550 درهم';
            shoeDetails = `الحذاء الأول: المقاس ${bundleSelections.bundle2.item1.size}, اللون ${getColorName(bundleSelections.bundle2.item1.color)}, الحذاء الثاني: المقاس ${bundleSelections.bundle2.item2.size}, اللون ${getColorName(bundleSelections.bundle2.item2.color)}`;
        }

        const message = `طلب جديد:
الكمية: ${quantity}
السعر: ${priceText}
الاسم: ${formData.fullName}
رقم الهاتف: ${formData.phoneNumber}
العنوان: ${formData.deliveryAddress}
${shoeDetails}`;

        const whatsappNumber = '212694138093';
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    const handleOrderComplete = (orderDetails) => {
        // Handle successful order completion
        console.log('Order completed:', orderDetails);
    };

    // Function to get error message for a field
    const getFieldErrorMessage = (fieldName) => {
        if (!fieldErrors[fieldName]) return '';

        switch (fieldName) {
            case 'fullName':
                return formData.fullName.trim() === '' ? 'الاسم مطلوب' : 'يرجى إدخال اسم صحيح';
            case 'phoneNumber':
                if (formData.phoneNumber.trim() === '') return 'رقم الهاتف مطلوب';
                return 'رقم هاتف غير صحيح (مثال: 0612345678)';
            case 'deliveryAddress':
                if (formData.deliveryAddress.trim() === '') return 'عنوان التوصيل مطلوب';
                return 'يرجى إدخال عنوان مفصل';
            default:
                return '';
        }
    };

    // Check if form is valid for button enabling
    const isFormValid = () => {
        return !fieldErrors.fullName &&
            !fieldErrors.phoneNumber &&
            !fieldErrors.deliveryAddress &&
            formData.fullName.trim() !== '' &&
            formData.phoneNumber.trim() !== '' &&
            formData.deliveryAddress.trim() !== '';
    };

    // Check if field is valid and has content
    const isFieldValid = (fieldName) => {
        return !fieldErrors[fieldName] && formData[fieldName] && formData[fieldName].trim().length > 0;
    };

    return (
        <div className="min-h-screen bg-gray-50" dir="rtl">
            <div className="max-w-md mx-auto">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6 text-center">
                    <div className="flex items-center justify-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                            <Package className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-white">إكمال الطلب</h1>
                    </div>
                    <p className="text-blue-100 text-sm">أدخل بياناتك لإتمام عملية الشراء</p>
                </div>

                <div className="p-4 space-y-4">
                    {/* Global Error Message */}
                    {orderError && (
                        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 shadow-sm">
                            <div className="flex items-center gap-3 text-red-800">
                                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                    <AlertCircle className="w-4 h-4 text-red-600" />
                                </div>
                                <span className="font-medium text-sm">{orderError}</span>
                            </div>
                        </div>
                    )}

                    {/* Bundle Offers moved here - right after header */}
                    <BundleOffers
                        formData={formData}
                        onOrderComplete={handleOrderComplete}
                        validateForm={validateForm}
                        isFormValid={isFormValid()}
                        selectedBundle={selectedBundle}
                        setSelectedBundle={setSelectedBundle}
                        bundleSelections={bundleSelections}
                        setBundleSelections={setBundleSelections}
                        showButtons={false}
                    />

                    {/* Personal Information Section */}
                    <div className="bg-white rounded-2xl shadow-lg border-2 border-blue-300 p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center">
                                <User className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-800">المعلومات الشخصية</h3>
                        </div>

                        <div className="space-y-5">
                            {/* Full Name */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <User className="w-4 h-4 text-gray-500" />
                                    الإسم الكامل
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        placeholder="أدخل اسمك الكامل"
                                        className={`
                                            w-full px-4 py-3 pr-11 rounded-xl border-2 
                                            font-medium text-gray-800 placeholder-gray-400
                                            transition-all duration-200 focus:outline-none
                                            ${fieldErrors.fullName
                                            ? 'border-red-300 focus:border-red-500 bg-red-50'
                                            : isFieldValid('fullName')
                                                ? 'border-green-300 focus:border-green-500 bg-green-50'
                                                : 'border-gray-200 focus:border-blue-500 bg-white hover:border-gray-300'
                                        }
                                        `}
                                        required
                                    />
                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                        {isFieldValid('fullName') ? (
                                            <CheckCircle className="w-5 h-5 text-green-500" />
                                        ) : (
                                            <User className={`w-5 h-5 ${fieldErrors.fullName ? 'text-red-400' : 'text-gray-400'}`} />
                                        )}
                                    </div>
                                </div>
                                {fieldErrors.fullName && (
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-2 text-red-700 text-sm flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4 text-red-500" />
                                        {getFieldErrorMessage('fullName')}
                                    </div>
                                )}
                            </div>

                            {/* Phone Number */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-gray-500" />
                                    رقم الهاتف
                                </label>
                                <div className="relative">
                                    <input
                                        type="tel"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleInputChange}
                                        placeholder="أدخل رقم هاتفك (0612345678)"
                                        className={`
                                            w-full px-4 py-3 pr-11 rounded-xl border-2 
                                            font-medium text-gray-800 placeholder-gray-400
                                            transition-all duration-200 focus:outline-none
                                            ${fieldErrors.phoneNumber
                                            ? 'border-red-300 focus:border-red-500 bg-red-50'
                                            : isFieldValid('phoneNumber')
                                                ? 'border-green-300 focus:border-green-500 bg-green-50'
                                                : 'border-gray-200 focus:border-blue-500 bg-white hover:border-gray-300'
                                        }
                                        `}
                                        maxLength="10"
                                        required
                                    />
                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                        {isFieldValid('phoneNumber') ? (
                                            <CheckCircle className="w-5 h-5 text-green-500" />
                                        ) : (
                                            <Phone className={`w-5 h-5 ${fieldErrors.phoneNumber ? 'text-red-400' : 'text-gray-400'}`} />
                                        )}
                                    </div>
                                </div>
                                {fieldErrors.phoneNumber && (
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-2 text-red-700 text-sm flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4 text-red-500" />
                                        {getFieldErrorMessage('phoneNumber')}
                                    </div>
                                )}
                            </div>

                            {/* Delivery Address */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-gray-500" />
                                    عنوان التوصيل
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="deliveryAddress"
                                        value={formData.deliveryAddress}
                                        onChange={handleInputChange}
                                        placeholder="حي المعاريف، شارع الحسن الثاني، الرباط"
                                        className={`
                                            w-full px-4 py-3 pr-11 rounded-xl border-2 
                                            font-medium text-gray-800 placeholder-gray-400
                                            transition-all duration-200 focus:outline-none
                                            ${fieldErrors.deliveryAddress
                                            ? 'border-red-300 focus:border-red-500 bg-red-50'
                                            : isFieldValid('deliveryAddress')
                                                ? 'border-green-300 focus:border-green-500 bg-green-50'
                                                : 'border-gray-200 focus:border-blue-500 bg-white hover:border-gray-300'
                                        }
                                        `}
                                        required
                                    />
                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                        {isFieldValid('deliveryAddress') ? (
                                            <CheckCircle className="w-5 h-5 text-green-500" />
                                        ) : (
                                            <MapPin className={`w-5 h-5 ${fieldErrors.deliveryAddress ? 'text-red-400' : 'text-gray-400'}`} />
                                        )}
                                    </div>
                                </div>
                                {fieldErrors.deliveryAddress && (
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-2 text-red-700 text-sm flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4 text-red-500" />
                                        {getFieldErrorMessage('deliveryAddress')}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons - Added under delivery address */}
                        <div className="space-y-3 mt-6">
                            {/* Continue Button */}
                            <button
                                type="button"
                                onClick={handleOrderSubmit}
                                disabled={isSubmitting}
                                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed relative z-10"
                                style={{ pointerEvents: 'auto' }}
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
                                type="button"
                                onClick={handleWhatsAppOrder}
                                disabled={isSubmitting}
                                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed relative z-10"
                                style={{ pointerEvents: 'auto' }}
                            >
                                <MessageCircle className="w-5 h-5" />
                                طلب عبر واتساب
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderForm;