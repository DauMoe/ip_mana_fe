import React from 'react';
import { IoMdCloseCircle } from "react-icons/io";
import {IconContext} from "react-icons";
import "./Modal.sass";

const Modal = (props) => {
    const { show, title, children, onDismiss, WrapClass, CloseModal } = props;
    if (!show) return null;
    return (
        <div className={WrapClass} onClick={onDismiss}>
            <div className="modal_container" onClick={e => e.stopPropagation()}>
                <div className="modal_title">
                    <span className={"modal_close_btn"} onClick={CloseModal}>
                        <IconContext.Provider value={{size: 16, color: "#939393"}}>
                            <IoMdCloseCircle/>
                        </IconContext.Provider>
                    </span>
                    <p>{title}</p>
                </div>

                {/*Doc: https://reactjs.org/docs/jsx-in-depth.html*/}
                {children}
            </div>
        </div>
    );
}

export default Modal;