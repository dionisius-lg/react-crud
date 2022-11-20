import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";

const Footer = () => {

    return (
        <footer className="py-4 bg-light mt-auto">
            <Container fluid>
                <div className="d-flex align-items-center justify-content-between small">
                    <div className="text-muted">ReactJs CRUD</div>
                    <div>
                        <Link to="#">Privacy Policy</Link>
                        <Link to="#">Terms &amp; Conditions</Link>
                    </div>
                </div>
            </Container>
        </footer>
    )
}

export default Footer
