import { NavLink } from "react-router-dom";
import { Nav } from "react-bootstrap";

const Sidebar = () => {
    return (
        <div id="layoutSidenav_nav">
            <Nav className="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
                <div className="sb-sidenav-menu">
                    <NavLink to="/" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>
                        Dashboard
                    </NavLink>
                    <NavLink to="/product-categories" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>
                        Product Categories
                    </NavLink>
                    <NavLink to="/products" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>
                        Products
                    </NavLink>
                    <NavLink to="/users" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>
                        Users
                    </NavLink>
                </div>
            </Nav>
        </div>
    )
}

export default Sidebar