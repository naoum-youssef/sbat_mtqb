'use client';
import { useEffect, useState } from 'react';
import { CheckCircle, Package, Phone, MapPin, ShoppingCart, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SuccessPage() {
    const [orderDetails, setOrderDetails] = useState(null);
    const router = useRouter();

    useEffect(() => {
        // Get order details from localStorage or URL params
        const storedOrder = localStorage.getItem('lastOrder');
        if (storedOrder) {
            setOrderDetails(JSON.parse(storedOrder));
        }
    }, []);

    const handleWhatsAppContact = () => {
        const message = orderDetails
            ? `مرحباً، لدي استفسار حول طلبي رقم: ${orderDetails.orderNumber || orderDetails.orderId}`
            : 'مرحباً، لدي استفسار حول طلبي';

        window.open(`https://wa.me/212694138093?text=${encodeURIComponent(message)}`, '_blank');
    };

    const handleNewOrder = () => {
        localStorage.removeItem('lastOrder');
        router.push('/');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4" dir="rtl">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden">
                {/* Success Header */}
                <div className="bg-gradient-to-r from-green-500 to-green-600 p-8 text-center text-white">
                    <CheckCircle className="w-20 h-20 mx-auto mb-4 animate-bounce" />
                    <h1 className="text-2xl font-bold mb-2">تم إنشاء طلبك بنجاح!</h1>
                    <p className="text-green-100">شكراً لك على ثقتك بنا</p>
                </div>

                {/* Order Details */}
                <div className="p-6 space-y-6">
                    {orderDetails && (
                        <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
                            <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                                <Package className="w-5 h-5 text-green-600" />
                                تفاصيل الطلب
                            </h3>

                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">رقم الطلب:</span>
                                    <span className="font-bold text-green-600">
                                        #{orderDetails.orderNumber || orderDetails.orderId}
                                    </span>
                                </div>

                                {orderDetails.total && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">المبلغ الإجمالي:</span>
                                        <span className="font-bold text-gray-800">
                                            {orderDetails.total} د.م
                                        </span>
                                    </div>
                                )}

                                {orderDetails.customerName && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">الاسم:</span>
                                        <span className="font-medium">{orderDetails.customerName}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Next Steps */}
                    <div className="space-y-4">
                        <h3 className="font-bold text-lg text-gray-800">الخطوات التالية:</h3>

                        <div className="space-y-3">
                            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl">
                                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                                    1
                                </div>
                                <div>
                                    <p className="font-medium text-blue-900">تأكيد الطلب</p>
                                    <p className="text-sm text-blue-700">سيتم التواصل معك خلال 30 دقيقة لتأكيد الطلب</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-xl">
                                <div className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                                    2
                                </div>
                                <div>
                                    <p className="font-medium text-amber-900">التحضير والتغليف</p>
                                    <p className="text-sm text-amber-700">سيتم تحضير طلبك بعناية فائقة</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-xl">
                                <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                                    3
                                </div>
                                <div>
                                    <p className="font-medium text-green-900">التوصيل</p>
                                    <p className="text-sm text-green-700">سيصلك الطلب خلال 24-48 ساعة</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3 pt-4">
                        <button
                            onClick={handleWhatsAppContact}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
                        >
                            <Phone className="w-5 h-5" />
                            تواصل معنا عبر واتساب
                        </button>

                        <button
                            onClick={handleNewOrder}
                            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3"
                        >
                            <ShoppingCart className="w-5 h-5" />
                            طلب جديد
                        </button>
                    </div>

                    {/* Trust Indicators */}
                    <div className="border-t pt-6">
                        <div className="grid grid-cols-2 gap-4 text-center">
                            <div className="space-y-2">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                                    <Package className="w-6 h-6 text-blue-600" />
                                </div>
                                <p className="text-sm font-medium text-gray-800">توصيل مجاني</p>
                            </div>

                            <div className="space-y-2">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                    <CheckCircle className="w-6 h-6 text-green-600" />
                                </div>
                                <p className="text-sm font-medium text-gray-800">ضمان الجودة</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}