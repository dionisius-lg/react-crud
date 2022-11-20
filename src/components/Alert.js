import { useState, useEffect } from "react";
import { Alert as Notification } from "react-bootstrap";
import { isEmptyValue } from "../helpers/general";

const Alert = ({ type = 'info', message = "", show = false, hide }) => {
    const [alertShow, setAlertShow] = useState(false)
    const alertType = type.toString().toLowerCase()
    let alertVariant = 'info'

    switch (alertType) {
        case 'error':
            alertVariant = 'danger'
            break;
        case 'success':
            alertVariant = 'primary'
            break;
        case 'warning':
            alertVariant = 'warning'
            break;
        default:
            alertVariant = 'info'
            break;
    }

    useEffect(() => {
        if (show !== false) setAlertShow(true)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show])

    const handleHide = () => {
        setAlertShow(false)
        if (typeof hide === 'function') hide()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }

    return (
        <Notification variant={alertVariant} show={alertShow} onClose={handleHide} transition={false} dismissible>
            <p className="m-0">{!isEmptyValue(message) ? message : "Info"}</p>
        </Notification>
    )
}

export default Alert
