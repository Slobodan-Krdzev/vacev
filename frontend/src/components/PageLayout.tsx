import Footer from './Footer';
import Header from './Header';
import IntroAnimation from './IntroAnimation';
import IntroContent from './IntroContent';
import { IntroProvider } from '@/lib/intro-context';

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export default function PageLayout({ children, className = '' }: PageLayoutProps) {
  return (
    <IntroProvider>
      <div className="flex min-h-screen w-full min-w-0 flex-col overflow-x-hidden bg-background text-foreground">
        <Header />
        <div id="site-filter-slot" />
        <IntroAnimation />
        <IntroContent className={className}>{children}</IntroContent>
        <Footer />
      </div>
    </IntroProvider>
  );
}
