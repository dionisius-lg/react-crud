// import { useState } from "react";
// import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Nav, Navbar, Dropdown, Button } from "react-bootstrap";
import { authActions } from "../store";
import { strTok } from "../helpers/general";

const Topbar = () => {
    const dispatch = useDispatch()
    const { user } = useSelector(x => x.auth)
    const logout = () => dispatch(authActions.logout())

    const toggleClass = () => {
        document.body.classList.toggle("sb-sidenav-toggled");
    }

    return (
        <Navbar className="sb-topnav navbar navbar-expand navbar-dark bg-dark">
            <a className="navbar-brand" href="index.html">{process.env.REACT_APP_NAME}</a>
            <Button variant="dark" size="sm" className="order-1 order-lg-0" id="sidebarToggle" onClick={toggleClass}>
                <i className="fas fa-bars text-secondary"></i>
            </Button>

            <Nav className="navbar-nav ml-auto mr-0 mr-md-3 my-2 my-md-0">
                <Dropdown as={Nav.Item}>
                    <Dropdown.Toggle as={Nav.Link} id="dropdownUser" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <i className="fas fa-user fa-fw"></i> {strTok(user?.fullname || 'User')}
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="dropdown-menu-right" aria-labelledby="dropdownUser">
                        <Dropdown.Item href="#">Profile</Dropdown.Item>
                        <Dropdown.Item href="#" disabled={true}>Config</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item onClick={logout}>Logout</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </Nav>
        </Navbar>
    )
}

export default Topbar