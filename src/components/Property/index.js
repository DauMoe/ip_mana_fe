import {ERROR, LOADED, LOADING} from "../Redux/ReducersAndActions/Status/StatusActionsDefinition";
import {useDispatch, useSelector} from "react-redux";
import {IconContext} from "react-icons";
import {BiAddToQueue, FaRegWindowClose, MdOutlineSave, RiFunctionLine} from "react-icons/all";
import React, {useEffect, useState} from "react";
import {
    DELETE_PROPERTY, GET_PRO_INFO,
    INSERT_PROPERTY,
    LIST_OBJ_TYPE,
    LIST_PROPERTY,
    LIST_RULES,
    UPDATE_PROPERTY,
    WEB_BASE_NAME
} from "../API_URL";
import Select from "react-select";
import {toast, ToastContainer} from "react-toastify";
import Modal from "../Modal";

function Property(props) {
    const CREATE_PROPERTY                       = 1;
    const {_title}                              = props;
    const dispatch                              = useDispatch();
    const {token}                               = useSelector(state => state.Authen);
    const [ShowAppBox, setShowAppBox]           = useState(false);
    const [PropertyData, setPropertyData]       = useState([]);
    const [ListObjType, setListObjType]         = useState([]);
    const [ListRule, setListRule]               = useState([]);
    const [DetailData, setDetailData]           = useState({});
    const [ModalSelectData, setModalSelectData] = useState(null);
    const [ModalSelectData1, setModalSelectData1] = useState(null);
    const [ModalData, setModalData]             = useState({mode: -1, data: {list_property: [], list_property_assign: []}, show: false, title: "no title"});

    const __FetchFunction = (URL, body, callback, err_cb) => {
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
                    callback(null, result.msg);
                    dispatch({
                        type: ERROR,
                        msg: result.msg
                    });
                    toast.error(result.msg);
                }
            })
            .catch(e => {
                dispatch({
                    type: ERROR,
                    msg: e
                })
            });
    }

    const SearchByPropertyName = (e) => {

    }

    const CreateProperty = () => {
        setModalSelectData(null);
        setModalSelectData1(null);
        setModalData({
            show: true,
            data: {
                "pro_name": "",
                "pro_desc": "",
                "rule_id": -1,
                "list_obj_type": []
            },
            title: "Create property",
            mode: CREATE_PROPERTY
        });
    }

    const ChangeRequired = (e, index) => {
        let CloneDetailData = {...DetailData};
        CloneDetailData.ListObjType[index].is_required = !DetailData.ListObjType[index].is_required;
        setDetailData(CloneDetailData);
    }

    const ChangeRequiredInModal = (index) => {
        let CloneDetailData = [...ModalSelectData1];
        CloneDetailData[index].is_required = !ModalSelectData1[index].is_required;
        setModalSelectData1(CloneDetailData);
    }

    const UpdateProperty = () => {
        if (typeof (DetailData.rule) !== "object") {
            toast.error("Choose a RULE");
            return;
        }
        if (Array.isArray(DetailData.ListObjType) && DetailData.ListObjType.length === 0) {
            toast.error("Choose at least one OBJECT TYPE");
            return;
        }
        let BodyData = {
            "ssid": token,
            "pro_id": DetailData.pro_id,
            "pro_name": DetailData.pro_name,
            "pro_desc": DetailData.pro_desc,
            "rule_id": DetailData.rule.value,
            "list_obj_type": []
        };
        for (let i of DetailData.ListObjType) {
            BodyData.list_obj_type.push({
                "obj_type_id": i.value,
                "is_required": i.is_required
            });
        }
        __FetchFunction(UPDATE_PROPERTY, BodyData, function(response) {
            __FetchFunction(LIST_PROPERTY, BodyData, function(resp, err) {
                if (err !== null) {
                    setPropertyData(resp);
                    if (resp.length > 0) {
                        GetPropertyInfo(resp[0]);
                    }
                } else {
                    GetPropertyInfo(DetailData);
                }
            });
            toast.success(response);
        });
    }

    const ChangeProperty = (item) => {
        setModalSelectData(item);
    }

    const ChangeObjectTypeinModal = (item) => {
      setModalSelectData1(item);
    }

    const InsertProperty = () => {
        if (ModalData.data.pro_name.trim() === "") {
            toast.error("Property needs a name!");
            return;
        }
        if (ModalSelectData === null) {
            toast.error("Select a rule for property!");
            return;
        }

        if (ModalSelectData1 === null) {
            toast.error("Select a least an object type!");
            return;
        }

      let BodyData = {
            "ssid": token,
            "pro_name": ModalData.data.pro_name,
            "pro_desc": ModalData.data.pro_desc,
            "rule_id": ModalSelectData.value,
            "list_obj_type": []
      }
        for (let i of ModalSelectData1) {
            BodyData.list_obj_type.push({
                obj_type_id: i.value,
                is_required: i.is_required
            });
        }
      __FetchFunction(INSERT_PROPERTY, BodyData, function(response, err) {
          if (err !== null) return;
          setModalData({
              ...ModalData,
              show: false
          });
          GetListProperty();
          toast.success(response);
      });
    }

    const DeleteProperty = () => {
        let BodyData = {
            "ssid": token,
            "pro_id": DetailData.pro_id
        };
        __FetchFunction(DELETE_PROPERTY, BodyData, function(response) {
            __FetchFunction(LIST_PROPERTY, BodyData, function(resp) {
                setPropertyData(resp);
                if (resp.length > 0) {
                    GetPropertyInfo(resp[0]);
                }
            });
            toast.success(response);
        });
    }

    const GetPropertyInfo = (item) => {
        let BodyData = {
            "ssid": token,
            "pro_id": item.pro_id
        };
        __FetchFunction(GET_PRO_INFO, BodyData, function (response) {
            let TempItem = {...item};
            TempItem.ListObjType = [];
            for (let i of response) {
                TempItem.ListObjType.push({
                    value: i.obj_type_id,
                    label: i.obj_type_name,
                    is_required: i.is_required
                });
            }
            for (let i of ListRule) {
                if (i.value === TempItem.rule_id) {
                    TempItem.rule = i;
                    break;
                }
            }
            setDetailData(TempItem);
        });
    }

    const ChangeObjType = (item) => {
        console.log(item);
        setDetailData({
            ...DetailData,
            ListObjType: item
        });
    }

    const ChangeRule = (item) => {
        setDetailData({
            ...DetailData,
            rule: item
        })
    }

    const ToggleApplicationBox = (e) => {
        e.stopPropagation();
        setShowAppBox(!ShowAppBox);
    }

    const HandleClickOut = (e) => {
        setModalData({
            ...ModalData,
            show: false
        })
    }

    const GetListProperty = () => {
        __FetchFunction(LIST_PROPERTY, undefined, function(response) {
            let result = [];
            for (let i of response) {
                i.ListObjType = [];
                result.push(i);
            }
            setPropertyData(result);
        });
    }

    useEffect(function() {
        dispatch({type: LOADING});
        document.title = _title + WEB_BASE_NAME;
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        let ListAPI = [{
            url: LIST_PROPERTY,
            requestOptions: {
                method: 'POST',
                redirect: 'follow',
                headers: myHeaders,
                body: JSON.stringify({"ssid": token})
            }
        }, {
            url: LIST_OBJ_TYPE,
            requestOptions: {
                method: 'POST',
                redirect: 'follow',
                headers: myHeaders,
                body: JSON.stringify({"ssid": token})
            }
        }, {
            url: LIST_RULES,
            requestOptions: {
                method: 'POST',
                redirect: 'follow',
                headers: myHeaders,
                body: JSON.stringify({"ssid": token})
            }
        }];

        Promise.all(ListAPI.map((item => fetch(item.url, item.requestOptions))))
            .then(responses => Promise.all(responses.map(resp => resp.json())))
            .then(resp => {
                let HasErr = false;
                for (let i of resp) {
                    if (i.code !== 200) {
                        HasErr = true;
                        dispatch({
                            type: ERROR,
                            msg: resp.msg
                        });
                    }
                }
                if (!HasErr) {
                    dispatch({type: LOADED});
                    let result = [];
                    for (let i of resp[0].msg) {
                        i.ListObjType = [];
                        result.push(i);
                    }
                    setPropertyData(result);
                    if (result.length > 0) {
                        GetPropertyInfo(result[0]);
                    }
                    let TempArr = [];
                    for (let i of resp[1].msg) {
                        TempArr.push({
                            value: i.obj_type_id,
                            label: i.obj_type_name,
                            is_required: false
                        });
                    }
                    setListObjType(TempArr);
                    TempArr = [];
                    for (let i of resp[2].msg) {
                        TempArr.push({
                            value: i.rule_id,
                            label: i.rule_name
                        });
                    }
                    setListRule(TempArr);
                }
            })
            .catch(e => {
                dispatch({
                    type: ERROR,
                    msg: e
                });
            });
        return () => {
            setPropertyData([]);
            setListRule([]);
            setListObjType([]);
        }
    }, []);

    return(
        <div className="container" onClick={() => setShowAppBox(false)}>
            <ToastContainer
                position="top-right"
                autoClose={4000}
                hideProgressBar={true}
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
                {ModalData.mode === CREATE_PROPERTY && (
                    <div style={{
                        minWidth: '60vw',
                    }}>
                        <div className="margin-top-20">
                            <label htmlFor={"_insert_property_name"}>
                                <span className="bold" style={{textTransform: "capitalize"}}>Property's name:</span>
                            </label>
                            <input className={"form-control"} id={"_insert_property_name"} placeholder={"Type a name..."} value={ModalData.data.pro_name} onChange={e => {setModalData({
                                ...ModalData,
                                data: {
                                    ...ModalData.data,
                                    pro_name: e.target.value
                                }
                            })}}/>
                        </div>
                        <div className="margin-top-20">
                            <label htmlFor={"_insert_property_desc"}>
                                <span className="bold" style={{textTransform: "capitalize"}}>Description:</span>
                            </label>
                            <input className={"form-control"} id={"_insert_property_desc"} placeholder={"Description"} value={ModalData.data.pro_desc} onChange={e => {setModalData({
                                ...ModalData,
                                data: {
                                    ...ModalData.data,
                                    pro_desc: e.target.value
                                }
                            })}}/>
                        </div>

                        <div className="margin-top-20 margin-bottom-20">
                            <label>
                                <span className="bold" style={{textTransform: "capitalize"}}>Select object type:</span>
                            </label>
                            <Select
                                options={ListObjType}
                                value={ModalSelectData1}
                                onChange={ChangeObjectTypeinModal}
                                isMulti
                            />
                        </div>

                        <div className="margin-top-20 margin-bottom-20">
                            <label>
                                <span className="bold" style={{textTransform: "capitalize"}}>Select rule:</span>
                            </label>
                            <Select
                                options={ListRule}
                                value={ModalSelectData}
                                onChange={ChangeProperty}
                            />
                        </div>

                        {
                            Array.isArray(ModalSelectData1) && ModalSelectData1.map((item, index) => {
                                return (
                                    <div className={"margin-top-20"} key={index}>
                                        <input id={"__cb_modal" + index} type={"checkbox"} checked={item.is_required} onChange={e => ChangeRequiredInModal(index)}/>
                                        <label htmlFor={"__cb_modal" + index} className={"margin-left-5"}>This property is required in {item.label}</label>
                                    </div>
                                );
                            })
                        }

                        <button className={"btn pull-right"} onClick={_ => setModalData({...ModalData, show: false})}>Cancel</button>
                        <button className={"btn theme_green pull-right margin-right-10"} onClick={InsertProperty}>Create</button>
                    </div>
                )}
            </Modal>

            <div className="box-style" style={{height: "calc(100% - 40px)", padding: '20px', display: 'flex', position: 'relative'}}>

                <div style={{width: '300px', height: 'calc(100% - 30px)', display: 'inline-block'}}>
                    <input className="form-control" disabled={true} onKeyDown={SearchByPropertyName} placeholder="Find by property's name ..."/>
                    <div className="list-container margin-top-10">
                        {PropertyData.length === 0 ? (
                            <div>
                                <span>No property founded!</span>
                            </div>
                        ) : PropertyData.map((item, index) => {
                            return (
                                <div
                                    key={index}
                                    className="list-item"
                                    onClick={_ => GetPropertyInfo(item)}>
                                    {item.pro_name}
                                </div>
                            )
                        })}
                    </div>
                </div>

                {Array.isArray(PropertyData) && PropertyData.length > 0 && (
                    <div style={{
                        width: 'calc(100% - 350px)',
                        height: 'calc(100% - 70px)',
                        marginLeft: '50px',
                        marginTop: '50px',
                        display: 'inline-block',
                        overflow: 'auto',
                        padding: '10px'}}>

                        <div className="margin-top-20">
                            <label htmlFor="name">
                                <span className="bold">Property's name:</span>
                            </label>
                            <input className="form-control" id="name" value={DetailData.pro_name} onChange={e => {
                                setDetailData({
                                    ...DetailData,
                                    pro_name: e.target.value
                                })
                            }}/>
                        </div>

                        <div className="margin-top-20">
                            <label htmlFor="desc">
                                <span className="bold">Property's description:</span>
                            </label>
                            <input className="form-control" id="desc" value={DetailData.pro_desc} onChange={e => {
                                setDetailData({
                                    ...DetailData,
                                    pro_desc: e.target.value
                                })
                            }}/>
                        </div>

                        <div className="margin-top-20">
                            <label htmlFor="type">
                                <span className="bold">Object type:</span>
                            </label>
                            <Select
                                id="type"
                                isMulti
                                value={DetailData.ListObjType}
                                options={ListObjType}
                                onChange={ChangeObjType}
                            />
                        </div>

                        <div className="margin-top-20">
                            <label htmlFor="rule">
                                <span className="bold">Rule:</span>
                            </label>
                            <Select
                                id="rule"
                                value={DetailData.rule}
                                options={ListRule}
                                onChange={ChangeRule}
                            />
                        </div>

                        {
                            DetailData.hasOwnProperty("ListObjType") && DetailData.ListObjType.map((item, index) => {
                                return (
                                    <div className={"margin-top-20"} key={index}>
                                        <input id={"__cb" + index} type={"checkbox"} checked={item.is_required} onChange={e => ChangeRequired(e, index)}/>
                                        <label htmlFor={"__cb" + index} className={"margin-left-5"}>'{DetailData.pro_name}' is required in {item.label}</label>
                                    </div>
                                );
                            })
                        }

                        <div className="margin-top-20">
                            <small className="italic">(Created: {DetailData.created_at}, Last update: {DetailData.updated_at})</small>
                        </div>

                        <div className="margin-top-20">
                            <button className="btn pull-right theme_red margin-left-10" onClick={DeleteProperty}>
                                <IconContext.Provider value={{size: 22, color: 'white', className: 'middle-btn'}}>
                                    <FaRegWindowClose/>
                                </IconContext.Provider>
                                &nbsp;Delete
                            </button>
                            <button className="btn pull-right theme_cyan" onClick={UpdateProperty}>
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
                        <button className="btn theme_green700 margin-10" onClick={CreateProperty}>
                            <IconContext.Provider value={{size: 22, className: 'middle-btn'}}>
                                <BiAddToQueue/>
                            </IconContext.Provider>
                            &nbsp;Create property</button>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Property;