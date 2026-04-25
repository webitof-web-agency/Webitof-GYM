"use client"
import React from 'react';
import dynamic from 'next/dynamic';
import BasicBar from '../../../../components/common/basic-bar';
import { useI18n } from '../../../providers/i18n';

const SignIn = dynamic(() => import('../../../../components/signin/signin'), {
    loading: () => <div className="container py-20"><div className="h-72 animate-pulse rounded bg-[#F97316]/10" /></div>,
});

const page = () => {
    const i18n = useI18n();
    return (
        <>
            <BasicBar heading={i18n?.t('Sign In')} subHeading={i18n?.t('Sign In')} />
            <SignIn />
        </>
    );
};

export default page;

