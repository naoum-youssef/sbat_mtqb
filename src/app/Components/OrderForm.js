'use client';
import { useState } from 'react';
import { User, Phone, MapPin, Package, AlertCircle } from 'lucide-react';
import styles from './OrderForm.module.css';
import BundleOffers from "@/app/Components/BundleOffers";

const OrderForm = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        phoneNumber: '',
        deliveryAddress: ''
    });

    // Add fieldErrors state for validation
    const [fieldErrors, setFieldErrors] = useState({
        fullName: false,
        phoneNumber: false,
        deliveryAddress: false
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderError, setOrderError] = useState('');

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

    // Modified handleInputChange with validation
    const handleInputChange = (e) => {
        const { name, value } = e.target;

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

    return (
        <div className={styles.orderFormContainer} dir="rtl">
            <div className={styles.orderFormCard}>
                {/* Header */}
                <div className={styles.orderFormHeader}>
                    <Package className="w-8 h-8 text-white" />
                    <h2>إكمال الطلب</h2>
                </div>

                {/* Global Error Message */}
                {orderError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 mx-4">
                        <div className="flex items-center gap-2 text-red-800">
                            <AlertCircle className="w-5 h-5 text-red-600" />
                            <span className="font-medium">{orderError}</span>
                        </div>
                    </div>
                )}

                {/* Personal Information Section */}
                <div className={styles.formSection}>
                    <h3 className={styles.sectionTitle}>المعلومات الشخصية</h3>

                    {/* Full Name */}
                    <div className={styles.inputGroup}>
                        <div className={`${styles.inputWrapper} ${fieldErrors.fullName ? 'error' : ''}`}>
                            <User className={`${styles.inputIcon} ${fieldErrors.fullName ? 'text-red-500' : ''}`} />
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                placeholder="الإسم الكامل"
                                className={`${styles.formInput} ${fieldErrors.fullName ? 'border-red-500 focus:border-red-500' : ''}`}
                                required
                            />
                        </div>
                        {fieldErrors.fullName && (
                            <div className="text-red-600 text-sm mt-1 flex items-center gap-1">
                                <AlertCircle className="w-4 h-4" />
                                {getFieldErrorMessage('fullName')}
                            </div>
                        )}
                    </div>

                    {/* Phone Number */}
                    <div className={styles.inputGroup}>
                        <div className={`${styles.inputWrapper} ${fieldErrors.phoneNumber ? 'error' : ''}`}>
                            <Phone className={`${styles.inputIcon} ${fieldErrors.phoneNumber ? 'text-red-500' : ''}`} />
                            <input
                                type="tel"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleInputChange}
                                placeholder="رقم الهاتف (مثال: 0612345678)"
                                className={`${styles.formInput} ${fieldErrors.phoneNumber ? 'border-red-500 focus:border-red-500' : ''}`}
                                maxLength="10"
                                required
                            />
                        </div>
                        {fieldErrors.phoneNumber && (
                            <div className="text-red-600 text-sm mt-1 flex items-center gap-1">
                                <AlertCircle className="w-4 h-4" />
                                {getFieldErrorMessage('phoneNumber')}
                            </div>
                        )}
                        {!fieldErrors.phoneNumber && formData.phoneNumber && (
                            <div className="text-green-600 text-sm mt-1">
                                ✓ رقم هاتف صحيح
                            </div>
                        )}
                    </div>

                    {/* Delivery Address */}
                    <div className={styles.inputGroup}>
                        <div className={`${styles.inputWrapper} ${fieldErrors.deliveryAddress ? 'error' : ''}`}>
                            <MapPin className={`${styles.inputIcon} ${fieldErrors.deliveryAddress ? 'text-red-500' : ''}`} />
                            <input
                                type="text"
                                name="deliveryAddress"
                                value={formData.deliveryAddress}
                                onChange={handleInputChange}
                                placeholder="عنوان التوصيل (مثال: حي المعاريف، شارع الحسن الثاني، الرباط)"
                                className={`${styles.formInput} ${fieldErrors.deliveryAddress ? 'border-red-500 focus:border-red-500' : ''}`}
                                required
                            />
                        </div>
                        {fieldErrors.deliveryAddress && (
                            <div className="text-red-600 text-sm mt-1 flex items-center gap-1">
                                <AlertCircle className="w-4 h-4" />
                                {getFieldErrorMessage('deliveryAddress')}
                            </div>
                        )}
                        {!fieldErrors.deliveryAddress && formData.deliveryAddress && formData.deliveryAddress.length >= 5 && (
                            <div className="text-green-600 text-sm mt-1">
                                ✓ عنوان مقبول
                            </div>
                        )}
                    </div>
                </div>

                {/* Bundle Offers with form data passed as props */}
                <BundleOffers
                    formData={formData}
                    onOrderComplete={handleOrderComplete}
                    validateForm={validateForm}
                    isFormValid={!fieldErrors.fullName && !fieldErrors.phoneNumber && !fieldErrors.deliveryAddress &&
                        formData.fullName && formData.phoneNumber && formData.deliveryAddress}
                />
            </div>
        </div>
    );
};

export default OrderForm;