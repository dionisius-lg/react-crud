import { useState, useEffect } from "react";
import { Row, Col, Form, Button, Spinner, InputGroup, Card } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import Alert from "./../../components/Alert";
import history from "./../../helpers/history";
import { authActions } from "./../../store";

export const Login = () => {
    const dispatch = useDispatch()
    const { user, error, loading } = useSelector(x => x.auth)
    const [alert, setAlert] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    useEffect(() => {
        if (user && !loading) history.navigate('/')
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (user && loading) dispatch(authActions.user({ id: user?.id }))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, loading])

    useEffect(() => {
        if (error) setAlert({ type: 'error', message: error, show: true })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [error])

    const handleShowPassword = () => setShowPassword(!showPassword)

    const { handleSubmit, formState: { errors, isSubmitting }, register } = useForm({
        defaultValues: {
            username: "",
            password: ""
        },
        resolver: yupResolver(yup.object().shape({
            username: yup.string()
                .required("Username is required."),
            password: yup.string()
                .required("Password is required.")
        }))
    })

    const onSubmit = async (data, e) => {
        return dispatch(authActions.login(data))
    }

    return (
        <Row className="justify-content-center">
            <Col xl={6} lg={12} md={9}>
                <Card className="o-hidden border-0 shadow-lg my-5">
                    <Card.Body className="pt-5 px-5">
                        <div className="text-center">
                            <h1 className="h4 text-black-50 text-uppercase mb-4">{process.env.REACT_APP_NAME}</h1>
                        </div>
                        <Form className="users" autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
                            <Form.Group controlId="username">
                                <Form.Label>Username</Form.Label>
                                <Form.Control
                                    type="text"
                                    className="form-control-username"
                                    // placeholder="Username"
                                    isInvalid={!!errors.username}
                                    {...register("username")}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.username?.message}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group controlId="password">
                                <Form.Label>Password</Form.Label>
                                <InputGroup className="mb-3">
                                    <Form.Control
                                        type={showPassword ? 'text' : 'password'}
                                        className="form-control-user"
                                        // placeholder="Password"
                                        isInvalid={!!errors.password}
                                        {...register("password")}
                                    />
                                    <InputGroup.Text><i className="fas fa-eye-slash"></i></InputGroup.Text>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.password?.message}
                                    </Form.Control.Feedback>
                                </InputGroup>
                            </Form.Group>
                            <div className="mb-4 text-right">
                                <Button type="submit" className="col-md-5 mt-2" disabled={isSubmitting}>
                                    {isSubmitting && <Spinner animation="border" size="sm" className="mr-1" />} Login
                                </Button>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
                <Alert type="danger" message={alert.message} show={alert.show} hide={() => setAlert(false)} />
            </Col>
        </Row>
    )
}