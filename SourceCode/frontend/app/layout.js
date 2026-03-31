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
                        <body>
                            <a
                                href="#main-content"
                                className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[9999] focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:text-black"
                            >
                                Skip to content
                            </a>
                            <main id="main-content">{children}</main>
                        </body>
                    </Providers>
                </SiteProvider>
            </I18nProvider>
        </html>
    );
}
