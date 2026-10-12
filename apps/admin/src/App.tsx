import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './auth';
import { Layout } from './Layout';
import { Analytics, Auctions, Content, Customers, Login, Overview, Payments, Sales, Settings, Vehicles } from './pages';

export function App() {
  const { admin } = useAuth();
  if (!admin) {
    return (
      <Routes>
        <Route path="*" element={<Login />} />
      </Routes>
    );
  }
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Overview />} />
        <Route path="vehicles" element={<Vehicles />} />
        <Route path="sales" element={<Sales />} />
        <Route path="auctions" element={<Auctions />} />
        <Route path="customers" element={<Customers />} />
        <Route path="payments" element={<Payments />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="content" element={<Content />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
