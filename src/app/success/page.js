'use client';

import { useSearchParams } from 'next/navigation';
import { CheckCircle, Phone, Package, ArrowRight } from 'lucide-react';
import { Suspense } from 'react';

function SuccessContent() {
    const searchParams = useSearchParams();

    const orderNumber = searchParams.get('orderNumber');
    const total = searchParams.get('total');
    const customerName = searchParams.get('customerName');
    const phone = searchParams.get('phone');

    const handleWhatsAppContact = () => {
        const message = orderNumber
            ? `مرحباً، لدي استفسار حول طلبي رقم: ${orderNumber}`
            : 'مرحباً، لدي استفسار حول طلبي';

        window.open(`https://wa.me/212694138093?text=${encodeURIComponent(message)}`, '_blank');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4" dir="rtl">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden">

                {/* Success Header */}
                <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-8 text-center">
                    <CheckCircle className="w-16 h-16 text-white mx-auto mb-4" />
                    <h1 className="text-white text-2xl font-bold mb-2">تم استلام طلبكم بنجاح!</h1>
                    <p className="text-green-100 text-sm">شكراً لثقتكم بنا</p>
                </div>

                {/* Order Details */}
                <div className="p-6 space-y-6">

                    {/* Order Summary */}
                    <div className="bg-gray-50 rounded-2xl p-4">
                        <div className="space-y-3 text-center">
                            <div className="flex items-center justify-center gap-2 mb-3">
                                <Package className="w-5 h-5 text-blue-600" />
                                <h3 className="font-bold text-gray-800">رقم الطلب #{orderNumber}</h3>
                            </div>
                            <p className="text-gray-600">المبلغ الإجمالي</p>
                            <p className="text-2xl font-bold text-green-600">{total} د.م</p>
                        </div>
                    </div>

                    {/* Customer Info */}
                    <div className="text-center space-y-2">
                        <p className="text-gray-600">العميل: <span className="font-semibold text-gray-800">{decodeURIComponent(customerName || '')}</span></p>
                        <p className="text-gray-600">الهاتف: <span className="font-semibold text-gray-800">{decodeURIComponent(phone || '')}</span></p>
                    </div>

                    {/* Contact Button */}
                    <button
                        onClick={handleWhatsAppContact}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-2xl transition-colors flex items-center justify-center gap-3"
                    >
                        <Phone className="w-5 h-5" />
                        تواصل معنا عبر واتساب
                    </button>

                    {/* Back to Home */}
                    <div className="text-center pt-4 border-t border-gray-200">
                        <a
                            href="/"
                            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
                        >
                            <ArrowRight className="w-4 h-4" />
                            العودة إلى الصفحة الرئيسية
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function SuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">جاري التحميل...</p>
                </div>
            </div>
        }>
            <SuccessContent />
        </Suspense>
    );
}