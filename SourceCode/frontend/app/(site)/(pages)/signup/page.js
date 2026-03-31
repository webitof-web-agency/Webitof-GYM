"use client"
import React from 'react';
import dynamic from 'next/dynamic';
import BasicBar from '../../../../components/common/basic-bar';
import { useI18n } from '../../../providers/i18n';

const SignUp = dynamic(() => import('../../../../components/signin/signup'), {
    loading: () => <div className="container py-20"><div className="h-72 animate-pulse rounded bg-[#5572fc]/10" /></div>,
});

const page = () => {
    const i18n = useI18n();
    return (
        <>
            <BasicBar heading={i18n?.t('Sign Up')} subHeading={i18n?.t('Sign Up')}/>
            <SignUp/>
        </>
    );
};

export default page;
