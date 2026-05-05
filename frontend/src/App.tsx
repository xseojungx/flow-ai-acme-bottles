import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import { SuppliesPage } from './pages/SuppliesPage';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/supplies" replace />} />
        <Route
          path="/supplies"
          element={
            <SuppliesPage
              supplies={[]}
              onCreate={() => {}}
              pushToast={() => {}}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
