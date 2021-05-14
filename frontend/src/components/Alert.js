import React from 'react';

import { useSelector } from 'react-redux';

const AlertComp = () => {

    const { alertArray } = useSelector(
        (state) => state.component
    )
    return (
        <>{
            alertArray !== null &&
            alertArray.length > 0 &&
            alertArray.map(alert => (
                <div key={alert.id} className={`alert alert-${alert.alertType}`}>
                    {alert.msg}
                </div>))
        }</>
    )
}

export default AlertComp
