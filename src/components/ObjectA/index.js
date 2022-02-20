import React, {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {ERROR, LOADED, LOADING} from "../Redux/ReducersAndActions/Status/StatusActionsDefinition";
import {
    ADD_PRO_TO_OBJECT, BASE_URL, DELETE_OBJECT, EXPORT_DATA,
    GET_LIST_PRO_BY_OBJ_ID,
    GET_PRO_BY_OBJ_ID, GET_TEMPLATE, INSERT_OBJECT, INSERT_OBJECT_EXCEL,
    LIST_OBJECT, LIST_PROPERTY, SEARCH_OBJECT,
    UPDATE_PRO_VALUE,
    WEB_BASE_NAME
} from "../API_URL";
import {IconContext} from "react-icons";
import {
    BiAddToQueue,
    FaRegTimesCircle,
    FaRegWindowClose,
    MdOutlineSave,
    RiFunctionLine,
    SiMicrosoftexcel,
    HiDocumentReport
} from "react-icons/all";
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.min.css';
import Modal from "../Modal";
import Select from "react-select";
import swal from "sweetalert";

function ObjectA(props) {
    const ADD_PROPERTY      = 1;
    const ADD_OBJECT        = 2;
    const CREATE_OBJ_EXCEL  = 3;
    const UPDATE_OBJ_EXCEL  = 4;
    const DELETE_OBJ_EXCEL  = 5;
    const {_title, _obj_type_id, _obj_type_name}    = props;
    const dispatch                                  = useDispatch();
    const [DetailData, setDetailData]               = useState({obj_id: -1, obj_name: "", data: []});
    const [ObjectData, setObjectData]               = useState([]);
    const [ShowAppBox, setShowAppBox]               = useState(false);
    const [ModalData, setModalData]                 = useState({mode: -1, data: {}, show: false, title: "no title"});
    const [ModalSelectData, setModalSelectData]     = useState(null);
    const [SearchBoxValue, setSearchBoxValue]       = useState("");
    const [selectedFile, setSelectedFile]           = useState({uploaded: false, name: "No file", file: null});

    const __FetchFunction = (URL, body, callback, dismiss = true) => {
        dispatch({type: LOADING});
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
                    if (dismiss) dispatch({type: LOADED})
                    callback(result.msg, null);
                } else if (result.code === 202) {
                    setShowAppBox(false);
                    const link = document.createElement('a');
                    link.href = BASE_URL + result.msg;
                    link.setAttribute("target", "_blank");
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                } else {
                    callback(null, result.msg);
                    if (dismiss) {
                        dispatch({
                            type: ERROR,
                            msg: result.msg
                        });
                    }
                    toast.error(result.msg);
                }
            })
            .catch(e => {
                if (dismiss) {
                    dispatch({
                        type: ERROR,
                        msg: e
                    });
                }
                toast.error(e);
            });
    }

    const ToggleApplicationBox = (e) => {
        e.stopPropagation();
        setShowAppBox(!ShowAppBox);
    }

    const SearchByObjectName = (e) => {
        if (e.keyCode === 13) {
            let BodyData = {
                "obj_name": SearchBoxValue,
                "obj_type_id": _obj_type_id
            }
            __FetchFunction(SEARCH_OBJECT, BodyData, function(response) {
                setObjectData(response);
                GetObjectInfo(response[0], 0);
            }, false);
        }
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
            setModalSelectData(null);
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

    const ChangeProDataWithExcel = (mode = -1) => {
        if (mode !== -1) {
            setSelectedFile({
                name: "No file",
                uploaded: false,
                file: null
            });
        }
        if (mode === CREATE_OBJ_EXCEL) {
            setModalData({
                show: true,
                title: "Instruction to create object with Excel file",
                data: {},
                mode: CREATE_OBJ_EXCEL
            });
        } else if (mode === UPDATE_OBJ_EXCEL) {
            swal({
                title: "Developing features",
                text: `This features will coming soon. We're sorry about this problem!`,
                icon: "info"
            });
            // setModalData({
            //     show: true,
            //     title: "Instruction to update object with Excel file",
            //     data: {},
            //     mode: UPDATE_OBJ_EXCEL
            // });
        }  else if (mode === DELETE_OBJ_EXCEL) {
            swal({
                title: "Developing features",
                text: `This features will coming soon. We're sorry about this problem!`,
                icon: "info"
            });
            // setModalData({
            //     show: true,
            //     title: "Instruction to delete object with Excel file",
            //     data: {},
            //     mode: DELETE_OBJ_EXCEL
            // });
        }
    }

    const CreateNewObject = () => {
        dispatch({type: LOADING});
        let BodyData = {
            "obj_type_id": _obj_type_id
        }
        __FetchFunction(LIST_PROPERTY, BodyData, function(response, err) {
            let temp = [];
            for (let i of response) {
                temp.push({
                    value: i.pro_id,
                    label: i.pro_name,
                    ...i
                });
            }
            setModalSelectData(null);
            setModalData({
                show: true,
                title: "Create new object",
                data: {
                    obj_name: "",
                    obj_desc: "",
                    obj_type_id: _obj_type_id,
                    list_property: temp,
                    list_property_assign: []
                },
                mode: ADD_OBJECT
            })
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
                    GetListObject();
                    toast.success(response);
                }, false);
            }
        });
    }

    const GetListObject = (cb) => {
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
            } else {
                dispatch({type: LOADED});
            }
        },false);
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
            for (let i of response) {
                let reg = new RegExp(i.rule_regex, 'g');
                i.match_regex = reg.test(i.pro_value);
            }
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

    const InsertObject = () => {
        if (ModalData.data.obj_name.trim() === "") {
            toast.error("Object needs a name!");
            return;
        }
        let tempArr = [];
        for (let i of ModalData.data.list_property_assign) {
            tempArr.push(i.value);
        }
        let BodyData = {
            "obj_type_id": _obj_type_id,
            "obj_name": ModalData.data.obj_name,
            "obj_desc": ModalData.data.obj_desc,
            "list_pro_id": tempArr
        }
        __FetchFunction(INSERT_OBJECT, BodyData, function(response) {
            setModalData({
                ...ModalData,
                show: false
            });
            GetListObject();
           toast.success(response);
        });
    }
    
    const GetTemplate = () => {
        let BodyData = {
            "obj_type_id": _obj_type_id
        }
        __FetchFunction(GET_TEMPLATE, BodyData, function (response) {
            const link = document.createElement('a');
            link.href = BASE_URL + response;
            link.setAttribute("target", "_blank");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }

    const UploadExcel = () => {
        let URI = "";
        if (selectedFile.file === null) {
            toast.error("Choose a file!");
            return;
        }

        if (ModalData.mode === CREATE_OBJ_EXCEL) {
            URI = INSERT_OBJECT_EXCEL;
        } else if (ModalData.mode === UPDATE_OBJ_EXCEL) {
            URI = "";
        } else if (ModalData.mode === DELETE_OBJ_EXCEL) {
            URI = "";
        }

        if (URI !== "") {
            dispatch({
                type: LOADING
            });
            let data = new FormData();
            data.append("excel_file", selectedFile.file);
            data.append("obj_type_id", _obj_type_id);

            let requestOptions = {
                method: 'POST',
                body: data,
                redirect: 'follow'
            };

            fetch(URI, requestOptions)
                .then(response => response.json())
                .then(result => {
                    if (result.code === 200) {
                        dispatch({
                            type: LOADED,
                            _msg: result.msg
                        });
                        GetListObject();
                        toast.success(result.msg);
                    } else {
                        dispatch({
                            type: ERROR,
                            _msg: result.msg
                        });
                        toast.error(result.msg);
                    }
                })
                .catch(e => {
                    dispatch({
                        type: ERROR,
                        _msg: e
                    });
                });
        }
    }

    const ExportData = () => {
        let BodyData = {
            "obj_type_id": _obj_type_id
        }
      __FetchFunction(EXPORT_DATA, BodyData);
    }

    const ChangeFiles = e => {
        setSelectedFile({
            ...selectedFile,
            uploaded: true,
            name: e.target.files[0].name,
            file: e.target.files[0]
        });
    }

    useEffect(function() {
        dispatch({type: LOADING});
        document.title = _title + WEB_BASE_NAME;
        GetListObject();
        return () => {
            setObjectData([]);
        }
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

                {
                    ModalData.mode === CREATE_OBJ_EXCEL && (
                        <>
                            <div>
                                <ol>
                                    <li>Download template <span onClick={GetTemplate} style={{cursor: "pointer", textDecoration: "underline"}}>here</span></li>
                                    <li>Fill value into Excel</li>
                                    <li><label className="link_style" htmlFor="upload_file">Click here</label> to upload filled Excel</li>
                                </ol>
                                <input className="hide" onChange={ChangeFiles} id="upload_file" type="file" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"/>
                                {selectedFile.file !== null ? <span className="margin-left-5">File <span className={"bold"}>{selectedFile.name}</span> is selected</span> : <span className="margin-left-5" style={{fontStyle: "italic"}}>No file selected!</span>}<br/>
                                <span style={{fontStyle: "italic", color: "red", marginTop: '10px', display: "block"}}>* Download new template whenever creating object because list property of {_obj_type_name.toLowerCase()} can be changed in setting</span>
                                <span style={{fontStyle: "italic", color: "red"}}>* If you want to remove a property away from object, insert '#' character to this property cell</span>
                            </div>
                            <div className={"margin-top-25"}>
                                <button className={"btn pull-right"} onClick={_ => setModalData({...ModalData, show: false})}>Cancel</button>
                                <button className={"btn theme_blue pull-right margin-right-10"} onClick={UploadExcel}>Upload</button>
                            </div>
                        </>
                    )
                }

                {
                    (ModalData.mode === UPDATE_OBJ_EXCEL) && (
                        <>
                            <div>
                                <ol>
                                    <li><label className="link_style" htmlFor="upload_file">Click here</label> to upload Excel</li>
                                </ol>
                                <input className="hide" onChange={ChangeFiles} id="upload_file" type="file" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"/>
                                {selectedFile.file !== null ? <span className="margin-left-5">File <span className={"bold"}>{selectedFile.name}</span> is selected</span> : <span className="margin-left-5" style={{fontStyle: "italic"}}>No file selected!</span>}<br/>
                            </div>
                            <div className={"margin-top-25"}>
                                <button className={"btn pull-right"} onClick={_ => setModalData({...ModalData, show: false})}>Cancel</button>
                                <button className={"btn pull-right margin-right-10 " + (ModalData.mode === UPDATE_OBJ_EXCEL ? "theme_green" : "theme_red")} onClick={UploadExcel}>Upload</button>
                            </div>
                        </>
                    )
                }

                {
                    ModalData.mode === DELETE_OBJ_EXCEL && (
                        <>
                            <div>
                                <span className={"err_msg margin-bottom-10"}>* System will delete all object in {_obj_type_name} depend on 'Object ID' column in Excel file and CAN NOT recover. Please be careful!</span>
                                <ol>
                                    <li><label className="link_style" htmlFor="upload_file">Click here</label> to upload Excel</li>
                                </ol>
                                <input className="hide" onChange={ChangeFiles} id="upload_file" type="file" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"/>
                                {selectedFile.file !== null ? <span className="margin-left-5">File <span className={"bold"}>{selectedFile.name}</span> is selected</span> : <span className="margin-left-5" style={{fontStyle: "italic"}}>No file selected!</span>}<br/>
                            </div>
                            <div className={"margin-top-25"}>
                                <button className={"btn pull-right"} onClick={_ => setModalData({...ModalData, show: false})}>Cancel</button>
                                <button className={"btn pull-right margin-right-10 " + (ModalData.mode === UPDATE_OBJ_EXCEL ? "theme_green" : "theme_red")} onClick={UploadExcel}>Upload</button>
                            </div>
                        </>
                    )
                }

                {ModalData.mode === ADD_OBJECT && (
                    <div style={{
                        minHeight: '60vh',
                        minWidth: '60vw',
                    }}>
                        <small className={"err_msg"}>* {_obj_type_name} has a lot of required property that will be add automatic when you create object!</small>
                        <small className={"err_msg margin-top-5"}>* Required property CAN NOT removed by manually!</small>
                        <div className="margin-top-20">
                            <label htmlFor={"_insert_object_name"}>
                                <span className="bold" style={{textTransform: "capitalize"}}>Object's name:</span>
                            </label>
                            <input className={"form-control"} id={"_insert_object_name"} placeholder={"Type a name..."} value={ModalData.data.obj_name} onChange={e => {setModalData({
                                ...ModalData,
                                data: {
                                    ...ModalData.data,
                                    obj_name: e.target.value
                                }
                            })}}/>
                        </div>
                        <div className="margin-top-20">
                            <label htmlFor={"_insert_object_desc"}>
                                <span className="bold" style={{textTransform: "capitalize"}}>Description:</span>
                            </label>
                            <input className={"form-control"} id={"_insert_object_desc"} placeholder={"Description"} value={ModalData.data.obj_desc} onChange={e => {setModalData({
                                ...ModalData,
                                data: {
                                    ...ModalData.data,
                                    obj_desc: e.target.value
                                }
                            })}}/>
                        </div>
                        <div className="margin-top-20 margin-bottom-20">
                            <label>
                                <span className="bold" style={{textTransform: "capitalize"}}>Select property:</span>
                            </label>
                            <Select
                                options={ModalData.data.list_property}
                                value={ModalSelectData}
                                onChange={ChangeProperty}
                                placeholder={"Select a property"}
                            />
                        </div>

                        <div>
                        {Array.isArray(ModalData.data.list_property_assign) && ModalData.data.list_property_assign.length > 0 && (
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
                        )}
                            <button className={"btn pull-right"} onClick={_ => setModalData({...ModalData, show: false})}>Cancel</button>
                            <button className={"btn theme_green pull-right margin-right-10"} onClick={InsertObject}>Create</button>
                        </div>
                    </div>
                )}
                
                {ModalData.mode === ADD_PROPERTY && (
                    <div style={{
                        minHeight: '60vh',
                        minWidth: '60vw',
                    }}>
                        <div className={"margin-top-20"}>
                            <label>
                                <span className="bold" style={{textTransform: "capitalize"}}>Select property:</span>
                            </label>
                            <Select
                                options={ModalData.data.list_property}
                                value={ModalSelectData}
                                onChange={ChangeProperty}
                            />
                        </div>
                        <div>
                            {Array.isArray(ModalData.data.list_property_assign) && ModalData.data.list_property_assign.length > 0 && (
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
                            )}
                            <button className={"btn pull-right"} onClick={_ => setModalData({...ModalData, show: false})}>Cancel</button>
                            <button className={"btn theme_yellow pull-right margin-right-10"} onClick={UpdatePropertyOfObject}>Save</button>
                        </div>
                    </div>
                )}
            </Modal>

            <div className="box-style" style={{height: "calc(100% - 40px)", padding: '20px', display: 'flex', position: 'relative'}}>

                <div style={{width: '300px', height: 'calc(100% - 30px)', display: 'inline-block'}}>
                    <input className="form-control" onKeyDown={SearchByObjectName} onChange={e => setSearchBoxValue(e.target.value)} value={SearchBoxValue} placeholder={`Find by ${_obj_type_name.toLowerCase()} name ...`}/>
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
                                display: "inline-block",
                                textTransform: "capitalize"
                            }}>
                                <span style={{fontWeight: "bold", fontSize: "25px", display: "inline-block", marginTop: "15px"}}>{_obj_type_name.toLowerCase()} : {DetailData.obj_name}</span>
                                <button className="btn theme_brown margin-10 pull-right" onClick={AddProperty}>
                                    <IconContext.Provider value={{size: 22, className: 'middle-btn'}}>
                                        <BiAddToQueue/>
                                    </IconContext.Provider>
                                    &nbsp;Add property to {DetailData.obj_name}</button>
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
                                            {item.match_regex === false && (<small className={"err_msg italic"}>Not match rule "{item.rule_name}"</small>)}
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
                            <button className="btn theme_cyan margin-10" onClick={ExportData}>
                                <IconContext.Provider value={{size: 22, className: 'middle-btn'}}>
                                    <HiDocumentReport/>
                                </IconContext.Provider>
                                &nbsp;Export all {_obj_type_name} data</button>

                            <button className="btn theme_orange margin-10" onClick={_ => ChangeProDataWithExcel(CREATE_OBJ_EXCEL)}>
                                <IconContext.Provider value={{size: 22, className: 'middle-btn'}}>
                                    <SiMicrosoftexcel/>
                                </IconContext.Provider>
                                &nbsp;Create object (Excel)</button>

                            <button className="btn theme_orange margin-10" onClick={_ => ChangeProDataWithExcel(UPDATE_OBJ_EXCEL)}>
                                <IconContext.Provider value={{size: 22, className: 'middle-btn'}}>
                                    <SiMicrosoftexcel/>
                                </IconContext.Provider>
                                &nbsp;Update object (Excel)</button>

                            <button className="btn theme_orange margin-10" onClick={_ => ChangeProDataWithExcel(DELETE_OBJ_EXCEL)}>
                                <IconContext.Provider value={{size: 22, className: 'middle-btn'}}>
                                    <SiMicrosoftexcel/>
                                </IconContext.Provider>
                                &nbsp;Delete object (Excel)</button>

                            <button className="btn theme_green700 margin-10" onClick={CreateNewObject}>
                                <IconContext.Provider value={{size: 22, className: 'middle-btn'}}>
                                    <BiAddToQueue/>
                                </IconContext.Provider>
                                &nbsp;Create object (Manual)</button>
                        </div>
                    </div>
            </div>
        </div>
    );
}

export default ObjectA;