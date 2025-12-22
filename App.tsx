import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { DesignProvider } from "@/contexts/DesignContext";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import MouseTrail from "@/components/MouseTrail";
import BackgroundBlobs from "@/components/BackgroundBlobs";
import AnimatedRoutes from "@/components/AnimatedRoutes";
import CartDrawer from "@/components/CartDrawer";
import ScrollToTop from "@/components/ScrollToTop";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <DesignProvider>
        <CartProvider>
          <WishlistProvider>
            <TooltipProvider>
              {/* Dynamic Background Blobs */}
              <BackgroundBlobs />
              
              {/* Mouse Trail Effect */}
              <MouseTrail />
              
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <AnimatedRoutes />
                <CartDrawer />
                <ScrollToTop />
              </BrowserRouter>
            </TooltipProvider>
          </WishlistProvider>
        </CartProvider>
      </DesignProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
