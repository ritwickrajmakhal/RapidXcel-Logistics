import React from 'react';

const Alert = (props) => {
    return (
        <div>
            <div className={`alert alert-${props.type}`}>
                {props.msg}
            </div>
        </div>
    );
}

export default Alert;
