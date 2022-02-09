import React, {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {ERROR, LOADED} from "../Redux/ReducersAndActions/Status/StatusActionsDefinition";
import {GET_PRO_BY_OBJ_ID, LIST_OBJECT, LIST_RULES, WEB_BASE_NAME} from "../API_URL";
import {IconContext} from "react-icons";
import {BiAddToQueue, FaRegWindowClose, MdOutlineSave, RiFunctionLine} from "react-icons/all";

function ObjectA(props) {
    const {_title, _obj_type_id} = props;
    const dispatch = useDispatch();
    const [DetailData, setDetailData] = useState([]);
    const [ObjectData, setObjectData] = useState([]);
    const [ShowAppBox, setShowAppBox] = useState(false);

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

    const ToggleApplicationBox = () => {

    }

    const SearchByObjectName = () => {

    }

    const GetObjectInfo = (item) => {
        let BodyData = {
            "obj_id": item.obj_id
        };
        __FetchFunction(GET_PRO_BY_OBJ_ID, BodyData, function (response) {
            setDetailData(response);
        });
    }

    const ChangeProValue = (e, index) => {
        let CopyDetailData = [...DetailData];
        let reg = new RegExp(CopyDetailData[index].rule_regex, "g");
        CopyDetailData[index].pro_value = e.target.value;
        CopyDetailData[index].match_regex = reg.test(e.target.value);
        setDetailData(CopyDetailData);
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
        });
    }, []);

    return(
        <div className="container" onClick={() => setShowAppBox(false)}>
            <div className="box-style" style={{height: "calc(100% - 40px)", padding: '20px', display: 'flex', position: 'relative'}}>

                <div style={{width: '300px', height: 'calc(100% - 30px)', display: 'inline-block'}}>
                    <input className="form-control" disabled={true} onKeyDown={SearchByObjectName} placeholder="Find by object name ..."/>
                    <div className="list-container margin-top-10">
                        {ObjectData.length === 0 ? (
                            <div>
                                <span>No object!</span>
                            </div>
                        ) : ObjectData.map((item, index) => {
                            return (
                                <div
                                    key={index}
                                    className="list-item"
                                    onClick={_ => GetObjectInfo(item)}>
                                    {item.obj_name}
                                </div>
                            )
                        })}
                    </div>
                </div>

                {ObjectData.length > 0 &&
                    (
                        <div style={{
                            width: 'calc(100% - 350px)',
                            height: 'calc(100% - 70px)',
                            marginLeft: '50px',
                            marginTop: '50px',
                            display: 'inline-block',
                            overflow: 'auto',
                            padding: '10px'}}>

                            {
                                DetailData.map(function(item, index) {
                                    return (
                                        <div className="margin-top-20" key={index}>
                                            <label htmlFor={"_pro_item_" + index}>
                                                <span className="bold">{item.pro_name}:</span>
                                            </label>
                                            <input className={(item.match_regex === false) ? "form-control form-control-err" : "form-control"} placeholder={"Fill value"} id={"_pro_item_" + index} value={item.pro_value} onChange={e => ChangeProValue(e, index)}/>
                                            <small className="italic">(Created: {item.created_at}, Last update: {item.updated_at})</small><br/>
                                            {item.match_regex === false && (<small style={{color: "red"}}>Not match rule of property!</small>)}
                                        </div>
                                    );
                                })
                            }

                            <div className="margin-top-20">
                                <button className="btn pull-right theme_red margin-left-10">
                                    <IconContext.Provider value={{size: 22, color: 'white', className: 'middle-btn'}}>
                                        <FaRegWindowClose/>
                                    </IconContext.Provider>
                                    &nbsp;Delete rule
                                </button>
                                <button className="btn pull-right theme_cyan">
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
                                &nbsp;New ObjectA</button>
                        </div>
                    </div>
            </div>
        </div>
    );
}

export default ObjectA;