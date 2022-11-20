import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Container, Row, Col, Card, ProgressBar, Button, Table, Spinner } from "react-bootstrap";
import { isEmptyValue } from "./../../helpers/general"
import { usersActions } from "./../../store";

export const Users = () => {
    const dispatch = useDispatch();
    const { user, error } = useSelector(x => x.auth)
    const users = useSelector(x => x.users)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (loading) dispatch(usersActions.getAll())
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading])

    useEffect(() => {
        setLoading(users?.loading || false)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [users])
console.log(users.result)
    return (
        <Container fluid>
            <div className="d-sm-flex align-items-center justify-content-between my-4">
                <h1 className="h3 mb-0 text-gray-800">Users</h1>
            </div>

            <Row>
                <Col xl={12} md={12} className="mb-4">
                    <Card className="shadow h-100 py-2">
                        <Card.Header>
                        <Button variant="outline-primary" className="btn-sm rounded-0">Add Data</Button>
                        </Card.Header>
                        <Card.Body>
                            <Table striped hover responsive width="100%" cellSpacing="0" cellPadding="0">
                                <thead>
                                    <th className="text-nowrap">NO.</th>
                                    <th className="text-nowrap">Fullname</th>
                                    <th className="text-nowrap">Username</th>
                                    <th className="text-nowrap">Email</th>
                                    <th className="text-nowrap">Action</th>
                                </thead>
                                <tbody>
                                    {loading && <tr>
                                        <td colSpan="5" className="text-center">
                                            <Spinner animation="border" size="sm" className="mr-1" />
                                            Loading data...
                                        </td>
                                    </tr>}
                                    {!loading && users.result?.data && !isEmptyValue(users.result.data) &&
                                        users.result.data.map((row, i) => (
                                            <tr key={row.id}>
                                                <td className="text-nowrap">{users.result.paging.index[i]}</td>
                                                <td className="text-nowrap">{row.fullname}</td>
                                                <td className="text-nowrap">{row.username}</td>
                                                <td className="text-nowrap">{row.email}</td>
                                                <td className="text-nowrap text-center">
                                                    <Button size="sm" className="mx-1" title="Detail Data">
                                                        <i className="fas fa-edit fa-fw"></i>
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

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