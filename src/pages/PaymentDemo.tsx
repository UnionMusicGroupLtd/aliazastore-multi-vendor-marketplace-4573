import { useState } from "react";
import PaymentOptions from "@/components/PaymentOptions";

const PaymentDemo = () => {
  const [paymentStep, setPaymentStep] = useState<'selection' | 'processing' | 'complete'>('selection');
  const [selectedPayment, setSelectedPayment] = useState<{ method: string; transactionId: string } | null>(null);

  const handlePaymentComplete = (method: string, transactionId: string) => {
    setSelectedPayment({ method, transactionId });
    setPaymentStep('complete');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Payment Integration Demo</h1>
          <p className="text-slate-600">Test the new GCash payment integration</p>
        </div>

        {paymentStep === 'selection' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <PaymentOptions 
              amount={1250.00} 
              orderId="ORD-DEMO-2025-001" 
              onPaymentComplete={handlePaymentComplete}
            />
          </div>
        )}

        {paymentStep === 'complete' && selectedPayment && (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Payment Successful!</h2>
            <p className="text-slate-600 mb-6">Your payment has been processed successfully</p>
            
            <div className="bg-slate-50 rounded-lg p-6 mb-6">
              <div className="grid grid-cols-2 gap-4 text-left">
                <div>
                  <p className="text-sm text-slate-600">Payment Method</p>
                  <p className="font-semibold capitalize">{selectedPayment.method}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Transaction ID</p>
                  <p className="font-semibold">{selectedPayment.transactionId}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Amount Paid</p>
                  <p className="font-semibold text-green-600">₱1,250.00</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Order ID</p>
                  <p className="font-semibold">ORD-DEMO-2025-001</p>
                </div>
              </div>
            </div>

            <button 
              onClick={() => {
                setPaymentStep('selection');
                setSelectedPayment(null);
              }}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Test Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentDemo;