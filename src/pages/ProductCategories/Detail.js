import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Modal, Form, Button, Spinner } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { productCategoriesActions } from "./../../store";
import { isEmptyValue } from "./../../helpers/general";
import * as yup from "yup";

const Detail = ({ show, close, dataId, alert }) => {
    const defaultVal = {
        name: ''
    }

    const dispatch = useDispatch()
    const { update, detail } = useSelector(x => x.productCategories)
    const [modalShow, setModalShow] = useState(false)

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

    const { handleSubmit, formState: {errors, isSubmitting }, register, reset } = useForm({
        defaultValues: defaultVal,
        resolver: yupResolver(yup.object().shape({
            name: yup.string()
                .required("This field is required.")
                .min(3, "This field must be at least 3 characters in length."),
        }))
    })

    const onSubmitData = async (data, e) => {
        e.preventDefault()

        // Object.keys(data).forEach((key) => {
        //     if (['is_active'].includes(key) && data[key] === false) {
        //         data[key] = "0"
        //     }
        // })

        await dispatch(productCategoriesActions.update({ id: dataId, data }))

        return handleClose()
    }

    useEffect(() => {
        if (show !== false) setModalShow(true)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show])

    useEffect(() => {
        if (!isEmptyValue(dataId)) dispatch(productCategoriesActions.getDetail({ id: dataId }))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dataId])

    useEffect(() => {
        const fetchData = () => {
            return reset({
                ...defaultVal,
                name: detail.data.name,
            }, {keepErrors: false})
        }

        if (!detail.loading && detail?.total > 0) fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [detail])

    useEffect(() => {
        if (!update.loading && update.success === true) handleAlert('success')
        if (!update.loading && update.success === false) handleAlert('error')
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [update])

    return (
        <Modal show={modalShow} onHide={handleClose} backdrop="static" keyboard={false} animation={false} size="sm">
            <Modal.Header closeButton>
                <Modal.Title as="h5">Detail Data</Modal.Title>
            </Modal.Header>
            <Form autoComplete="off" onSubmit={handleSubmit(onSubmitData)}>
                <Modal.Body>
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

export default Detail
