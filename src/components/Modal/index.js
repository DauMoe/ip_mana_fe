import React from 'react';
import { IoMdCloseCircle } from "react-icons/io";
import {IconContext} from "react-icons";
import "./Modal.sass";

const Modal = (props) => {
    const { show, title, children, onClickOut, WrapClass, CloseModal, ModalWidth } = props;
    if (show !== true) return null;
    return (
        <div className={WrapClass} onClick={onClickOut}>
            <div className={"modal_container"} style={ModalWidth ? {width: ModalWidth} : undefined} onClick={e => e.stopPropagation()}>
                <div className="modal_title">
                    <span className={"modal_close_btn"} onClick={CloseModal}>
                        <IconContext.Provider value={{size: 16, color: "#939393"}}>
                            <IoMdCloseCircle/>
                        </IconContext.Provider>
                    </span>
                    <p>{title}</p>
                </div>

                {/*Doc: https://reactjs.org/docs/jsx-in-depth.html*/}
                <div style={{
                    maxHeight: '80vh',
                    overflowY: 'auto',
                    overflowX: 'auto',
                    padding: '0 10px',
                    minHeight: '300px'
                }}>
                    {children}
                </div>
            </div>
        </div>
    );
}

export default Modal;