import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Modal, Form, Button, Spinner } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { productsActions } from "./../../store";
import { isEmptyValue } from "./../../helpers/general";
import Selectbox from "./../../components/Selectbox";
import * as yup from "yup";

const Detail = ({ show, close, dataId, alert }) => {
    const initData = () => {
        return {
            name: '',
            product_category_id: ''
        }
    }

    const dispatch = useDispatch()
    const product = useSelector(x => x.products.detail)
    const productUpdate = useSelector(x => x.products.update)
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

        // Object.keys(data).forEach((key) => {
        //     if (['is_active'].includes(key) && data[key] === false) {
        //         data[key] = "0"
        //     }
        // })

        await dispatch(productsActions.update({ id: dataId, data }))

        return handleClose()
    }

    useEffect(() => {
        if (show !== false) setModalShow(true)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show])

    useEffect(() => {
        if (!isEmptyValue(dataId)) dispatch(productsActions.getDetail({ id: dataId }))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dataId])

    useEffect(() => {
        const fetchData = () => {
            return reset({
                ...initData,
                name: product.data.name,
                product_category_id: product.data.product_category_id,
            }, {keepErrors: false})
        }

        if (!product.loading && product?.total > 0) fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [product])

    useEffect(() => {
        if (!productUpdate.loading && productUpdate.success === true) handleAlert('success')
        if (!productUpdate.loading && productUpdate.success === false) handleAlert('error')
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [productUpdate])

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
        if (categories?.total > 0) fetchData()

        return () => setOptCategories([{
            value: '',
            label: 'Choose...'
        }])
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [categories.loading])

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

export default Detail
