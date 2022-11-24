import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Container, Row, Col, Card, Button, Table, Spinner, Form, Badge } from "react-bootstrap";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { usersActions, userLevelsActions } from "./../../store";
import { reactSwal, defaultOpt } from "./../../helpers/general";
import Pagination from "./../../components/Pagination";
import Alert from "./../../components/Alert";
import Select from "./../../components/Select";
import Add from "./Add";
import Detail from "./Detail";

export const Users = () => {
    const dispatch = useDispatch()
    const { user: authUser } = useSelector(x => x.auth)
    const { all, remove } = useSelector(x => x.users)
    const levels = useSelector(x => x.userLevels.all)
    const [loading, setLoading] = useState(true)
    const [alert, setAlert] = useState(false)
    const [param, setParam] = useState({
        page: 1,
        order: 'fullname',
        fullname: '',
        username: '',
        user_level_id: '',
        email: '',
    })
    const [action, setAction] = useState({
        type: null,
        dataId: 0
    })
    const [optionLevel, setOptionLevel] = useState(defaultOpt)

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
        dispatch(userLevelsActions.getAll({
            order: 'name',
            is_active: 1
        }))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (loading) dispatch(usersActions.getAll({ param }))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading])

    useEffect(() => {
        setLoading(all?.loading || false)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [all])

    useEffect(() => {
        const fetchData = () => {
            let mapData = levels.result.data.map((row) => {
                return { value: row.id, label: row.name }
            })

            setOptionLevel([
                ...defaultOpt,
                ...mapData
            ])
        }

        if (!levels.loading && !levels.error && levels?.result?.total > 0) fetchData()
        return () => setOptionLevel(defaultOpt)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [levels])

    useEffect(() => {
        if (!remove.loading && remove.error) {
            setAlert({
                ...alert,
                type: 'error',
                message: 'Failed to remove data.',
                show: true
            })
        }

        if (!remove.loading && !remove.error && remove?.result) {
            setAlert({
                ...alert,
                type: 'success',
                message: 'Data successfully removed.',
                show: true
            })
            setLoading(true)
        }

        return () => dispatch(usersActions.clearState())
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
                    dispatch(usersActions.remove({ id: action.dataId }))
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
                    <h1 className="h3 mb-0 text-gray-800">Users</h1>
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
                                        <Form.Group className="col-md-2" controlId="fullname">
                                            <Form.Label>Fullname</Form.Label>
                                            <Form.Control
                                                type="text"
                                                size="sm"
                                                value={param.fullname}
                                                onChange={e => onChangeFilter('fullname', e.target.value)}
                                            />
                                        </Form.Group>
                                        <Form.Group className="col-md-2" controlId="username">
                                            <Form.Label>Username</Form.Label>
                                            <Form.Control
                                                type="text"
                                                size="sm"
                                                value={param.username}
                                                onChange={e => onChangeFilter('username', e.target.value)}
                                            />
                                        </Form.Group>
                                        <Form.Group className="col-md-2" controlId="user_level_id">
                                            <Form.Label>User Level</Form.Label>
                                            <Select
                                                option={optionLevel}
                                                changeValue={(value) => onChangeFilter('user_level_id', value)}
                                                setValue={param.user_level_id}
                                                small={true}
                                            />
                                        </Form.Group>
                                        <Form.Group className="col-md-2" controlId="email">
                                            <Form.Label>Email</Form.Label>
                                            <Form.Control
                                                type="text"
                                                size="sm"
                                                value={param.email}
                                                onChange={e => onChangeFilter('email', e.target.value)}
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
                                <Button variant="outline-dark" size="sm" className="rounded-0" onClick={() => handleAction('add')}>
                                    Add Data
                                </Button>
                            </Card.Header>
                            <Card.Body>
                                <Table striped hover responsive width="100%" cellSpacing="0" cellPadding="0">
                                    <thead className="bg-dark text-white">
                                        <tr>
                                            <th className="text-nowrap">No.</th>
                                            <th className="text-nowrap">Fullname</th>
                                            <th className="text-nowrap">Username</th>
                                            <th className="text-nowrap">User Level</th>
                                            <th className="text-nowrap">Email</th>
                                            <th className="text-nowrap">Active</th>
                                            <th className="text-nowrap">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading && <tr>
                                            <td colSpan="7" className="text-center">
                                                <Spinner animation="border" size="sm" className="mr-1" />
                                                Loading data...
                                            </td>
                                        </tr>}
                                        {!loading && (all.error || all?.result?.total === 0) &&
                                            <tr>
                                                <td colSpan="7" className="text-center">
                                                    <span className="text-danger">No data found</span>
                                                </td>
                                            </tr>
                                        }
                                        {!loading && !all.error && all?.result &&
                                            all.result.data.map((row, i) => (
                                                <tr key={row.id}>
                                                    <td className="text-nowrap">{all.result.paging.index[i]}</td>
                                                    <td className="text-nowrap">{row.fullname}</td>
                                                    <td className="text-nowrap">{row.username}</td>
                                                    <td className="text-nowrap">{row.user_level}</td>
                                                    <td className="text-nowrap">{row.email}</td>
                                                    <td className="text-nowrap">{row.is_active === 1 ? <Badge variant="primary">Active</Badge> : <Badge variant="secondary">Inactive</Badge>}</td>
                                                    <td className="text-nowrap text-center">
                                                        <Button variant="warning" size="sm" className="rounded-0 mx-1" title="Detail Data" onClick={() => handleAction('detail', row.id)}>
                                                            <i className="fas fa-edit fa-fw"></i>
                                                        </Button>
                                                        {row.id !== authUser?.id && row.user_level_id !== 1 &&
                                                            <Button variant="danger" size="sm" className="rounded-0 mx-1" title="Remove Data" onClick={() => handleAction('remove', row.id)}>
                                                                <i className="fas fa-trash-alt fa-fw"></i>
                                                            </Button>
                                                        }
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </Table>

                                {!loading && !all.error && all?.result?.paging &&
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
                    dispatch(usersActions.clearState())
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
                    dispatch(usersActions.clearState())
                }}
                id={action.dataId}
            />}
        </>
    )
}