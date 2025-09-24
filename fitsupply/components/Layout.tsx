import Header from "./Header";
import Footer from "./Footer"; // Assuming you'll create a Footer component

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className='flex flex-col min-h-screen'>
      <Header />
      <main className='flex-grow'>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
