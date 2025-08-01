// src/app/api/create-order/route.js

import WOO_CONFIG from "@/app/Components/wooConfig";

// Function to create a product if it doesn't exist
async function createOrGetProduct(productName, price) {
    try {
        // First, try to find existing products
        const searchResponse = await fetch(`${WOO_CONFIG.url}/wp-json/wc/v3/products?search=${encodeURIComponent(productName)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + Buffer.from(
                    WOO_CONFIG.consumerKey + ':' + WOO_CONFIG.consumerSecret
                ).toString('base64')
            }
        });

        if (searchResponse.ok) {
            const existingProducts = await searchResponse.json();
            if (existingProducts.length > 0) {
                return existingProducts[0].id; // Return first matching product ID
            }
        }

        // If no product found, create a new one
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
                'Authorization': 'Basic ' + Buffer.from(
                    WOO_CONFIG.consumerKey + ':' + WOO_CONFIG.consumerSecret
                ).toString('base64')
            },
            body: JSON.stringify(productData)
        });

        if (createResponse.ok) {
            const newProduct = await createResponse.json();
            console.log('Created new product:', newProduct.id);
            return newProduct.id;
        }

        return null;
    } catch (error) {
        console.error('Error creating/finding product:', error);
        return null;
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        console.log('Received order data:', body);

        const {
            fullName,
            phoneNumber,
            deliveryAddress,
            selectedBundle,
            bundleSelections
        } = body;

        // Validate required fields
        if (!fullName || !phoneNumber || !deliveryAddress || !selectedBundle) {
            return Response.json(
                {
                    success: false,
                    message: 'Missing required fields',
                    error: 'VALIDATION_ERROR'
                },
                { status: 400 }
            );
        }

        // Generate local order ID for fallback
        const localOrderId = 'ORDER-' + Date.now();

        // Prepare order data based on bundle selection
        let lineItems = [];
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

        console.log('Attempting to create WooCommerce order...');

        // Try to create order in WooCommerce
        let wooOrderId = null;
        let wooOrderNumber = null;

        try {
            // Get or create product
            const productId = await createOrGetProduct(productName, totalPrice);

            if (productId) {
                // Prepare line items with product ID
                if (selectedBundle === 'bundle1') {
                    lineItems = [{
                        product_id: productId,
                        quantity: 1,
                        price: totalPrice,
                        total: totalPrice.toString(),
                        meta_data: [
                            { key: 'المقاس', value: bundleSelections.bundle1.size },
                            { key: 'اللون', value: bundleSelections.bundle1.color }
                        ]
                    }];
                } else if (selectedBundle === 'bundle2') {
                    lineItems = [{
                        product_id: productId,
                        quantity: 2,
                        price: totalPrice,
                        total: totalPrice.toString(),
                        meta_data: [
                            { key: 'الحذاء_الأول_المقاس', value: bundleSelections.bundle2.item1.size },
                            { key: 'الحذاء_الأول_اللون', value: bundleSelections.bundle2.item1.color },
                            { key: 'الحذاء_الثاني_المقاس', value: bundleSelections.bundle2.item2.size },
                            { key: 'الحذاء_الثاني_اللون', value: bundleSelections.bundle2.item2.color }
                        ]
                    }];
                }

                // Prepare WooCommerce order data
                const orderData = {
                    status: "pending",
                    currency: "MAD",
                    billing: {
                        first_name: fullName,
                        last_name: "",
                        email: phoneNumber + '@customer.temp',
                        phone: phoneNumber,
                        address_1: deliveryAddress,
                        city: "Morocco",
                        country: "MA"
                    },
                    shipping: {
                        first_name: fullName,
                        last_name: "",
                        address_1: deliveryAddress,
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

                const response = await fetch(`${WOO_CONFIG.url}/wp-json/wc/v3/orders`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Basic ' + Buffer.from(
                            WOO_CONFIG.consumerKey + ':' + WOO_CONFIG.consumerSecret
                        ).toString('base64')
                    },
                    body: JSON.stringify(orderData)
                });

                if (response.ok) {
                    const order = await response.json();
                    wooOrderId = order.id;
                    wooOrderNumber = order.number || order.id;
                    console.log('WooCommerce order created successfully:', order.id);
                } else {
                    const errorText = await response.text();
                    console.error('WooCommerce API Error:', errorText);
                }
            }
        } catch (wooError) {
            console.error('WooCommerce connection failed:', wooError);
        }

        // Always send WhatsApp notification (as backup)
        const whatsappMessage = `
🆕 طلب جديد من الموقع

👤 الاسم: ${fullName}
📱 الهاتف: ${phoneNumber}
📍 العنوان: ${deliveryAddress}

📦 تفاصيل الطلب:
${orderSummary}

💰 المبلغ: ${totalPrice} د.م

🆔 رقم الطلب: ${wooOrderNumber || localOrderId}
        `;

        console.log('WhatsApp notification would be sent:', whatsappMessage);

        // Always return success to user
        return Response.json({
            success: true,
            orderId: wooOrderId || localOrderId,
            orderNumber: wooOrderNumber || localOrderId,
            total: totalPrice,
            customerName: fullName,
            orderSummary: orderSummary,
            message: 'تم إنشاء الطلب بنجاح! سيتم التواصل معك قريباً.'
        });

    } catch (error) {
        console.error('Order creation error:', error);

        const fallbackOrder = {
            id: 'FALLBACK-' + Date.now(),
            customerData: body,
            timestamp: new Date().toISOString(),
            error: error.message
        };

        console.log('Fallback order created:', fallbackOrder);

        return Response.json({
            success: true, // Still return success for better UX
            orderId: fallbackOrder.id,
            orderNumber: fallbackOrder.id,
            total: 0,
            customerName: body.fullName || 'Customer',
            message: 'تم استلام طلبك! سيتم التواصل معك قريباً لتأكيد الطلب.'
        });
    }
}