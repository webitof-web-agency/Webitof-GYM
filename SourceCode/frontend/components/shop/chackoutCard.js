import Image from 'next/image';
import React from 'react';
import { columnFormatter } from '../../app/helpers/utils';
import { useI18n } from '../../app/providers/i18n';

const CheckOutCard = ({ thumbnail_image, name, price, quantity, currencySymbol, convertAmount }) => {
    const i18n = useI18n();
    return (
        <div className='flex items-center gap-3 py-3'>
            {/* Thumbnail */}
            <div className='relative shrink-0 rounded-xl overflow-hidden border border-slate-100 bg-slate-50 w-[52px] h-[52px]'>
                <Image
                    src={thumbnail_image}
                    alt={columnFormatter(name) || 'Product'}
                    fill
                    className='object-cover'
                />
                {/* Qty badge */}
                <span className='absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#5572fc] text-[9px] font-black text-white leading-none shadow'>
                    {quantity}
                </span>
            </div>

            {/* Info */}
            <div className='flex-1 min-w-0'>
                <p className='text-[12px] font-bold text-gray-800 line-clamp-1 capitalize leading-snug'>
                    {columnFormatter(name)}
                </p>
                <p className='text-[11px] text-gray-400 font-medium mt-0.5'>
                    {quantity} × {currencySymbol}{convertAmount(price?.toFixed(2))}
                </p>
            </div>

            {/* Line total */}
            <p className='shrink-0 text-[13px] font-extrabold text-[#5572fc]'>
                {currencySymbol}{convertAmount((price * quantity)?.toFixed(2))}
            </p>
        </div>
    );
};

export default CheckOutCard;