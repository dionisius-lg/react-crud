import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Modal, Form, Button, Spinner, Row } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { usersActions } from "./../../store";
import { isEmptyValue, defaultOpt } from "./../../helpers/general";
import Selectbox from "./../../components/Selectbox";
import * as yup from "yup";

const Detail = ({ show = false, close, alert, id }) => {
    const defaultVal = {
        fullname: '',
        username: '',
        user_level_id: '',
        email: '',
    }

    const dispatch = useDispatch()
    const { detail, update } = useSelector(x => x.users)
    const levels = useSelector(x => x.userLevels.all)
    const [modalShow, setModalShow] = useState(false)
    const [optLevel, setOptLevel] = useState(defaultOpt)

    const handleClose = () => {
        setModalShow(false)
        if (typeof close === 'function') close()
    }

    const handleAlert = (type = null) => {
        if (typeof alert === 'function' && ['success', 'error'].includes(type)) {
            let result = {
                type: type,
                message: type === 'success' ? 'Data has been saved.' : 'Failed to save data.',
                show: true
            }

            return alert(result)
        }

        return false
    }

    const { handleSubmit, formState: {errors, isSubmitting }, register, reset, control, getValues } = useForm({
        defaultValues: defaultVal,
        resolver: yupResolver(yup.object().shape({
            fullname: yup.string()
                .required("This field is required.")
                .min(3, "This field must be at least 3 characters in length."),
            username: yup.string()
                .required("This field is required.")
                .min(3, "This field must be at least 3 characters in length."),
            user_level_id: yup.string()
                .required("This field is required."),
            email: yup.string()
                .required("This field is required.")
                .email("This field must contain a valid email address."),
            // phone: yup.string()
            //     // .required("This field is required.")
            //     .matches(/^[0-9]+$/, { message: "This field is invalid.", excludeEmptyString: true }),
        }))
    })

    const onSubmitData = async (data, e) => {
        e.preventDefault()

        // Object.keys(data).forEach((key) => {
        //     if (['is_active'].includes(key) && data[key] === false) {
        //         data[key] = "0"
        //     }
        // })

        await dispatch(usersActions.update({ id, data }))

        return handleClose()
    }

    useEffect(() => {
        if (!isEmptyValue(id)) dispatch(usersActions.getDetail({ id }))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id])

    useEffect(() => {
        const fetchData = () => {
            setModalShow(true)
            return reset({
                ...defaultVal,
                fullname:  detail.result.data.fullname,
                username: detail.result.data.username,
                user_level_id: detail.result.data.user_level_id,
                email: detail.result.data.email,
            }, {keepErrors: false})
        }

        if (show && !detail.loading && detail?.result) fetchData()
        return () => setModalShow(false)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show, detail])

    useEffect(() => {
        if (!update.loading && update?.result) handleAlert('success')
        if (!update.loading && update?.error) handleAlert('error')
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [update])

    useEffect(() => {
        const fetchData = () => {
            let mapData = levels.result.data.map((row) => {
                return { value: row.id, label: row.name }
            })

            setOptLevel([
                ...defaultOpt,
                ...mapData
            ])
        }
        if (!levels.loading && levels?.result?.total > 0) fetchData()

        return () => setOptLevel(defaultOpt)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [levels])

    return (
        <Modal show={modalShow} onHide={handleClose} backdrop="static" keyboard={false} animation={false}>
            <Modal.Header closeButton={isSubmitting ? false : true}>
                <Modal.Title as="h5">Detail Data</Modal.Title>
            </Modal.Header>
            <Form autoComplete="off" onSubmit={handleSubmit(onSubmitData)}>
                <Modal.Body>
                    <Row>
                        <Form.Group className="col-md-12">
                            <Form.Label>Fullname <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                size="sm"
                                isInvalid={!!errors.fullname}
                                {...register('fullname')}
                            />
                            <Form.Control.Feedback type="invalid">{errors.fullname?.message}</Form.Control.Feedback>
                        </Form.Group>
                    </Row>
                    <Row>
                        <Form.Group className="col-md-6">
                            <Form.Label>Username <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                size="sm"
                                isInvalid={!!errors.username}
                                {...register('username')}
                            />
                            <Form.Control.Feedback type="invalid">{errors.username?.message}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="col-md-6">
                            <Form.Label>Level <span className="text-danger">*</span></Form.Label>
                            <Controller
                                name="user_level_id"
                                control={control}
                                render={({ field: { onChange } }) => {
                                    return (
                                        <Selectbox
                                            option={optLevel}
                                            changeValue={(value) => onChange(value)}
                                            setValue={getValues('user_level_id')}
                                            isSmall={true}
                                            isError={!!errors.user_level_id ? true : false}
                                        />
                                    )
                                }}
                            />
                            <Form.Control.Feedback type="invalid">{errors.product_category_id?.message}</Form.Control.Feedback>
                        </Form.Group>
                    </Row>
                    <Row>
                        <Form.Group className="col-md-6">
                            <Form.Label>Email <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                size="sm"
                                isInvalid={!!errors.email}
                                {...register('email')}
                            />
                            <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
                        </Form.Group>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button type="submit" variant="dark" size="sm" className="rounded-0" disabled={isSubmitting}>
                        {isSubmitting && <Spinner animation="border" size="sm" className="mr-1" />} Save
                    </Button>
                    <Button variant="light" size="sm" className="rounded-0" onClick={handleClose}>Close</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    )
}

export default Detail
