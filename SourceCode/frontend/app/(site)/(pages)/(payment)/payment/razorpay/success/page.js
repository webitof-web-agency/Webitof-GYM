"use client";
import React, { useEffect, useState } from "react";
import BasicBar from "../../../../../../../components/common/basic-bar";
import { useI18n } from "../../../../../../providers/i18n";
import { useFetch } from "../../../../../../helpers/hooks";
import { getRazorpayOrderPaymentSuccess } from "../../../../../../helpers/backend";
import { message } from "antd";
import { useRouter } from "next/navigation";
import PaymentSuccess from "../../../../../../../components/common/paymentSuccess";

const PaymentSuccessPage = () => {
    const i18n = useI18n();
    const [loading, setLoading] = useState(true);
    const [paymentSuccess, getSuccess, { error }] = useFetch(getRazorpayOrderPaymentSuccess, {}, false)
    const router = useRouter();
    const [paymentQuery, setPaymentQuery] = useState(null);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const session_id = urlParams.get('session_id');
        const razorpay_payment_id = urlParams.get('razorpay_payment_id');
        const razorpay_signature = urlParams.get('razorpay_signature');
        const razorpay_payment_link_id = urlParams.get('razorpay_payment_link_id');
        const razorpay_payment_link_reference_id = urlParams.get('razorpay_payment_link_reference_id');
        const razorpay_payment_link_status = urlParams.get('razorpay_payment_link_status');

        if (
            session_id &&
            razorpay_payment_id &&
            razorpay_signature &&
            razorpay_payment_link_id &&
            razorpay_payment_link_reference_id &&
            razorpay_payment_link_status
        ) {
            setPaymentQuery({
                session_id,
                razorpay_payment_id,
                razorpay_signature,
                razorpay_payment_link_id,
                razorpay_payment_link_reference_id,
                razorpay_payment_link_status,
            });
        } else {
            message.error('Missing payment information.');
            router.push('/');
        }
    }, [router]);

    useEffect(() => {
        if (paymentQuery) {
            getSuccess(paymentQuery);
        }
    }, [getSuccess, paymentQuery]);

    useEffect(() => {
        if (paymentSuccess?.uid || paymentSuccess?._id) {
            setLoading(false);
        }
    }, [paymentSuccess]);

    useEffect(() => {
        if (error) {
            message.error(error);
            setLoading(false);
            router.push('/payment/failed');
        }
    }, [error, router]);

    return (
        <div>
            <div>
            <BasicBar heading={i18n?.t('Payment')} subHeading={i18n?.t('Home')} />
            {loading ? (
                <div className="h-[50vh] flex items-center justify-center">
                    <h1 className="text-xl animate-bounce text-textMain">{i18n?.t('Verifying Payment...')}</h1>
                </div>
            ) : (
                <PaymentSuccess />
            )}
        </div>
        </div>
    );
};

export default PaymentSuccessPage;
