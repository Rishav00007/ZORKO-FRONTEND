// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import { Toaster } from 'react-hot-toast';
// import { AuthProvider } from './context/AuthContext';
// import { CartProvider } from './context/CartContext';
// import Navbar from './components/Navbar';
// import Home from './pages/Home';
// import Checkout from './pages/Checkout';
// import OrderSuccess from './pages/OrderSuccess';
// import Login from './pages/Login';
// import Register from './pages/Register';
// import AdminDashboard from './pages/admin/AdminDashboard';
// import ManageMenu from './pages/admin/ManageMenu';
// import OrdersList from './pages/admin/OrdersList';
// import ProtectedRoute from './components/ProtectedRoute';
// import MyOrders from './pages/MyOrders';

// function App() {
//   return (
//     <BrowserRouter>
//       <AuthProvider>
//         <CartProvider>
//           <Toaster position="top-center" />
//           <Navbar />
//           <Routes>
//             <Route path="/" element={<Home />} />
//             <Route path="/login" element={<Login />} />
//             <Route path="/register" element={<Register />} />
//             <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
//             <Route path="/order-success/:id" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
//             <Route path="/my-orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
//             {/* Admin Routes */}
//             <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
//             <Route path="/admin/menu" element={<ProtectedRoute adminOnly><ManageMenu /></ProtectedRoute>} />
//             <Route path="/admin/orders" element={<ProtectedRoute adminOnly><OrdersList /></ProtectedRoute>} />
//           </Routes>
//         </CartProvider>
//       </AuthProvider>
//     </BrowserRouter>
//   );
// }

// export default App;





import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Login from './pages/Login';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageMenu from './pages/admin/ManageMenu';
import OrdersList from './pages/admin/OrdersList';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Toaster position="top-center" />
          <Navbar />
          <Routes>
            {/* ✅ Customer routes — fully public, no login needed */}
            <Route path="/" element={<Home />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-success/:id" element={<OrderSuccess />} />

            {/* Admin login */}
            <Route path="/admin/login" element={<Login />} />

            {/* ✅ Admin routes — only these need login */}
            <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/menu" element={<ProtectedRoute adminOnly><ManageMenu /></ProtectedRoute>} />
            <Route path="/admin/orders" element={<ProtectedRoute adminOnly><OrdersList /></ProtectedRoute>} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;