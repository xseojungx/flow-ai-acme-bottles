import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import { OrdersPage } from './pages/OrdersPage';
import { SuppliesPage } from './pages/SuppliesPage';

export const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Navigate to="/orders" replace />} />
      <Route
        path="/orders"
        element={<OrdersPage orders={[]} onCreate={() => {}} pushToast={() => {}} />}
      />
      <Route
        path="/supplies"
        element={<SuppliesPage supplies={[]} onCreate={() => {}} pushToast={() => {}} />}
      />
    </Routes>
  </BrowserRouter>
);
