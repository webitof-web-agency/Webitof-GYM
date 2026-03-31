import SiteClientShell from "./site-client-shell";

const Layout = ({ children }) => {
    return (
        <>
          <SiteClientShell>{children}</SiteClientShell>
        </>
    );
};

export default Layout;
