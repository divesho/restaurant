import React from 'react';

const Popup = (props) => {

    return (
        <div className={"modal-section" + (props.open ? " active" : "")}>
            <div className="modal-backdrop"></div>
            <div className="modal">
                <div className="modal-header">
                    <h3>Hello header</h3>
                    <span className="close" onClick={props.handleClose}>X</span>
                </div>
                <div className="modal-body">
                    {props.children}
                </div>
            </div>
            
        </div>
    );
};

export default Popup;