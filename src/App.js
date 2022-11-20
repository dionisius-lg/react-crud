import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import history from "./helpers/history";

// Protected Route
import Protected from "./components/Protected";
// Layout
import { AuthLayout, MainLayout } from "./components/Layout";
// Pages
import { Dashboard } from "./pages/Dashboard";
import { Login } from "./pages/Login";
import { Products } from "./pages/Products";
import { ProductCategories } from "./pages/ProductCategories";
import { Users } from "./pages/Users";

function App() {
    history.navigate = useNavigate()
    history.location = useLocation()

    // const user = JSON.parse(localStorage.getItem('user'))

    return (
        <Routes>
            <Route element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
            </Route>
            <Route element={<MainLayout />}>
                <Route path="/" element={
                    <Protected>
                        <Dashboard />
                    </Protected>
                } />
            </Route>
            <Route element={<MainLayout />}>
                <Route path="/products" element={
                    <Protected>
                        <Products />
                    </Protected>
                } />
            </Route>
            <Route element={<MainLayout />}>
                <Route path="/product-categories" element={
                    <Protected>
                        <ProductCategories />
                    </Protected>
                } />
            </Route>
            <Route element={<MainLayout />}>
                <Route path="/users" element={
                    <Protected>
                        <Users />
                    </Protected>
                } />
            </Route>
        </Routes>
    )
}

export default App
