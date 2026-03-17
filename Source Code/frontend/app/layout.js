import '../styles/global.scss';
import I18nProvider from './providers/i18n';
import Providers from './providers/userProvider';
import SiteProvider from './contexts/site';

export default function RootLayout({ children }) {
    return (
        <html lang='en' suppressHydrationWarning>
            <head>
                <title>Gymstick</title>
                <meta name="description" content="Manage your gym with Gymstick" />
            </head>
            <I18nProvider>
                <SiteProvider>
                    <Providers>
                        <body>{children}</body>
                    </Providers>
                </SiteProvider>
            </I18nProvider>
        </html>
    );
}
