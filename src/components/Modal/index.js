import React from 'react';
import "./Modal.sass";

const Modal = (props) => {
    const {show, title, content, footer} = props;
    if (!show) return null;
    return (
        <div className="modal_wrap">
            <div className="modal_container">
                <div className="modal_title">
                    <p>{title}</p>
                </div>

                <div className="modal_content">
                    {content}
                </div>

                <div className="modal_footer">

                </div>
            </div>
        </div>
    );
}

export default Modal;