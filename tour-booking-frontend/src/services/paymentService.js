import api from './api';

const paymentService = {
    /**
     * Create Razorpay payment order
     * @param {number} bookingId - Booking ID
     * @returns {Promise<Object>} - Payment order details
     */
    createPaymentOrder: async (bookingId) => {
        try {
            console.log('Creating payment order for booking:', bookingId);
            const response = await api.post(`/payments/create-order/${bookingId}`);
            console.log('Payment order created:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error creating payment order:', error);
            throw error;
        }
    },

    /**
     * Verify payment after successful Razorpay payment
     * @param {Object} paymentData - Payment verification data
     * @param {string} paymentData.razorpayOrderId - Razorpay Order ID
     * @param {string} paymentData.razorpayPaymentId - Razorpay Payment ID
     * @param {string} paymentData.razorpaySignature - Razorpay Signature
     * @param {number} paymentData.bookingId - Booking ID
     * @returns {Promise<string>} - Success message
     */
    verifyPayment: async (paymentData) => {
        try {
            console.log('Verifying payment:', paymentData);
            const response = await api.post('/payments/verify', paymentData);
            console.log('Payment verified:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error verifying payment:', error);
            throw error;
        }
    },

    /**
     * Handle payment failure
     * @param {string} orderId - Razorpay Order ID
     * @param {string} reason - Failure reason
     * @returns {Promise<string>} - Response message
     */
    handlePaymentFailure: async (orderId, reason) => {
        try {
            console.log('Handling payment failure:', orderId, reason);
            const response = await api.post(
                `/payments/failed?orderId=${orderId}&reason=${encodeURIComponent(reason)}`
            );
            console.log('Payment failure recorded:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error handling payment failure:', error);
            throw error;
        }
    },

    /**
     * Get all payments (admin)
     * @returns {Promise<Array>} - Array of payments
     */
    getAllPayments: async () => {
        try {
            const response = await api.get('/payments');
            return response.data;
        } catch (error) {
            console.error('Error fetching all payments:', error);
            throw error;
        }
    },

    /**
     * Get payment by ID
     * @param {number} paymentId - Payment ID
     * @returns {Promise<Object>} - Payment details
     */
    getPaymentById: async (paymentId) => {
        try {
            const response = await api.get(`/payments/${paymentId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching payment:', error);
            throw error;
        }
    },

    /**
     * Get payment details by booking ID
     * @param {number} bookingId - Booking ID
     * @returns {Promise<Object>} - Payment details
     */
    getPaymentByBookingId: async (bookingId) => {
        try {
            const response = await api.get(`/payments/booking/${bookingId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching payment by booking:', error);
            throw error;
        }
    },

    /**
     * Load Razorpay script dynamically
     * @returns {Promise<boolean>} - Returns true if loaded successfully
     */
    loadRazorpayScript: () => {
        return new Promise((resolve) => {
            // Check if script already exists
            const existingScript = document.getElementById('razorpay-script');
            if (existingScript) {
                resolve(true);
                return;
            }

            // Create and load script
            const script = document.createElement('script');
            script.id = 'razorpay-script';
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.async = true;

            script.onload = () => {
                console.log('✅ Razorpay script loaded successfully');
                resolve(true);
            };

            script.onerror = () => {
                console.error('❌ Failed to load Razorpay script');
                resolve(false);
            };

            document.body.appendChild(script);
        });
    },

    /**
     * Open Razorpay checkout modal
     * @param {Object} options - Razorpay options
     * @param {string} options.key - Razorpay Key ID
     * @param {number} options.amount - Amount in paise
     * @param {string} options.currency - Currency (INR)
     * @param {string} options.order_id - Order ID from backend
     * @param {string} options.name - Company/App name
     * @param {string} options.description - Payment description
     * @param {Object} options.prefill - Prefill user data
     * @param {Function} options.handler - Success callback
     * @param {Object} options.modal - Modal settings
     * @returns {Object} - Razorpay instance
     */
    openRazorpayCheckout: async (options) => {
        // Load script first
        const scriptLoaded = await paymentService.loadRazorpayScript();
        
        if (!scriptLoaded) {
            throw new Error('Failed to load Razorpay. Please check your internet connection.');
        }

        // Check if Razorpay is available
        if (!window.Razorpay) {
            throw new Error('Razorpay SDK not loaded');
        }

        // Create Razorpay instance
        const razorpay = new window.Razorpay(options);

        // Open checkout
        razorpay.open();

        return razorpay;
    },

    /**
     * Format amount for display (paise to rupees)
     * @param {number} amountInPaise - Amount in paise
     * @returns {string} - Formatted amount
     */
    formatAmount: (amountInPaise) => {
        const rupees = amountInPaise / 100;
        return `₹${rupees.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    },

    /**
     * Get payment status badge class
     * @param {string} status - Payment status
     * @returns {string} - CSS class name
     */
    getStatusClass: (status) => {
        const statusClasses = {
            'CREATED': 'status-created',
            'SUCCESS': 'status-success',
            'FAILED': 'status-failed'
        };
        return statusClasses[status] || 'status-default';
    },

    /**
     * Get payment status icon
     * @param {string} status - Payment status
     * @returns {string} - Icon name/emoji
     */
    getStatusIcon: (status) => {
        const statusIcons = {
            'CREATED': '⏳',
            'SUCCESS': '✅',
            'FAILED': '❌'
        };
        return statusIcons[status] || '❓';
    },

    /**
     * Download payment receipt/invoice
     * @param {Object} payment - Payment object
     * @param {Object} booking - Booking object
     */
    downloadReceipt: (payment, booking) => {
        // Create receipt content
        const receiptContent = `
            ========================================
            PAYMENT RECEIPT
            ========================================
            
            Payment ID: ${payment.id}
            Razorpay Payment ID: ${payment.razorpayPaymentId || 'N/A'}
            Order ID: ${payment.razorpayOrderId}
            
            Booking Details:
            - Booking ID: #${booking.id}
            - Tour: ${booking.tour.title}
            - Destination: ${booking.tour.destination}
            - Number of Seats: ${booking.numberOfSeats}
            
            Payment Details:
            - Amount: ${paymentService.formatAmount(payment.amount * 100)}
            - Currency: ${payment.currency}
            - Status: ${payment.status}
            - Date: ${new Date(payment.createdAt).toLocaleString('en-IN')}
            
            Customer Details:
            - Name: ${booking.user.name}
            - Email: ${booking.user.email}
            - Phone: ${booking.user.phone || 'N/A'}
            
            ========================================
            Thank you for your booking!
            ========================================
        `;

        // Create blob and download
        const blob = new Blob([receiptContent], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `receipt-${payment.id}-${Date.now()}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    }
};

export default paymentService;