import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { DashboardLayout } from './components/dashboard/DashboardLayout'
import { DashboardPage } from './pages/Dashboard/DashboardPage'
import { OrdersPage } from './pages/Orders/OrdersPage'
import { ProductsPage } from './pages/Products/ProductsPage'
import { CustomersPage } from './pages/Customers/CustomersPage'


function App() {
  return (
    <BrowserRouter>
      {/*DashboardLayout é o "pai" de todas as rotas.
          Ele renderiza a sidebar + header, e no <Outlet />
          aparece o componente filho da rota ativa. */}
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          {/*Redireciona a rota raiz para /dashboard */}
          <Route index element={<Navigate to="/dashboard" replace/>} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="customers" element={<CustomersPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
