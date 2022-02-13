import {ERROR, LOADED} from "../Redux/ReducersAndActions/Status/StatusActionsDefinition";
import {useDispatch} from "react-redux";
import {Link} from "react-router-dom";
import {IconContext} from "react-icons";
import {BiAddToQueue, FaRegWindowClose, MdOutlineSave, RiFunctionLine} from "react-icons/all";
import React, {useEffect, useState} from "react";
import {
    DELETE_PROPERTY,
    Get_PRO_INFO,
    LIST_OBJ_TYPE,
    LIST_PROPERTY,
    LIST_RULES,
    UPDATE_PROPERTY,
    WEB_BASE_NAME
} from "../API_URL";
import Select from "react-select";
import {toast, ToastContainer} from "react-toastify";

function Property(props) {
    const {_title} = props;
    const dispatch = useDispatch();
    const [ShowAppBox, setShowAppBox]           = useState(false);
    const [PropertyData, setPropertyData]       = useState([]);
    const [ListObjType, setListObjType]         = useState([]);
    const [ListRule, setListRule]               = useState([]);
    const [DetailData, setDetailData]           = useState({});

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

    const SearchByPropertyName = (e) => {

    }

    const UpdateProperty = () => {
        let BodyData = {
            "pro_id": DetailData.pro_id,
            "pro_name": DetailData.pro_name,
            "pro_desc": DetailData.pro_desc,
            "rule_id": DetailData.rule.value,
            "list_obj_type": []
        };
        for (let i of DetailData.ListObjType) {
            BodyData.list_obj_type.push({
                "obj_type_id": i.value
            });
        }
        __FetchFunction(UPDATE_PROPERTY, BodyData, function(response) {
            toast.success(response);
        });
    }

    const DeleteProperty = () => {
        let BodyData = {
            "pro_id": DetailData.pro_id
        };
        __FetchFunction(DELETE_PROPERTY, BodyData, function(response) {
            __FetchFunction(LIST_PROPERTY, undefined, function(resp) {
                setPropertyData(resp);
                GetPropertyInfo(resp[0]);
            });
            toast.success(response);
        });
    }

    const GetPropertyInfo = (item) => {
        let BodyData = {
            "pro_id": item.pro_id
        };
        __FetchFunction(Get_PRO_INFO, BodyData, function (response) {
            console.log(response);
            let TempItem = {...item};
            TempItem.ListObjType = [];
            for (let i of response) {
                TempItem.ListObjType.push({
                    value: i.obj_type_id,
                    label: i.obj_type_name
                });
            }
            for (let i of ListRule) {
                if (i.value === TempItem.rule_id) {
                    TempItem.rule = i;
                    break;
                }
            }
            console.log(TempItem);
            setDetailData(TempItem);
        });
    }

    const ChangeObjType = (item) => {
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

    useEffect(function() {
        document.title = _title + WEB_BASE_NAME;
        let ListAPI = [{
            url: LIST_PROPERTY,
            requestOptions: {
                method: 'POST',
                redirect: 'follow'
            }
        }, {
            url: LIST_OBJ_TYPE,
            requestOptions: {
                method: 'POST',
                redirect: 'follow'
            }
        }, {
            url: LIST_RULES,
            requestOptions: {
                method: 'POST',
                redirect: 'follow'
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
                    setPropertyData(resp[0].msg);
                    let TempArr = [];
                    for (let i of resp[1].msg) {
                        TempArr.push({
                           value: i.obj_type_id,
                           label: i.obj_type_name
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
    }, []);

    return(
        <div className="container" onClick={() => setShowAppBox(false)}>
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
                            &nbsp;Create property</button>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Property;