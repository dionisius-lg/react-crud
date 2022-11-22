import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Modal, Form, Button, Spinner } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { productsActions } from "./../../store";
import Selectbox from "./../../components/Selectbox";
import * as yup from "yup";

const Add = ({ show, close, alert }) => {
    const defaultVal = {
        name: '',
        product_category_id: ''
    }
    const defaultOpt = {
        value: '',
        label: 'Choose...'
    }

    const dispatch = useDispatch()
    const { create } = useSelector(x => x.products)
    const productCategories = useSelector(x => x.productCategories)
    const [modalShow, setModalShow] = useState(false)
    const [optProductCategory, setOptProductCategory] = useState([defaultOpt])

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
            reset(defaultVal, {keepErrors: false})
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show])

    useEffect(() => {
        if (!create.loading && create.success === true) handleAlert('success')
        if (!create.loading && create.success === false) handleAlert('error')
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [create])

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

        return () => setOptProductCategory([defaultOpt])
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [productCategories.all.loading])

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
                                        option={optProductCategory}
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
