// import { useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
import { Container, Row, Col, Card, ProgressBar } from "react-bootstrap";

export const Dashboard = () => {
    // const dispatch = useDispatch();
    // const { data } = useSelector(x => x.auth);

    // console.log(data)
    // const [test, setTest] = useState(false)

    return (
        <Container fluid>
            <div className="d-sm-flex align-items-center justify-content-between my-4">
                <h1 className="h3 mb-0 text-gray-800">Dashboard</h1>
                {/* <a href="#" className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm">
                    <i className="fas fa-download fa-sm text-white-50"></i> Generate Report
                </a> */}
            </div>
            <ol className="breadcrumb mb-4">
                <li className="breadcrumb-item active">Dashboard</li>
            </ol>

            <Row>
                <Col xl={3} md={6} className="mb-4">
                    <Card className="shadow h-100 py-2">
                        <Card.Body>
                            <Row className="no-gutters align-items-center">
                                <Col className="mr-2">
                                    <div className="h6 font-weight-bold text-primary text-uppercase mb-1">
                                        Earnings (Monthly)
                                    </div>
                                    <div className="h5 font-weight-bold text-black-50 mb-0">$40,000</div>
                                </Col>
                                <Col className="col-auto">
                                    <i className="fas fa-calendar fa-2x text-black-50"></i>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={3} md={6} className="mb-4">
                    <Card className="shadow h-100 py-2">
                        <Card.Body>
                            <Row className="no-gutters align-items-center">
                                <Col className="mr-2">
                                    <div className="h6 font-weight-bold text-success text-uppercase mb-1">
                                        Earnings (Annual)
                                    </div>
                                    <div className="h5 font-weight-bold text-black-50 mb-0">$40,000</div>
                                </Col>
                                <Col className="col-auto">
                                    <i className="fas fa-dollar-sign fa-2x text-black-50"></i>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={3} md={6} className="mb-4">
                    <Card className="shadow h-100 py-2">
                        <Card.Body>
                            <Row className="no-gutters align-items-center">
                                <Col className="mr-2">
                                    <div className="h6 font-weight-bold text-info text-uppercase mb-1">
                                        Tasks
                                    </div>
                                    <Row className="no-gutters align-items-center">
                                        <Col className="col-auto">
                                            <div className="h5 mb-0 mr-3 font-weight-bold text-black-50">50%</div>
                                        </Col>
                                        <Col>
                                            <ProgressBar striped variant="secondary" now={50} min={0} max={100} style={{width: '90%'}} />
                                        </Col>
                                    </Row>
                                </Col>
                                <Col className="col-auto">
                                    <i className="fas fa-clipboard-list fa-2x text-black-50"></i>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={3} md={6} className="mb-4">
                    <Card className="shadow h-100 py-2">
                        <Card.Body>
                            <Row className="no-gutters align-items-center">
                                <Col className="mr-2">
                                    <div className="h6 font-weight-bold text-warning text-uppercase mb-1">
                                        Pending Requests
                                    </div>
                                    <div className="h5 font-weight-bold text-black-50 mb-0">18</div>
                                </Col>
                                <Col className="col-auto">
                                    <i className="fas fa-comments fa-2x text-black-50"></i>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row>
                <Col xl={8} lg={7}>
                    <Card className="shadow mb-4">
                        <Card.Header className="py-3 d-flex flex-row align-items-center justify-content-between">
                            <h6 className="m-0 font-weight-bold text-primary">Earnings Overview</h6>
                        </Card.Header>
                        <Card.Body>
                            asdasd
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}