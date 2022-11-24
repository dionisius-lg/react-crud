import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Modal, Form, Button, Spinner } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { productsActions } from "./../../store";
import { defaultOpt } from "./../../helpers/general";
import Select from "./../../components/Select";
import * as yup from "yup";

const Add = ({ show = false, close, alert }) => {
    const defaultVal = {
        name: '',
        product_category_id: ''
    }

    const dispatch = useDispatch()
    const { create } = useSelector(x => x.products)
    const categories = useSelector(x => x.productCategories.all)
    const [modalShow, setModalShow] = useState(false)
    const [optionCategory, setoptionCategory] = useState(defaultOpt)

    const handleClose = () => {
        setModalShow(false)
        if (typeof close === 'function') close()
    }

    const handleAlert = (type = null) => {
        if (typeof alert === 'function' && ['success', 'error'].includes(type)) {
            let result = {
                type: type,
                message: type === 'success' ? 'Data successfully saved.' : 'Failed to save data.',
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
        if (show) {
            setModalShow(true)
            reset(defaultVal, {keepErrors: false})
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show])

    useEffect(() => {
        if (!create.loading && create.error) handleAlert('error')
        if (!create.loading && !create.error && create?.result) handleAlert('success')
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [create])

    useEffect(() => {
        const fetchData = () => {
            console.log(categories.result.data)
            let mapData = categories.result.data.map((row) => {
                return { value: row.id, label: row.name }
            })

            setoptionCategory([
                ...defaultOpt,
                ...mapData
            ])
        }
        if (!categories.loading && categories?.result?.total > 0) fetchData()

        return () => setoptionCategory(defaultOpt)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [categories])

    return (
        <Modal show={modalShow} onHide={handleClose} backdrop="static" keyboard={false} animation={false} size="sm">
            <Modal.Header closeButton={isSubmitting ? false : true}>
                <Modal.Title as="h5">Add New Data</Modal.Title>
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
                                    <Select
                                        option={optionCategory}
                                        changeValue={(value) => onChange(value)}
                                        setValue={getValues('product_category_id')}
                                        small={true}
                                        error={!!errors.product_category_id ? true : false}
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
