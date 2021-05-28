import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
// import { Container } from "react-bootstrap"
import { removeAlert } from "../store/components/action"

const AlertIcon = ({ alertType, msg }) => {
    return (
        <>{
            alertType === "danger"
                ? (<>
                    <div className="icon"><i className="fa fa-times-circle"></i></div>
                    <strong>Error!</strong> {msg}
                </>)
                : alertType === "success"
                    ? (<>
                        <div className="icon"><i className="fa fa-check"></i></div>
                        <strong>Success!</strong> {msg}
                    </>)
                    : (<>
                        <div className="icon"><i className="fa fa-info-circle"></i></div>
                        <strong>Info!</strong> {msg}
                    </>)
        }</>
    )
}

// danger, success, info
const AlertComp = () => {
    const dispatch = useDispatch()

    const { alertArray } = useSelector(
        (state) => state.component
    )
    return (
        <><div className="alert-container">
            <div className="alert-small-container">{
                alertArray !== null &&
                alertArray.length > 0 &&
                alertArray.map(alert => (
                    <div key={alert.id} className={`alert alert-${alert.alertType} alert-white rounded`}>
                        <button onClick={() => {
                            dispatch(removeAlert(alert.id))
                        }} type="button" className="alert-close" data-dismiss="alert" aria-hidden="true">×</button>
                        <AlertIcon alertType={alert.alertType} msg={alert.msg} />
                    </div>
                ))
            }
            </div>
        </div>
        </>
    )
}

export default AlertComp
