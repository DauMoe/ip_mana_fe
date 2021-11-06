import React, { useEffect, useState } from "react";
import swal from "sweetalert";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import {IconContext} from "react-icons/lib";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
    BLACKLIST_ADD_IP,
    BLACKLIST_EDIT_IP,
    BLACKLIST_GET_IP,
    BLACKLIST_REMOVE_IP,
    WEB_BASE_NAME,
    BLACKLIST_ADD_EXCEL,
    TEMPLATE_URL,
    BLACKLIST_SEARCH_IP,
    BLACKLIST_UPDATE_EXCEL,
    BLACKLIST_DELETE_EXCEL,
    BLACKLIST_EXPORT_EXCEL,
    BASE_URL, BLACKLIST_IMPORTED_IP_TODAY_EXCEL
} from '../API_URL';
import Modal from "../Modal";
import "./BlackList.sass"
import {ERROR, LOADED, LOADING} from "../Redux/ReducersAndActions/Status/StatusActionsDefinition";
import {
    BsPlusLg,
    RiEditFill,
    RiDeleteBin2Fill,
    RiFileExcel2Fill
} from "react-icons/all";
import {useSelector, useDispatch} from "react-redux";
import {Link} from "react-router-dom";

//Sweetalert: https://sweetalert.js.org/guides/
//Toastify: https://fkhadra.github.io/react-toastify/icons

const ADD_NEW_MODE  = 0;
const UPDATE_MODE   = 1;
const DELETE_MODE   = 2;

const _MONTH = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Sep"];

const ReplaceCharacters = (msg) => {
    if (typeof(msg) !== 'string') return msg;
    return msg.replace(/["']/g, "");
}

const ConvertTimeStamptoString = (timestamp, getDate = true, getTime = true, forInputTag = false) => {
    let msg = "";
    if (!timestamp || timestamp.length === 0) return "";
    let _d = new Date(timestamp);

    if (forInputTag) {
        if (getDate) {
            msg += _d.getFullYear();
            msg += "-"
            msg += ((_d.getMonth() + 1) < 10) ? "0" + (_d.getMonth() + 1) : (_d.getMonth() + 1);
            msg += "-"
            msg += (_d.getDate() < 10) ? "0" + _d.getDate() : _d.getDate();
        }
    } else {
        if (getDate) {
            msg += _MONTH[_d.getMonth()];
            msg += " ";
            msg += (_d.getDate() < 10) ? "0" + _d.getDate() : _d.getDate();
            msg += ", ";
            msg += _d.getFullYear();
            msg += " ";
        }

        if (getTime) {
            msg += (_d.getHours() < 10) ? "0" + _d.getHours() : _d.getHours();
            msg += ":";
            msg += (_d.getMinutes() < 10) ? "0" + _d.getMinutes() : _d.getMinutes();
            msg += ":";
            msg += (_d.getSeconds() < 10) ? "0" + _d.getSeconds() : _d.getSeconds();
        }
    }
    return msg;
}

function BlackList (props) {
    const { _title }                        = props;
    const [editItem, setEditItem]           = useState({show: false});
    const [ExcelModal, setExcelModal]       = useState({show: false});
    const [BlackListData, setBlackListData] = useState([]);
    const [TotalPage, setTotalPage]         = useState(0);
    const [offset, setOffSet]               = useState(0);
    const [Search, setSearch]               = useState("");
    const [selectedFile, setSelectedFile]   = useState({uploaded: false, name: "No file", file: null});
    const { loading, error, _msg }          = useSelector(state => state.Status);
    const dispatch                          = useDispatch();
    const LIMIT                             = 10;

    const _FetchAllData = (offset, limit = LIMIT) => {
        dispatch({
            type: LOADING
        });
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        let raw = JSON.stringify({
            "limit": limit,
            "offset": offset
        });

        let requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };
          
        fetch(BLACKLIST_GET_IP, requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result.code === 200) {
                    dispatch({type: LOADED})
                    setBlackListData(result.msg.list);
                    setTotalPage(result.msg.total);
                } else {
                    dispatch({
                        type: ERROR,
                        _msg: result.msg[0]
                    });
                }
            })
            .catch(e => {
                dispatch({
                    type: ERROR,
                    _msg: e
                })
            });
    }

    const delIPs = (item, index) => {
        swal({
            title: "DELETE",
            text: `Do you want delete IP ${item.ip}?`,
            icon: "warning",
            buttons: true,
            dangerMode: true
        }).then(val => {
            if (val) {
                //Delete IP here
                let myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");

                let raw = JSON.stringify({
                    "id": ReplaceCharacters(item.id)
                });

                let requestOptions = {
                    method: 'POST',
                    headers: myHeaders,
                    body: raw,
                    redirect: 'follow'
                };

                fetch(BLACKLIST_REMOVE_IP, requestOptions)
                    .then(response => response.json())
                    .then(result => {
                        if (result.code === 200) {
                            dispatch({
                                type: LOADED
                            });
                            toast.success("Delete successful!");
                            BlackListData.splice(index, 1);
                            let afterDel = [...BlackListData];
                            setBlackListData(afterDel);
                        } else {
                            toast.error("Error while deleting!");
                            dispatch({
                                type: ERROR,
                                msg: result.msg
                            })
                        }
                    })
                    .catch(e => {
                        toast.error("Error while deleting!");
                        dispatch({
                            type: ERROR,
                            _msg: e
                        })
                    });
            }
        });
    }

    const EditIP = (item, index) => {
        setEditItem({
            ...item,
            show: true,
            title: 'Edit blacklist ip',
            index: index,
            editMode: true
        });
    }

    const SaveEditIP = () => {
        dispatch({
            type: LOADING
        });
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        let raw = JSON.stringify({
            "id": editItem.id,
            "ip": editItem.ip,
            "desc": editItem.desc,
            "create_time": editItem.create_time
        });

        let requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(BLACKLIST_EDIT_IP, requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result.code === 200) {
                    dispatch({
                        type: LOADED
                    });
                    toast.success("Update successful!");
                    let tempData = BlackListData;
                    tempData[editItem.index] = JSON.parse(JSON.stringify(editItem));
                    setBlackListData(tempData);
                    DismissModal();
                } else {
                    dispatch({
                        type: ERROR,
                        _msg: result.msg[0]
                    });
                }
            })
            .catch(e => {
                dispatch({
                    type: ERROR,
                    _msg: e
                });
            });
    }

    const DismissModal = () => {
        setEditItem({...editItem, show: false});
    }

    const DismissExcelModal = () => {
        setExcelModal({...ExcelModal, show: false});
        setSelectedFile({
            name: "No file",
            uploaded: false,
            file: null
        });
    }

    const Add2BlackList = () => {
        setEditItem({
            title: 'Add new Blacklist IP',
            show: true,
            ip: '',
            desc: '',
            create_time: '',
            editMode: false,
            index: -1
        });
    }

    const AddNewExcelFunction = () => {
        setExcelModal({
            ...ExcelModal,
            title: "Create Blacklist IP by Excel",
            show: true,
            mode: ADD_NEW_MODE
        });
    }

    const UpdateExcelFunction = () => {
        setExcelModal({
            ...ExcelModal,
            title: "Update Blacklist IP by Excel",
            show: true,
            mode: UPDATE_MODE
        });
    }

    const DeleteExcelFunction = () => {
        setExcelModal({
            ...ExcelModal,
            title: "Delete Blacklist IP by Excel",
            show: true,
            mode: DELETE_MODE
        });
    }

    const UploadExcel = () => {
        if (selectedFile.file === null) {
            toast.error("Choose a file!");
            return;
        }

        dispatch({
            type: LOADING
        });
        let data = new FormData();
        data.append(
            "blacklist_file",
            selectedFile.file,
            selectedFile.name
        );

        let requestOptions = {
            method: 'POST',
            body: data,
            redirect: 'follow'
        };

        let URI;

        if (ExcelModal.mode === ADD_NEW_MODE) {
            URI = BLACKLIST_ADD_EXCEL;
        }

        if (ExcelModal.mode === UPDATE_MODE) {
            URI = BLACKLIST_UPDATE_EXCEL;
        }

        if (ExcelModal.mode === DELETE_MODE) {
            URI = BLACKLIST_DELETE_EXCEL;
        }

        fetch(URI, requestOptions)
            .then(response => response.json())
            .then(result => {
                DismissExcelModal();
                if (result.code === 200) {
                    dispatch({type: LOADED});
                    toast.success("Create blacklist successful!");
                    _FetchAllData(0);
                } else if (result.code === 202) {
                    const link = document.createElement('a');
                    link.href = BASE_URL + result.msg[0].url;
                    link.setAttribute("target", "_blank");
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    dispatch({
                        type: ERROR,
                        _msg: "Duplicate IPs"
                    });
                } else {
                    dispatch({
                        type: ERROR,
                        _msg: result.msg[0]
                    });
                }
            })
            .catch(e => {
                dispatch({
                    type: ERROR,
                    _msg: e
                });
            });
    }

    const ChangeFiles = e => {
        setSelectedFile({
            ...selectedFile,
            uploaded: true,
            name: e.target.files[0].name,
            file: e.target.files[0]
        });
    }

    const CreateNewIP = () => {
        if (!editItem.ip || editItem.ip.length === 0) {
            toast.error("IP is required!");
            return;
        }
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        let raw = JSON.stringify({
            "ip": editItem.ip,
            "desc": editItem.desc,
            "create_time": editItem.create_time,
        });

        let requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(BLACKLIST_ADD_IP, requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result.code === 200) {
                    DismissModal();
                    _FetchAllData(0);
                } else {
                    dispatch({
                        type: ERROR,
                        _msg: result.msg[0]
                    });
                }
            })
            .catch(e => {
                dispatch({
                    type: ERROR,
                    _msg: e
                });
            });
    }

    const SearchByIP = e => {
        if (Search.trim() === "" && e.keyCode === 13) {
            _FetchAllData(0);
        } else if (e.keyCode === 13) {
            dispatch({type: LOADING});
            let myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            let raw = JSON.stringify({
                "ip": e.target.value
            });

            let requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            fetch(BLACKLIST_SEARCH_IP, requestOptions)
                .then(response => response.json())
                .then(result => {
                    if (result.code === 200) {
                        dispatch({type: LOADED})
                        setBlackListData(result.msg.list);
                        setTotalPage(result.msg.total);
                    } else {
                        dispatch({
                            type: ERROR,
                            _msg: result.msg[0]
                        });
                    }
                })
                .catch(e => {
                    dispatch({
                        type: ERROR,
                        _msg: e
                    })
                });
        }
    }

    const ExportAllExcel = () => {
        swal({
            title: "LARGE DATA",
            text: `We will export all data and it's so large. Continue?`,
            icon: "warning",
            buttons: true,
            dangerMode: true
        }).then(val => {
            if (val) {
                let requestOptions = {
                    method: 'POST',
                    redirect: 'follow'
                };

                fetch(BLACKLIST_EXPORT_EXCEL, requestOptions)
                    .then(response => response.json())
                    .then(result => {
                        if (result.code === 200) {
                            const link = document.createElement('a');
                            link.href = BASE_URL + result.msg[0].url;
                            link.setAttribute("target", "_blank");
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                        } else {
                            dispatch({
                                type: ERROR,
                                _msg: result.msg[0]
                            });
                        }
                    })
                    .catch(e => {
                        dispatch({
                            type: ERROR,
                            _msg: e
                        });
                    });
            }
        });
    }

    const ExportImportedIPTodayExcel = () => {
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        let raw = JSON.stringify({
            "createdAt_from": new Date().setUTCHours(0,0,0,0),
            "createdAt_to": new Date().setUTCHours(23,59,59,999)
        });

        let requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(BLACKLIST_IMPORTED_IP_TODAY_EXCEL, requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result.code === 200) {
                    const link = document.createElement('a');
                    link.href = BASE_URL + result.msg[0].url;
                    link.setAttribute("target", "_blank");
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                } else {
                    dispatch({
                        type: ERROR,
                        _msg: result.msg[0]
                    });
                }
            })
            .catch(e => {
                dispatch({
                    type: ERROR,
                    _msg: e
                });
            });
    }

    useEffect(() => {
        document.title = _title + WEB_BASE_NAME;
        _FetchAllData(offset);
    }, [offset]);

    if (error) {
        toast.error(_msg);
        dispatch({type: LOADED});
    }

    return(
        <div className="container">

            <Modal
                CloseModal={DismissExcelModal}
                show={ExcelModal.show}
                WrapClass={"modal_wrap"}
                title={ExcelModal.title}>
                <ol>
                    {ExcelModal.mode === ADD_NEW_MODE && <li>Download template from <Link to={{pathname: TEMPLATE_URL + "Create_BlackList_Template.xlsx"}} target="_blank" rel="noopener noreferrer">here</Link></li>}
                    {ExcelModal.mode === UPDATE_MODE && <li>Download template from <Link to={{pathname: TEMPLATE_URL + "Update_BlackList_Template.xlsx"}} target="_blank" rel="noopener noreferrer">here</Link></li>}
                    {ExcelModal.mode === DELETE_MODE && <li>Download template from <Link to={{pathname: TEMPLATE_URL + "Delete_BlackList_Template.xlsx"}} target="_blank" rel="noopener noreferrer">here</Link></li>}
                    <li>Fill all data into template</li>
                    <li><label className="link_style" htmlFor="upload_file">Click here</label> to choose a file</li>
                    <input className="hide" onChange={ChangeFiles} id="upload_file" type="file" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"/>
                </ol>
                {selectedFile.file !== null && <span className="margin-left-5">File name: {selectedFile.name}</span>}
                <div className="margin-top-15">
                    {ExcelModal.mode === ADD_NEW_MODE && <button className="btn theme_green pull-right" onClick={UploadExcel}>Create</button>}
                    {ExcelModal.mode === UPDATE_MODE && <button className="btn theme_yellow pull-right" onClick={UploadExcel}>Update</button>}
                    {ExcelModal.mode === DELETE_MODE && <button className="btn theme_red pull-right" onClick={UploadExcel}>Delete</button>}
                </div>
            </Modal>

            <Modal
                CloseModal={DismissModal}
                WrapClass={"modal_wrap"}
                show={editItem.show}
                title={editItem.title}>
                <div>
                    <input
                        value={editItem.ip}
                        onChange={e => setEditItem({...editItem, ip: e.target.value})}
                        className="form-control"
                        placeholder={"IP"}/>
                </div>
                <div className="margin-top-20">
                    <input
                        value={editItem.desc}
                        onChange={e => setEditItem({...editItem, desc: e.target.value})}
                        className="form-control"
                        placeholder={"Description"}/>
                </div>
                <div className="margin-top-20">
                    <DatePicker
                        className="form-control"
                        selected={editItem.create_time}
                        onChange={date => setEditItem({...editItem, create_time: date})}/>
                </div>
                <div className="margin-top-20 text-center">
                    {editItem.editMode && <button className="btn theme_green" onClick={SaveEditIP}>Save</button>}
                    {!editItem.editMode && <button className="btn theme_green" onClick={CreateNewIP}>Create new</button>}
                </div>
            </Modal>

            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={true}
                rtl={false}
                pauseOnFocusLoss={false}
                theme="colored"
                draggable={false}
                pauseOnHover/>

            {loading && (
                <div className="center-div">
                    <span className="loader"/>
                </div>
            )}

            {!loading && (
                <div className="bl_container">
                    <div className="add_bl">
                        <input className={"form-control border-radius-100 pull-right margin-left-10"} style={{"width": "0"}} value={Search} onChange={e => setSearch(e.target.value)} onKeyDown={SearchByIP} placeholder={"Search by IP"}/>
                        <button className="btn margin-right-10 theme_gray" onClick={Add2BlackList}><BsPlusLg/>&nbsp; Add blacklist IP</button>
                        <button className="btn margin-right-10 theme_green" onClick={AddNewExcelFunction}><RiFileExcel2Fill/>&nbsp;Add (Excel)</button>
                        <button className="btn margin-right-10 theme_yellow" onClick={UpdateExcelFunction}><RiFileExcel2Fill/>&nbsp;Update (Excel)</button>
                        <button className="btn margin-right-10 theme_red" onClick={DeleteExcelFunction}><RiFileExcel2Fill/>&nbsp;Delete (Excel)</button>
                        <button className="btn margin-right-10 theme_cyan" onClick={ExportAllExcel}><RiFileExcel2Fill/>&nbsp;Export (Excel)</button>
                        <button className="btn margin-right-10 theme_cyan" onClick={ExportImportedIPTodayExcel}><RiFileExcel2Fill/>&nbsp;Export Imported IP Today (Excel)</button>
                    </div>
                    {BlackListData.length === 0 && (
                        <div className="center-div">
                            <h3>No blacklist IPs founded!</h3>
                        </div>
                    )}

                    {BlackListData.length !== 0 && (
                        <>
                            <table className="nice_theme margin-top-20">
                                <thead className="text-center">
                                <td>Index</td>
                                <td>Blacklist IPs</td>
                                <td>Validity</td>
                                <td>Create time</td>
                                <td>Create at</td>
                                <td>Last update</td>
                                <td>Edit / Del</td>
                                </thead>
                                <tbody>
                                {
                                    BlackListData.map((item, index) => {
                                        return(
                                            <tr key={item.id}>
                                                <td className="text-center">{offset+index+1}</td>
                                                <td className="bold">{ReplaceCharacters(item.ip)}</td>
                                                {/* <td>{ReplaceCharacters(item.desc) === "" ? "<Không có mô tả>" : ReplaceCharacters(item.desc)}</td> */}
                                                <td>{ReplaceCharacters(item.desc)}</td>
                                                <td>{ConvertTimeStamptoString(ReplaceCharacters(item.create_time))}</td>
                                                <td>{ConvertTimeStamptoString(ReplaceCharacters(item.createdAt))}</td>
                                                <td>{ConvertTimeStamptoString(ReplaceCharacters(item.updatedAt))}</td>
                                                <td className="table_icon text-center">
                                                <span className="margin-right-20" onClick={() => EditIP(item, index)}>
                                                    <IconContext.Provider value={{size: 20, color: "#1886b5"}}>
                                                        <RiEditFill/>
                                                    </IconContext.Provider>
                                                </span>
                                                    <span onClick={() => delIPs(item, index)}>
                                                    <IconContext.Provider value={{size: 20, color: "#c7003f"}}>
                                                        <RiDeleteBin2Fill/>
                                                    </IconContext.Provider>
                                                </span>
                                                </td>
                                            </tr>
                                        );
                                    })
                                }
                                </tbody>
                            </table>

                            <div style={{display: "inline-block"}}>
                                Page {offset/LIMIT + 1} / {Math.ceil(TotalPage/LIMIT)}
                            </div>

                            <div className="pagination padding-top-20 padding-right-10 pull-right">
                                <span>&lt;&lt;</span>
                                {Array
                                    .from(
                                        {length: Math.ceil(TotalPage/LIMIT)},
                                        (_, i) => {
                                            return (<span onClick={() => setOffSet(i*LIMIT)} key={i}>{i+1}</span>)
                                        })}
                                <span>&gt;&gt;</span>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

export default BlackList;