import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Modal, Form, Button, Spinner, Row } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { usersActions, userLevelsActions, provincesActions, citiesActions } from "./../../store";
import { isEmptyValue, defaultOpt, formatDate } from "./../../helpers/general";
import Select from "./../../components/Select";
import classnames from "classnames";
import Datepicker from "react-datepicker";
import * as yup from "yup";

const Add = ({ show = false, close, alert }) => {
    const defaultVal = {
        fullname: '',
        username: '',
        user_level_id: '',
        email: '',
        phone: '',
        birth_place: '',
        birth_date: '',
        address: '',
        province_id: '',
        is_active: false
    }

    const dispatch = useDispatch()
    const { create } = useSelector(x => x.users)
    const levels = useSelector(x => x.userLevels.all)
    const provinces = useSelector(x => x.provinces.all)
    const cities = useSelector(x => x.cities.all)
    const [modalShow, setModalShow] = useState(false)
    const [optionLevel, setOptionLevel] = useState(defaultOpt)
    const [optionProvince, setOptionProvince] = useState(defaultOpt)
    const [optionCity, setOptionCity] = useState(defaultOpt)
    const [selectedProvince, setSelectedProvince] = useState('')

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
            fullname: yup.string()
                .required("This field is required.")
                .min(3, "This field must be at least 3 characters in length.")
                .max(100, "This field cannot exceed 100 characters in length."),
            username: yup.string()
                .required("This field is required.")
                .min(3, "This field must be at least 3 characters in length.")
                .max(10, "This field cannot exceed 10 characters in length."),
            user_level_id: yup.string()
                .required("This field is required."),
            email: yup.string()
                .required("This field is required.")
                .max(50, "This field cannot exceed 50 characters in length.")
                .email("This field must contain a valid email address."),
            phone: yup.string()
                .max(25, "This field cannot exceed 25 characters in length.")
                .matches(/^[0-9]+$/, { message: "This field must contain only numbers.", excludeEmptyString: true })
                .transform((current, origin) => origin === null ? '' : current),
            birth_place: yup.string()
                .max(50, "This field cannot exceed 50 characters in length."),
            birth_date: yup.date().nullable()
                .transform((current, origin) => origin === '' ? null : current),
            address: yup.string().nullable()
                .min(3, "This field must be at least 3 characters in length.")
                .max(200, "This field cannot exceed 200 characters in length.")
                .transform((current, origin) => origin === '' ? null : current),
            province_id: yup.string()
                .transform((current, origin) => origin === null ? '' : current),
            user_level_id: yup.string()
                .transform((current, origin) => origin === null ? '' : current),
        }))
    })

    const onSubmitData = async (data, e) => {
        e.preventDefault()

        Object.keys(data).forEach((key) => {
            if (['is_active'].includes(key) && data[key] === false) {
                data[key] = "0"
            }

            if (typeof data[key] === 'object' && data[key] !== null && 'getTime' in data[key]) {
                data[key] = formatDate(data[key])
            }
        })

        await dispatch(usersActions.create({ data }))

        return handleClose()
    }

    useEffect(() => {
        const fetchData = () => {
            const param = {
                order: 'name',
                is_active: 1
            }

            dispatch(userLevelsActions.getAll({ param }))
            dispatch(provincesActions.getAll({ param }))
        }

        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

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
            let mapData = levels.result.data.map((row) => {
                return { value: row.id, label: row.name }
            })

            setOptionLevel([
                ...defaultOpt,
                ...mapData
            ])
        }
        if (!levels.loading && levels?.result?.total > 0) fetchData()

        return () => setOptionLevel(defaultOpt)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [levels])

    useEffect(() => {
        const fetchData = () => {
            let mapData = provinces.result.data.map((row) => {
                return { value: row.id, label: row.name }
            })

            setOptionProvince([
                ...defaultOpt,
                ...mapData
            ])
        }
        if (!provinces.loading && provinces?.result?.total > 0) fetchData()

        return () => setOptionProvince(defaultOpt)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [provinces])

    useEffect(() => {
        const fetchData = () => {
            const param = {
                order: 'name',
                is_active: 1,
                province_id: selectedProvince
            }

            dispatch(citiesActions.getAll({ param }))
        }

        if (!isEmptyValue(selectedProvince)) fetchData()
        return () => dispatch(citiesActions.clearState())
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedProvince])

    useEffect(() => {
        const fetchData = () => {
            let mapData = cities.result.data.map((row) => {
                return { value: row.id, label: row.name }
            })

            setOptionCity([
                ...defaultOpt,
                ...mapData
            ])
        }

        if (!isEmptyValue(selectedProvince) && !cities.loading && cities?.result?.total > 0) fetchData()
        return () => setOptionCity(defaultOpt)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cities, selectedProvince])

    return (
        <Modal show={modalShow} onHide={handleClose} backdrop="static" keyboard={false} animation={false} size="lg">
            <Modal.Header closeButton={isSubmitting ? false : true}>
                <Modal.Title as="h5">Add New Data</Modal.Title>
            </Modal.Header>
            <Form autoComplete="off" onSubmit={handleSubmit(onSubmitData)}>
                <Modal.Body>
                    <Row>
                        <Form.Group className="col-md-6">
                            <Form.Label>Fullname <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                size="sm"
                                isInvalid={!!errors.fullname}
                                {...register('fullname')}
                            />
                            <Form.Control.Feedback type="invalid">{errors.fullname?.message}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="col-md-3">
                            <Form.Label>Username <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                size="sm"
                                isInvalid={!!errors.username}
                                {...register('username')}
                            />
                            <Form.Control.Feedback type="invalid">{errors.username?.message}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="col-md-3">
                            <Form.Label>Level <span className="text-danger">*</span></Form.Label>
                            <Controller
                                name="user_level_id"
                                control={control}
                                render={({ field: { value, onChange } }) => {
                                    return (
                                        <Select
                                            option={optionLevel}
                                            changeValue={(val) => onChange(val)}
                                            setValue={value}
                                            small={true}
                                            error={!!errors.user_level_id ? true : false}
                                        />
                                    )
                                }}
                            />
                            <Form.Control.Feedback type="invalid">{errors.user_level_id?.message}</Form.Control.Feedback>
                        </Form.Group>
                    </Row>
                    <Row>
                        <Form.Group className="col-md-3">
                            <Form.Label>Email <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                size="sm"
                                isInvalid={!!errors.email}
                                {...register('email')}
                            />
                            <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="col-md-3">
                            <Form.Label>Phone</Form.Label>
                            <Form.Control
                                type="text"
                                size="sm"
                                isInvalid={!!errors.phone}
                                {...register('phone')}
                            />
                            <Form.Control.Feedback type="invalid">{errors.phone?.message}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="col-md-3">
                            <Form.Label>Birth Place</Form.Label>
                            <Form.Control
                                type="text"
                                size="sm"
                                isInvalid={!!errors.birth_place}
                                {...register('birth_place')}
                            />
                            <Form.Control.Feedback type="invalid">{errors.birth_place?.message}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="col-md-3">
                            <Form.Label>Birth Date</Form.Label>
                            <Controller
                                name="birth_date"
                                control={control}
                                render={({ field: { onChange, value } }) => {
                                    return (
                                        <Datepicker
                                            disabledKeyboardNavigation
                                            dateFormat={'yyyy-MM-dd'}
                                            selected={!isEmptyValue(value) ? new Date (value) : ''}
                                            onChange={(date) => {
                                                if (formatDate(date)) {
                                                    onChange(formatDate(date))
                                                }
                                            }}
                                            highlightDates={[new Date(), new Date()]}
                                            className={classnames('form-control form-control-sm', {
                                                'is-invalid': !!errors.birth_date
                                            })}
                                        />
                                    )
                                }}
                            />
                            <Form.Control.Feedback type="invalid">{errors.birth_date?.message}</Form.Control.Feedback>
                        </Form.Group>
                    </Row>
                    <Row>
                        <Form.Group className="col-md-12">
                            <Form.Label>Address</Form.Label>
                            <Form.Control
                                as="textarea"
                                size="sm"
                                rows={2}
                                isInvalid={!!errors.address}
                                {...register('address')}
                            />
                            <Form.Control.Feedback type="invalid">{errors.address?.message}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="col-md-4">
                            <Form.Label>Province</Form.Label>
                            <Controller
                                name="province_id"
                                control={control}
                                render={({ field: { value, onChange } }) => {
                                    return (
                                        <Select
                                            option={optionProvince}
                                            changeValue={(val) => {
                                                onChange(val)
                                                setSelectedProvince(val)
                                            }}
                                            setValue={value}
                                            small={true}
                                            error={!!errors.province_id ? true : false}
                                        />
                                    )
                                }}
                            />
                            <Form.Control.Feedback type="invalid">{errors.province_id?.message}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="col-md-4">
                            <Form.Label>City</Form.Label>
                            <Controller
                                name="city_id"
                                control={control}
                                render={({ field: { value, onChange } }) => {
                                    return (
                                        <Select
                                            option={optionCity}
                                            changeValue={(val) => onChange(val)}
                                            setValue={value}
                                            small={true}
                                            error={!!errors.city_id ? true : false}
                                        />
                                    )
                                }}
                            />
                            <Form.Control.Feedback type="invalid">{errors.province_id?.message}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="col-md-4">
                            <Form.Label>Zip Code</Form.Label>
                            <Form.Control
                                type="text"
                                size="sm"
                                isInvalid={!!errors.zip_code}
                                {...register('zip_code')}
                            />
                            <Form.Control.Feedback type="invalid">{errors.zip_code?.message}</Form.Control.Feedback>
                        </Form.Group>
                    </Row>
                    <Form.Text className="font-italic" muted>
                        * Default password for new user same as <strong>username</strong>.
                    </Form.Text>
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
