import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { ToastProvider } from "./contexts/ToastContext";
import { Sidebar } from "./components/ui/Sidebar";
import { OrdersPage } from "./pages/OrdersPage";
import { ProductionPage } from "./pages/ProductionPage";
import { SuppliesPage } from "./pages/SuppliesPage";

export const App = () => (
  <BrowserRouter>
    <ToastProvider>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 overflow-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/production" replace />} />
            <Route path="/production" element={<ProductionPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/supplies" element={<SuppliesPage />} />
          </Routes>
        </div>
      </div>
    </ToastProvider>
  </BrowserRouter>
);
