import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Modal, Form, Button, Spinner } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { productsActions } from "./../../store";
import Selectbox from "./../../components/Selectbox";
import * as yup from "yup";

const Add = ({ show, close, alert }) => {
    const initData = () => {
        return {
            name: '',
            product_category_id: ''
        }
    }

    const dispatch = useDispatch()
    const productCreate = useSelector(x => x.products.create)
    const categories = useSelector(x => x.productCategories.all)
    const [modalShow, setModalShow] = useState(false)
    const [optCategories, setOptCategories] = useState([{
        value: '',
        label: 'Choose...'
    }])

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

    const { handleSubmit, formState: {errors, isSubmitting }, register, reset, control, getValues } = useForm({
        defaultValues: initData(),
        resolver: yupResolver(yup.object().shape({
            name: yup.string()
                .required("This field is required.")
                .min(3, "This field must be at least 3 characters in length."),
            product_category_id: yup.string()
                .required("This field is required."),
        }))
    })

    const onSubmitData = async (data, e) => {
        e.preventDefault()

        await dispatch(productsActions.create({ data }))

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
        if (!productCreate.loading && productCreate.success === true) handleAlert('success')
        if (!productCreate.loading && productCreate.success === false) handleAlert('error')
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [productCreate])

    useEffect(() => {
        const fetchData = () => {
            let mapData = categories.data.map((row) => {
                return { value: row.id, label: row.name }
            })

            setOptCategories([
                ...optCategories,
                ...mapData
            ])
        }
        if (!categories.loading && categories.success && categories.total > 0) fetchData()

        return () => setOptCategories([{
            value: '',
            label: 'Choose...'
        }])
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [categories])

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
                    <Form.Group>
                        <Form.Label>Category <span className="text-danger">*</span></Form.Label>
                        <Controller
                            name="product_category_id"
                            control={control}
                            render={({ field: { onChange } }) => {
                                return (
                                    <Selectbox
                                        option={optCategories}
                                        changeValue={(value) => onChange(value)}
                                        setValue={getValues('product_category_id')}
                                        isSmall={true}
                                        isError={!!errors.product_category_id ? true : false}
                                    />
                                )
                            }}
                        />
                        <Form.Control.Feedback type="invalid">{errors.product_category_id?.message}</Form.Control.Feedback>
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
