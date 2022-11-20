import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Modal, Form, Button, Spinner } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { productCategoriesActions } from "./../../store";
import * as yup from "yup";

const Add = ({ show, close, alert }) => {
    const initData = () => {
        return {
            name: '',
        }
    }

    const dispatch = useDispatch()
    const productCategoryCreate = useSelector(x => x.productCategories.create)
    const [modalShow, setModalShow] = useState(false)

    const handleClose = () => {
        setModalShow(false)
        if (typeof close === 'function') close()
    }

    const handleAlert = (type = null) => {
        if (typeof alert === 'function' && ['success', 'error'].includes(type)) {
            let result = {
                type: type,
                message: type === 'success' ? 'Create data success.' : 'Failed to create data.',
                show: true
            }

            return alert(result)
        }

        return false
    }

    const { handleSubmit, formState: {errors, isSubmitting }, register, reset } = useForm({
        defaultValues: initData(),
        resolver: yupResolver(yup.object().shape({
            name: yup.string()
                .required("This field is required.")
                .min(3, "This field must be at least 3 characters in length."),
        }))
    })

    const onSubmitData = async (data, e) => {
        e.preventDefault()

        await dispatch(productCategoriesActions.create({ data }))

        return handleClose()
    }

    useEffect(() => {
        if (!!show) {
            setModalShow(true)
            reset(initData, {keepErrors: false})
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show])

    useEffect(() => {
        if (!productCategoryCreate.loading && productCategoryCreate.success === true) handleAlert('success')
        if (!productCategoryCreate.loading && productCategoryCreate.success === false) handleAlert('error')
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [productCategoryCreate])

    return (
        <Modal show={modalShow} onHide={handleClose} backdrop="static" keyboard={false} animation={false} size="sm">
            <Modal.Header closeButton>
                <Modal.Title as="h5">Add New Data</Modal.Title>
            </Modal.Header>
            <Form autoComplete="off" onSubmit={handleSubmit(onSubmitData)}>
                <Modal.Body className="">
                    <Form.Group>
                        <Form.Label>Name <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                            type="text"
                            size="sm"
                            isInvalid={!!errors.name}
                            {...register('name')}
                        />
                        <Form.Control.Feedback type="invalid">{errors.name?.message}</Form.Control.Feedback>
                    </Form.Group>
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

export default Add
