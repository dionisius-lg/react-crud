import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Container, Row, Col, Card, Button, Table, Spinner, Form } from "react-bootstrap";
import { productCategoriesActions } from "./../../store";
import { reactSwal } from "./../../helpers/general";
import Pagination from "./../../components/Pagination";
import Alert from "./../../components/Alert";
import Add from "./Add";
import Detail from "./Detail";

export const ProductCategories = () => {
    const dispatch = useDispatch()
    const { all, remove } = useSelector(x => x.productCategories)
    const [loading, setLoading] = useState(true)
    const [alert, setAlert] = useState(false)
    const [param, setParam] = useState({
        page: 1,
        order: 'name',
        name: ''
    })
    const [action, setAction] = useState({
        type: null,
        dataId: 0
    })

    const onChangeFilter = (key, val) => {
        setParam({ ...param, [key]: val })
    }

    const onSubmitFilter = (e) => {
        e.preventDefault()
        setParam({ ...param, page: 1 })
        setLoading(true)
    }

    const handleAction = (type, id) => {
        setAction({
            ...action,
            type: type || null,
            dataId: id || 0
        })
    }

    useEffect(() => {
        if (loading === true) dispatch(productCategoriesActions.getAll({ param }))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading])

    useEffect(() => {
        setLoading(all?.loading || false)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [all])

    useEffect(() => {
        if (!remove.loading && remove?.error) {
            setAlert({
                ...alert,
                type: 'error',
                message: 'Failed to remove data.',
                show: true
            })
        }

        if (!remove.loading && remove?.result) {
            setAlert({
                ...alert,
                type: 'success',
                message: 'Remove data success.',
                show: true
            })
            setLoading(true)
        }

        return () => dispatch(productCategoriesActions.clearState())
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [remove])

    useEffect(() => {
        const removeData = () => {
            reactSwal.fire({
                title: 'Remove this data?',
                text: 'This action cannot be undone.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Confirm'
            }).then((result) => {
                if (result.isConfirmed) {
                    dispatch(productCategoriesActions.remove({ id: action.dataId }))
                }
            })
        }

        if (action.type === 'remove') removeData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [action])

    return (
        <>
            <Container fluid>
                <div className="d-sm-flex align-items-center justify-content-between my-4">
                    <h1 className="h3 mb-0 text-gray-800">Product Categoriess</h1>
                </div>
                <div>
                    {!!alert && <Alert
                        type={alert.type}
                        message={alert.message}
                        show={alert.show}
                        hide={() => setAlert(false)}
                    />}
                </div>

                <Row>
                    <Col xl={12} md={12} className="mb-4">
                        <Card className="shadow h-100 py-2">
                            <Card.Header>
                            <i className="fas fa-table mr-1"></i> Filter Data
                            </Card.Header>
                            <Card.Body>
                                <Form onSubmit={onSubmitFilter} autoComplete="off">
                                    <Form.Row>
                                        <Form.Group className="col-md-2" controlId="name">
                                            <Form.Label>Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                size="sm"
                                                value={param.name}
                                                onChange={e => onChangeFilter('name', e.target.value)}
                                            />
                                        </Form.Group>
                                    </Form.Row>
                                    <Form.Row>
                                        <Form.Group className="col-md-12 mb-0">
                                            <Button type="submit" variant="dark" size="sm" className="rounded-0">Search</Button>
                                        </Form.Group>
                                    </Form.Row>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col xl={12} md={12} className="mb-4">
                        <Card className="shadow h-100 py-2">
                            <Card.Header>
                                <Button variant="outline-dark" size="sm" className="rounded-0" onClick={() => handleAction('add')}>
                                    Add Data
                                </Button>
                            </Card.Header>
                            <Card.Body>
                                <Table striped hover responsive width="100%" cellSpacing="0" cellPadding="0">
                                    <thead className="bg-dark text-white">
                                        <tr>
                                            <th className="text-nowrap">No.</th>
                                            <th className="text-nowrap">Name</th>
                                            <th className="text-nowrap">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading && <tr>
                                            <td colSpan="3" className="text-center">
                                                <Spinner animation="border" size="sm" className="mr-1" />
                                                Loading data...
                                            </td>
                                        </tr>}
                                        {!loading && (all?.error || all?.result?.total === 0) &&
                                            <tr>
                                                <td colSpan="3" className="text-center">
                                                    <span className="text-danger">No data found</span>
                                                </td>
                                            </tr>
                                        }
                                        {!loading && all?.result &&
                                            all.result.data.map((row, i) => (
                                                <tr key={row.id}>
                                                    <td className="text-nowrap">{all.result.paging.index[i]}</td>
                                                    <td className="text-nowrap">{row.name}</td>
                                                    <td className="text-nowrap text-center">
                                                        <Button variant="warning" size="sm" className="rounded-0 mx-1" title="Detail Data" onClick={() => handleAction('detail', row.id)}>
                                                            <i className="fas fa-edit fa-fw"></i>
                                                        </Button>
                                                        <Button variant="danger" size="sm" className="rounded-0 mx-1" title="Remove Data" onClick={() => handleAction('remove', row.id)}>
                                                            <i className="fas fa-trash-alt fa-fw"></i>
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </Table>

                                {!loading && all?.result?.paging &&
                                    <Pagination
                                        total={all.result.total}
                                        limit={all.result.limit}
                                        paging={all.result.paging}
                                        changePage={(num) => {
                                            setParam({ ...param, page: num })
                                            setLoading(true)
                                        }}
                                    />
                                }
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

            {action.type === 'add' && <Add
                show={true}
                close={() => handleAction()}
                alert={(result) => {
                    if (result) {
                        setAlert({ ...alert, ...result })
                        if (result?.type === 'success') setLoading(true)  
                    }
                    dispatch(productCategoriesActions.clearState())
                }}
            />}

            {action.type === 'detail' && <Detail
                show={true}
                close={() => handleAction()}
                alert={(result) => {
                    if (result) {
                        setAlert({ ...alert, ...result })
                        if (result?.type === 'success') setLoading(true)  
                    }
                    dispatch(productCategoriesActions.clearState())
                }}
                id={action.dataId}
            />}
        </>
    )
}