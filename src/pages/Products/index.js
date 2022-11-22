import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Container, Row, Col, Card, Button, Table, Spinner, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { productsActions, productCategoriesActions } from "./../../store";
import { isEmptyValue } from "../../helpers/general";
import Pagination from "./../../components/Pagination";
import Alert from "./../../components/Alert";
import Selectbox from "./../../components/Selectbox";
import Add from "./Add";
import Detail from "./Detail";

const reactSwal = withReactContent(Swal.mixin({
    customClass: {
        confirmButton: 'btn btn-primary rounded-0 mr-2',
        cancelButton: 'btn btn-default rounded-0'
    },
    buttonsStyling: false
}))

export const Products = () => {
    const dispatch = useDispatch()
    const products = useSelector(x => x.products)
    const productCategories = useSelector(x => x.productCategories)
    const [loading, setLoading] = useState(true)
    const [alert, setAlert] = useState(false)
    const [filter, setFilter] = useState({
        name: '',
        product_category_id: ''
    })
    const [modal, setModal] = useState({
        type: null,
        show: false,
        dataId: 0
    })
    const [currentFilter, setCurrentFilter] = useState({
        page: 1,
        order: 'name',
        ...filter
    })
    const [optProductCategory, setOptProductCategory] = useState([{
        value: '',
        label: 'Choose...'
    }])

    const onChangeFilter = (key, val) => {
        setFilter({ ...filter, [key]: val })
    }

    const onSubmitFilter = (e) => {
        e.preventDefault()
        setCurrentFilter({ ...currentFilter, ...filter, page: 1 })
        setLoading(true)
    }

    const handleModal = (type, id) => {
        setModal({
            ...modal,
            type: type || null,
            show: !modal.show,
            dataId: id || 0
        })
    }

    const handleDelete = (id = 0) => {
        if (!isEmptyValue(id)) {
            reactSwal.fire({
                title: 'Delete this data?',
                text: 'This action cannot be undone.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Confirm'
            }).then((action) => {
                if (action.isConfirmed) {
                    dispatch(productsActions.remove({ id: id }))
                }
            })
        }
    }

    useEffect(() => {
        if (loading === true) dispatch(productsActions.getAll({ param: currentFilter }))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading])

    useEffect(() => {
        setLoading(products.all?.loading || false)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [products.all])

    useEffect(() => {
        const param = {
            order: 'name',
            is_active: 1
        }
        dispatch(productCategoriesActions.getAll({ param }))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        const fetchData = () => {
            let mapData = productCategories.all.data.map((row) => {
                return { value: row.id, label: row.name }
            })

            setOptProductCategory([
                ...optProductCategory,
                ...mapData
            ])
        }
        if (productCategories.all.success && productCategories.all?.total > 0) fetchData()

        return () => setOptProductCategory([{
            value: '',
            label: 'Choose...'
        }])
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [productCategories.loading])

    useEffect(() => {
        if (!products.remove.loading && products.remove.success === true) {
            setAlert({
                ...alert,
                type: 'success',
                message: 'Delete data success.',
                show: true
            })
            setLoading(true)  
        }

        if (!products.remove.loading && products.remove.success === false) {
            setAlert({
                ...alert,
                type: 'error',
                message: 'Failed to delete data.',
                show: true
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [products.remove])

    return (
        <>
            <Container fluid>
                <div className="d-sm-flex align-items-center justify-content-between my-4">
                    <h1 className="h3 mb-0 text-gray-800">Products</h1>
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
                                                value={filter.name}
                                                onChange={e => onChangeFilter('name', e.target.value)}
                                            />
                                        </Form.Group>
                                        <Form.Group className="col-md-2" controlId="category">
                                            <Form.Label>Category</Form.Label>
                                            <Selectbox
                                                option={optProductCategory}
                                                changeValue={(value) => onChangeFilter('product_category_id', value)}
                                                setValue={filter.product_category_id}
                                                isSmall={true}
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
                            <Card.Header className="bg-white">
                                <Button variant="outline-dark" size="sm" className="rounded-0" onClick={() => handleModal('add')}>
                                    Add Data
                                </Button>
                            </Card.Header>
                            <Card.Body>
                                <Table striped hover responsive width="100%" cellSpacing="0" cellPadding="0">
                                    <thead className="bg-dark text-white">
                                        <tr>
                                            <th className="text-nowrap">No.</th>
                                            <th className="text-nowrap">Name</th>
                                            <th className="text-nowrap">Category</th>
                                            <th className="text-nowrap">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading && <tr>
                                            <td colSpan="4" className="text-center">
                                                <Spinner animation="border" size="sm" className="mr-1" />
                                                Loading data...
                                            </td>
                                        </tr>}
                                        {!loading && (!products.all.success || isEmptyValue(products.all?.total)) &&
                                            <tr>
                                                <td colSpan="4" className="text-center">
                                                    <span className="text-danger">No data found</span>
                                                </td>
                                            </tr>
                                        }
                                        {!loading && products.all.success && products.all?.total > 0 &&
                                            products.all.data.map((row, i) => (
                                                <tr key={row.id}>
                                                    <td className="text-nowrap">{products.all.paging?.index[i]}</td>
                                                    <td className="text-nowrap">{row.name}</td>
                                                    <td className="text-nowrap">{row.product_category}</td>
                                                    <td className="text-nowrap text-center">
                                                        <Button variant="warning" size="sm" className="rounded-0 mx-1" title="Detail Data" onClick={() => handleModal('detail', row.id)}>
                                                            <i className="fas fa-edit fa-fw"></i>
                                                        </Button>
                                                        <Button variant="danger" size="sm" className="rounded-0 mx-1" title="Delete Data" onClick={() => handleDelete(row.id)}>
                                                            <i className="fas fa-trash-alt fa-fw"></i>
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </Table>

                                {!loading && products.all.success && products.all?.paging &&
                                    <Pagination
                                        total={products.all.total}
                                        limit={products.all.limit}
                                        paging={products.all.paging}
                                        changePage={(page) => {
                                            setCurrentFilter({ ...currentFilter, page: page })
                                            setLoading(true)
                                        }}
                                    />
                                }
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

            {modal.type === 'add' && <Add
                show={modal.show}
                close={() => handleModal()}
                alert={(result) => {
                    if (result) {
                        setAlert({ ...alert, ...result })
                        if (result?.type === 'success') setLoading(true)  
                    }
                }}
            />}

            {modal.type === 'detail' && <Detail
                show={modal.show}
                close={() => handleModal()}
                dataId={modal.dataId}
                alert={(result) => {
                    if (result) {
                        setAlert({ ...alert, ...result })
                        if (result?.type === 'success') setLoading(true)  
                    }
                }}
            />}
        </>
    )
}