import React from 'react';

const Modal = (props) => {
    return (
        <div>
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel">
                <div className="modal-dialog  modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">RapidXcel Logistics</h1>
                        </div>
                        <div className="modal-body" align="center">
                            {props.msg}
                        </div>
                        <div className="modal-footer">
                            {props.footer}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Modal;
