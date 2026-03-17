'use client';
import { Card } from 'antd';
import React from 'react';
import {
    fetchTheme,
} from '../../../../../helpers/backend';
import { useFetch } from '../../../../../helpers/hooks';
import Home1 from '../../../../../../components/admin/pagesetting/home/home1';
import Home2 from '../../../../../../components/admin/pagesetting/home/home2';
import Home3 from '../../../../../../components/admin/pagesetting/home/home3';
import Home4 from '../../../../../../components/admin/pagesetting/home/home4';

const HomePageSetting = ({ slug }) => {
    const [theme] = useFetch(fetchTheme);
    const isDefaultTheme = theme?.filter((i) => i?.isDefault === true);
    const defaultName = isDefaultTheme?.[0]?.name;

    if (!Array.isArray(theme)) {
        return (
            <Card>
                <div className="text-gray-600">Loading…</div>
            </Card>
        );
    }

    if (defaultName === 'home1') {
        return (
            <Card>
                <Home1 slug={slug} />
            </Card>
        );
    }
    else if (defaultName === 'home2') {
        return (
            <Card>
                <Home2 slug={slug} />
            </Card>
        );
    }
    else if (defaultName === 'home3') {
        return (
            <Card>
                <Home3 slug={slug} />
            </Card>
        );  
    }
    else if (defaultName === 'home4') {
        return (
            <Card>
                <Home4 slug={slug} />
            </Card>
        );  
    }

    return (
        <Card>
            <Home1 slug={slug} />
        </Card>
    );
};

export default HomePageSetting;
