import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {ERROR, LOADED} from "../Redux/ReducersAndActions/Status/StatusActionsDefinition";
import Loading from "../Loading";
import {toast, ToastContainer} from "react-toastify";
import {IconContext} from "react-icons/lib";
import {RiDeleteBin2Fill, RiEditFill, BsInfoCircleFill} from "react-icons/all";
import {ConvertTimeStamptoString, ReplaceCharacters} from "../Utils";
import {GET_PRO_BY_ID, VLAN_GET_IP, WEB_BASE_NAME} from "../API_URL";
import Modal from './../Modal';

function VLAN (props) {
    const { _title }                        = props;
    let   [editItem, setEditItem]           = useState({show: false, data: {}, title:"No title", mode: -1});
    const [ExcelModal, setExcelModal]       = useState({show: false});
    const [VLANData, setVLANData]           = useState([]);
    const [TotalPage, setTotalPage]         = useState(0);
    const [offset, setOffSet]               = useState(0);
    const [Search, setSearch]               = useState("");
    const [selectedFile, setSelectedFile]   = useState({uploaded: false, name: "No file", file: null});
    const { loading, error, _msg }          = useSelector(state => state.Status);
    const dispatch                          = useDispatch();
    const LIMIT                             = 10;

    const EDIT_VLAN_MODE = 0;
    const ADD_VLAN_MODE = 1;
    const DELETE_VLAN_MODE = 2;
    const DETAIL_VLAN_MODE = 4;

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
                    callback(result.msg);
                } else {
                    dispatch({
                        type: ERROR,
                        msg: result.msg[0]
                    });
                }
            })
            .catch(e => {
                dispatch({
                    type: ERROR,
                    msg: e
                })
            });
    }

    const EditIP = (item, index) => {
        __FetchFunction(GET_PRO_BY_ID, {
            "id": item.id
        }, function (res) {
            setEditItem({
                ...editItem,
                mode: EDIT_VLAN_MODE,
                show: true,
                title: `Edit properties of IP: ${res[0].ip}`,
                data: res[0]
            });
        });
    }

    const delIPs = (item, index) => {

    }

    const DetailIP = (item, index) => {
        __FetchFunction(GET_PRO_BY_ID, {
            "id": item.id
        }, function (res) {
            setEditItem({
                ...editItem,
                mode: DETAIL_VLAN_MODE,
                show: true,
                title: `Detail properties of IP: ${res[0].ip}`,
                data: res[0]
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

    useEffect(() => {
        document.title = _title + WEB_BASE_NAME;
        __FetchFunction(VLAN_GET_IP, {
            offset: offset,
            limit: LIMIT
        }, function (res) {
            setVLANData(res.list);
            setTotalPage(res.total);
        });
    }, [offset]);

    if (error) {
        toast.error(_msg);
        dispatch({type: LOADED});
    }

    return (
        <div className="container">
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

            <Modal
                onDismiss={editItem.mode===DETAIL_VLAN_MODE ? DismissModal : undefined}
                CloseModal={DismissModal}
                WrapClass={"modal_wrap"}
                show={editItem.show}
                title={editItem.title}>
                {
                    editItem.mode === EDIT_VLAN_MODE && Object.keys(editItem.data).length>0 && Object.keys(editItem.data.properties).map(function (item, index) {
                        return (
                            <div key={index} className="margin-top-20">
                                <label className="bold" htmlFor={"__" + item}>{item}</label>
                                <input
                                    id={item}
                                    value={editItem.data.properties[`${item}`]}
                                    onChange={e => {
                                        setEditItem(prevState => ({
                                            ...prevState,
                                            data: {
                                                ...editItem.data,
                                                properties: {
                                                    ...editItem.data.properties,
                                                    [e.target.id]: e.target.value
                                                }
                                            }
                                        }));
                                    }}
                                    className="form-control"
                                    placeholder={item}/>
                            </div>
                        )
                    })
                }

                {
                    editItem.mode === DETAIL_VLAN_MODE && Object.keys(editItem.data).length>0 && (
                        Object.keys(editItem.data.properties).map((item, index) => {
                            return(
                                <div key={"____" + index} className="margin-top-15">
                                    <span className="col-1"/>
                                    <span className="col-4 bold">{item}: </span>
                                    <span className="col-1"/>
                                    <span className="col-6">{editItem.data.properties[`${item}`]}</span>
                                </div>
                            )
                        })
                    )
                }
            </Modal>

            {loading && <Loading/>}

            {!loading && (
                <div className="vlan_container">
                    {VLANData.length === 0 && (
                        <div className="center-div">
                            <h3>No VLAN IP!</h3>
                        </div>
                    )}

                    {VLANData.length !== 0 && (

                        <>
                            <table className="nice_theme margin-top-20">
                                <thead className="text-center">
                                <tr>
                                    <th>Index</th>
                                    <th>VLAN IPs</th>
                                    <th>Created at</th>
                                    <th>Last update</th>
                                    <th>Edit / Del / Detail</th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    VLANData.map((item, index) => {
                                        return(
                                            <tr key={item.id}>
                                                <td className="text-center">{offset+index+1}</td>
                                                <td className="bold">{ReplaceCharacters(item.ip)}</td>
                                                <td>{ConvertTimeStamptoString(ReplaceCharacters(item.createdAt))}</td>
                                                <td>{ConvertTimeStamptoString(ReplaceCharacters(item.updatedAt))}</td>
                                                <td className="table_icon text-center">
                                                    <span className="pointer" onClick={() => EditIP(item, index)}>
                                                        <IconContext.Provider value={{size: 20, color: "#0ec48b"}}>
                                                            <RiEditFill/>
                                                        </IconContext.Provider>
                                                    </span>
                                                    <span className="margin-right-20 margin-left-20 pointer" onClick={() => delIPs(item, index)}>
                                                        <IconContext.Provider value={{size: 20, color: "#c7003f"}}>
                                                            <RiDeleteBin2Fill/>
                                                        </IconContext.Provider>
                                                    </span>
                                                    <span className="pointer" onClick={() => DetailIP(item, index)}>
                                                        <IconContext.Provider value={{size: 20, color: "#004ca9"}}>
                                                            <BsInfoCircleFill/>
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

export default VLAN;