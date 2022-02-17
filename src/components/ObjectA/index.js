import React, {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {ERROR, LOADED} from "../Redux/ReducersAndActions/Status/StatusActionsDefinition";
import {
    ADD_PRO_TO_OBJECT, DELETE_OBJECT,
    GET_LIST_PRO_BY_OBJ_ID,
    GET_PRO_BY_OBJ_ID,
    LIST_OBJECT,
    UPDATE_PRO_VALUE,
    WEB_BASE_NAME
} from "../API_URL";
import {IconContext} from "react-icons";
import {
    BiAddToQueue,
    FaRegTimesCircle,
    FaRegWindowClose,
    MdOutlineSave,
    RiFunctionLine
} from "react-icons/all";
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.min.css';
import Modal from "../Modal";
import Select from "react-select";
import swal from "sweetalert";

function ObjectA(props) {
    const ADD_PROPERTY = 1;
    const {_title, _obj_type_id, _obj_type_name}    = props;
    const dispatch                                  = useDispatch();
    const [DetailData, setDetailData]               = useState({obj_id: -1, obj_name: "", data: []});
    const [ObjectData, setObjectData]               = useState([]);
    const [ShowAppBox, setShowAppBox]               = useState(false);
    const [ModalData, setModalData]                 = useState({mode: -1, data: {list_property: [], list_property_assign: []}, show: false, title: "no title"});
    const [ModalSelectData, setModalSelectData]     = useState({});

    const __FetchFunction = (URL, body, callback) => {
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        let requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(body),
            redirect: 'follow'
        };

        fetch(URL, requestOptions)
            .then(res => res.json())
            .then(result => {
                if (result.code === 200) {
                    dispatch({type: LOADED})
                    callback(result.msg, null);
                } else {
                    dispatch({
                        type: ERROR,
                        msg: result.msg
                    });
                    callback(null, result.msg);
                    toast.error(result.msg);
                }
            })
            .catch(e => {
                dispatch({
                    type: ERROR,
                    msg: e
                });
                toast.error(e);
            });
    }

    const ToggleApplicationBox = (e) => {
        e.stopPropagation();
        setShowAppBox(!ShowAppBox);
    }

    const SearchByObjectName = () => {

    }
    
    const AddProperty = () => {
        let BodyData = {
          "obj_id": DetailData.obj_id
        };
        __FetchFunction(GET_LIST_PRO_BY_OBJ_ID, BodyData, function(response) {
            let temp1 = [], temp2 = [];
            for (let i of response.list_property) {
                temp1.push({
                    value: i.pro_id,
                    label: i.pro_name,
                    ...i
                })
            }
            for (let i of response.list_property_assign) {
                temp2.push({
                    value: i.pro_id,
                    label: i.pro_name,
                    ...i
                })
            }
            setModalData({
                ...ModalData,
                show: true,
                mode: ADD_PROPERTY,
                data: {
                    list_property: temp1,
                    list_property_assign: temp2
                },
                title: `Add property to ${DetailData.obj_name}`
            });
        });
    }

    const HandleClickOut = (e) => {
        setModalData({
            ...ModalData,
            show: false
        })
    }

    const SaveChangeObject = () => {
        let HasErr = false;
        for (let i of DetailData.data) {
            if (i.match_regex === false) {
                toast.error(`Value of ${i.pro_name} property is not match rule's regex!`);
                HasErr = true;
                break;
            }
        }
        if (!HasErr) {
            let list_property = [];
            for (let i of DetailData.data) {
                list_property.push({
                    "obj_id": i.obj_id,
                    "pro_id": i.pro_id,
                    "pro_value": i.pro_value
                });
            }
            let BodyData = {
                "list_property": list_property
            }
            __FetchFunction(UPDATE_PRO_VALUE, BodyData, function (response) {
                toast.success(response);
                GetObjectInfo(DetailData, 0);
            });
        }
    }

    const DeleteObjectA = () => {
        swal({
            title: "DELETE",
            text: `Delete '${DetailData.obj_name}' will delete all object's property. Continue?`,
            icon: "warning",
            buttons: true,
            dangerMode: true
        }).then(val => {
            if (val) {
                let BodyData = {
                    "obj_id": DetailData.obj_id
                }
                __FetchFunction(DELETE_OBJECT, BodyData, function(response, err) {
                    if (err != null) return;
                    let BodyData = {
                        "obj_type_id": _obj_type_id
                    };
                    __FetchFunction(LIST_OBJECT, BodyData, function(response) {
                        for (let i of response) {
                            i.match_regex = true;
                        }
                        setObjectData(response);
                        if (response.length > 0) {
                            GetObjectInfo(response[0], 0);
                        }
                    });
                    toast.success(response);
                });
            }
        });
    }

    const GetObjectInfo = (item, index = -1) => {
        if (index > -1) {
            const ObjectDataCopy = [...ObjectData];
            ObjectDataCopy.map(function(obj, obj_index) {
                obj.selected = (obj_index === index);
            });
            // setObjectData(ObjectDataCopy);
        }
        let BodyData = {
            "obj_id": item.obj_id
        };
        __FetchFunction(GET_PRO_BY_OBJ_ID, BodyData, function (response) {
            setDetailData({
                obj_id: item.obj_id,
                obj_name: item.obj_name,
                data: response
            });
        });
    }

    const ChangeProValue = (e, index) => {
        let CopyDetailData                  = [...DetailData.data];
        let reg                             = new RegExp(CopyDetailData[index].rule_regex, "g");
        CopyDetailData[index].pro_value     = e.target.value;
        CopyDetailData[index].match_regex   = reg.test(e.target.value);
        setDetailData({
            ...DetailData,
            CopyDetailData
        });
    }

    const ChangeProperty = (item) => {
        let tempArr = ModalData.data.list_property_assign;
        let isAssigned = false;
        for (let i of tempArr) {
            if (i.pro_id === item.value) {
                isAssigned = true;
                break;
            }
        }
        if (Array.isArray(tempArr) && !isAssigned) {
            tempArr.push(item);
            setModalData({
                ...ModalData,
                data: {
                    ...ModalData.data,
                    list_property_assign: tempArr
                }
            })
            setModalSelectData(item);
        }
    }

    const RemoveProperty = (item) => {
        if (item.is_required === true) {
            toast.error("Can not remove this property!");
            return;
        }
        let tempArr = ModalData.data.list_property_assign;
        Array.isArray(tempArr) && tempArr.map(function(i, index) {
            if (item.value === i.value) {
                tempArr.splice(index, 1);
            }
        });
        setModalData({
            ...ModalData,
            data: {
                ...ModalData.data,
                list_property_assign: tempArr
            }
        });
    }

    const UpdatePropertyOfObject = () => {
        let ListNewProID = [];
        for (let i of ModalData.data.list_property_assign) {
            ListNewProID.push(i.value);
        }
        let BodyData = {
            "obj_id": DetailData.obj_id,
            "list_pro_id": ListNewProID,
            "obj_type_id": _obj_type_id
        }
        __FetchFunction(ADD_PRO_TO_OBJECT, BodyData, function(response, err) {
           GetObjectInfo(DetailData, 0);
           setModalData({...ModalData, show: false});
           toast.success(response);
        });
    }

    useEffect(function() {
        document.title = _title + WEB_BASE_NAME;
        let BodyData = {
            "obj_type_id": _obj_type_id
        };
        __FetchFunction(LIST_OBJECT, BodyData, function(response) {
            for (let i of response) {
                i.match_regex = true;
            }
            setObjectData(response);
            if (response.length > 0) {
                GetObjectInfo(response[0], 0);
            }
        });
    }, [_obj_type_id]);

    return(
        <div className="container" onClick={() => setShowAppBox(false)}>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={true}
                rtl={false}
                pauseOnFocusLoss={false}
                theme="colored"
                draggable={false}
                pauseOnHover/>

            <Modal
                show={ModalData.show}
                title={ModalData.title}
                onClickOut={HandleClickOut}
                CloseModal={_ => setModalData({...ModalData, show: false})}
                WrapClass={"modal_wrap"}>
                {ModalData.mode === ADD_PROPERTY && (
                    <>
                        <Select
                            options={ModalData.data.list_property}
                            value={ModalSelectData}
                            onChange={ChangeProperty}
                        />
                        <div>
                            <table className="nice_theme margin-top-20" style={{
                                minWidth: "650px"
                            }}>
                                <thead className="text-center">
                                    <tr>
                                        <th>Index</th>
                                        <th>Property</th>
                                        <th>Remove</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        Array.isArray(ModalData.data.list_property_assign) && ModalData.data.list_property_assign.map((item, index) => {
                                            return (
                                                <tr key={item.id}>
                                                    <td className="text-center">{index+1}</td>
                                                    <td className="bold">{item.pro_name}</td>
                                                    <td className="text-center">{
                                                        item.is_required === false ? (
                                                            <span onClick={_ => RemoveProperty(item)}>
                                                                <IconContext.Provider value={{color: "red", size: "20"}} >
                                                                    <FaRegTimesCircle/>
                                                                </IconContext.Provider>
                                                            </span>
                                                        ) :
                                                        (<span>Required</span>)
                                                    }</td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                            <button className={"btn pull-right"} onClick={_ => setModalData({...ModalData, show: false})}>Cancel</button>
                            <button className={"btn theme_yellow pull-right margin-right-10"} onClick={UpdatePropertyOfObject}>Save</button>
                        </div>
                    </>
                )}
            </Modal>

            <div className="box-style" style={{height: "calc(100% - 40px)", padding: '20px', display: 'flex', position: 'relative'}}>

                <div style={{width: '300px', height: 'calc(100% - 30px)', display: 'inline-block'}}>
                    <input className="form-control" disabled={true} onKeyDown={SearchByObjectName} placeholder={`Find by ${_obj_type_name.toLowerCase()} name ...`}/>
                    <div className="list-container margin-top-10">
                        {Array.isArray(ObjectData) && ObjectData.length === 0 ? (
                            <div>
                                <span>No object!</span>
                            </div>
                        ) : Array.isArray(ObjectData) && ObjectData.map((item, index) => {
                            return (
                                <div
                                    key={index}
                                    className={item.selected === true ? "list-item theme_green" : "list-item"}
                                    onClick={_ => GetObjectInfo(item, index)}>
                                    {item.obj_name}
                                </div>
                            )
                        })}
                    </div>
                </div>

                {Array.isArray(ObjectData) && ObjectData.length > 0 &&
                    (
                        <div style={{
                            width: 'calc(100% - 350px)',
                            height: 'calc(100% - 70px)',
                            marginLeft: '50px',
                            display: 'inline-block',
                            overflow: 'auto',
                            padding: '10px'}}>
                            <div style={{
                                width: "100%",
                                display: "block",
                                textAlign: "right",
                                textTransform: "capitalize"
                            }}>
                                <h2>{_obj_type_name.toLowerCase()} : {DetailData.obj_name}</h2>
                            </div>
                            {
                                DetailData.data.map(function(item, index) {
                                    return (
                                        <div className="margin-top-20" key={index}>
                                            <label htmlFor={"_pro_item_" + index}>
                                                <span className="bold" style={{textTransform: "capitalize"}}>{item.pro_name.toLowerCase()}:</span>
                                            </label>
                                            <input className={(item.match_regex === false) ? "form-control form-control-err" : "form-control"} placeholder={(item.pro_desc !== "") ? item.pro_desc : "Fill value"} id={"_pro_item_" + index} value={item.pro_value} onChange={e => ChangeProValue(e, index)}/>
                                            <small className="italic">(Created: {item.created_at}, Last update: {item.updated_at})</small><br/>
                                            {item.match_regex === false && (<small style={{color: "red"}}>Not match rule of {item.pro_name.toLowerCase()}!</small>)}
                                        </div>
                                    );
                                })
                            }

                            <div className="margin-top-20">
                                <button className="btn pull-right theme_red margin-left-10" onClick={DeleteObjectA}>
                                    <IconContext.Provider value={{size: 22, color: 'white', className: 'middle-btn'}}>
                                        <FaRegWindowClose/>
                                    </IconContext.Provider>
                                    &nbsp;Delete
                                </button>
                                <button className="btn pull-right theme_cyan" onClick={SaveChangeObject}>
                                    <IconContext.Provider value={{size: 22, color: 'white', className: 'middle-btn'}}>
                                        <MdOutlineSave/>
                                    </IconContext.Provider>
                                    &nbsp;Save change
                                </button>
                            </div>
                        </div>
                    )}

                    <div onClick={e => e.stopPropagation()}>
                        <span className="fab-button" onClick={ToggleApplicationBox}>
                            <IconContext.Provider value={{size: 25, color: 'white'}}>
                                <RiFunctionLine/>
                            </IconContext.Provider>
                        </span>

                        <div className={ShowAppBox ? "application-box flex" : "application-box"}>
                            <button className="btn theme_green700 margin-10">
                                <IconContext.Provider value={{size: 22, className: 'middle-btn'}}>
                                    <BiAddToQueue/>
                                </IconContext.Provider>
                                &nbsp;Create new object</button>

                            <button className="btn theme_yellow margin-10" onClick={AddProperty}>
                                <IconContext.Provider value={{size: 22, className: 'middle-btn'}}>
                                    <BiAddToQueue/>
                                </IconContext.Provider>
                                &nbsp;Add property to object</button>
                        </div>

                    </div>
            </div>
        </div>
    );
}

export default ObjectA;