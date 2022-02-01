import React, {useEffect, useState} from 'react';
import './../../GlobalStyle.sass';
import {DELETE_RULE, INSERT_RULE, LIST_RULES, UPDATE_RULE, WEB_BASE_NAME} from "../API_URL";
import {useDispatch, useSelector} from "react-redux";
import {ERROR, LOADED} from "../Redux/ReducersAndActions/Status/StatusActionsDefinition";
import {Link} from "react-router-dom";
import {FaRegWindowClose, RiFunctionLine, MdOutlineSave, BiAddToQueue} from "react-icons/all";
import {IconContext} from "react-icons";
import {toast, ToastContainer} from "react-toastify";
import Modal from "../Modal";


function Rules (props) {
    const {_title}                              = props;
    const dispatch                              = useDispatch();
    const [editItem, setEditItem]               = useState({show: false, data: {}, title:"No title", mode: -1});
    const {loading, error, _msg}                = useSelector(state => state.Status);
    const [detailData, setDetailData]           = useState({});
    const [showAppBox, setShowAppBox]           = useState(false);
    const [rulesData, setRulesData]             = useState([]);
    const [searchKeyWord, setSearchKeyWord]     = useState("");
    const [testRegex, setTestRegex]             = useState({notMatchRegex: false, value: ""});
    let OriginRulesData;

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
                    toast.error(result.msg);
                    dispatch({
                        type: ERROR,
                        msg: result.msg
                    });
                }
            })
            .catch(e => {
                toast.error(e);
                dispatch({
                    type: ERROR,
                    msg: e
                })
            });
    }

    const ToggleApplicationBox = (e) => {
        e.stopPropagation();
        setShowAppBox(!showAppBox);
    }

    const DeleteRule = (item) => {
        let BodyData = {
            rule_id: item.rule_id
        }
        if (window.confirm(`Delete ${item.rule_name} ?`)) {
            __FetchFunction(DELETE_RULE, BodyData, function (response) {
                toast.success(response);
                GetListRule();
            });
        }
    }

    const SaveRuleChange = () => {
        if (detailData.rule_name.trim() === "") {
            return;
        }
        let BodyData = {
            "rule_id": detailData.rule_id,
            "rule_name": detailData.rule_name,
            "rule_desc": detailData.rule_desc,
            "rule_regex": detailData.rule_regex
        }
        __FetchFunction(UPDATE_RULE, BodyData, function(response) {
            toast.success(response);
            GetListRule();
        });
    }

    const SearchByRuleName = e => {
        setSearchKeyWord(e.target.value);
        if (e.keyCode === 13) {
            if (searchKeyWord.trim() === "") {
                setRulesData(OriginRulesData);
                return;
            }
            let MatchingSearchData = [];
            rulesData.map((item, index) => {
                if (item.name.toLowerCase().includes(searchKeyWord.toLowerCase())) {
                    MatchingSearchData.push(item);
                }
            });
            setRulesData(MatchingSearchData);
        }
    }

    const GetRuleInfo = item => {
        setTestRegex({
            ...testRegex,
            notMatchRegex: false,
            value: ""
        });
        setDetailData(item);
    }

    const CheckRegex = e => {
        let regex = new RegExp(detailData.rule_regex);
        setTestRegex({
            ...testRegex,
            value: e.target.value,
            notMatchRegex: e.target.value === "" ? false : !regex.test(e.target.value)
        });
    }

    const GetListRule = () => {
        __FetchFunction(LIST_RULES, undefined, function (res) {
            setRulesData(res);
            if (res.length > 0) {
                GetRuleInfo(res[0]);
            } else {
                GetRuleInfo({
                    rule_name: "",
                    rule_desc: "",
                    rule_regex: ""
                });
            }
        });
    }

    const NewRule = () => {
        setEditItem({
            ...editItem,
            title: "Add new rule",
            show: true,
            data: {
                rule_name: "",
                rule_desc: "",
                rule_regex: ""
            }
        });
    }

    const CreateNewRule = () => {
        if (editItem.data.rule_name.trim() == "") {
            toast.error("Fill rule's name!");
            return;
        }

        let BodyData = {
            rule_name: editItem.data.rule_name,
            rule_desc: editItem.data.rule_desc,
            rule_regex: editItem.data.rule_regex
        }
        __FetchFunction(INSERT_RULE, BodyData, function(response) {
            toast.success(response);
            setEditItem({...editItem, show: false});
            GetListRule();
        })
    }

    const DismissModal = (e) => {
        setEditItem({...editItem, show: false});
    }

    useEffect(function() {
        document.title = _title + WEB_BASE_NAME;
        GetListRule();
    }, []);

    return(
        <div className="container" onClick={() => setShowAppBox(false)}>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={true}
                closeOnClick={true}
                rtl={false}
                pauseOnFocusLoss={false}
                theme="dark"
                draggable={false}
                pauseOnHover/>

            <Modal
                onClickOut={DismissModal}
                CloseModal={DismissModal}
                WrapClass={"modal_wrap"}
                show={editItem.show}
                ModalWidth={"60%"}
                title={editItem.title}>
                    <div>
                        <label htmlFor="name">
                            <span className="bold">Rule's name:</span>
                        </label>
                        <input className="form-control" id="name" value={editItem.data.rule_name} onChange={e => {
                            setEditItem({
                                ...editItem,
                                data: {
                                    ...editItem.data,
                                    rule_name: e.target.value
                                }
                            })
                        }}/>
                    </div>

                <div className="margin-top-20">
                    <label htmlFor="new_desc">
                        <span className="bold">Rule's description:</span>
                    </label>
                    <input className="form-control" id="new_desc" value={editItem.data.rule_desc} onChange={e => {
                        setEditItem({
                            ...editItem,
                            data: {
                                ...editItem.data,
                                rule_desc: e.target.value
                            }
                        })
                    }}/>
                </div>

                <div className="margin-top-20">
                    <label htmlFor="name">
                        <span className="bold">Rule's regex:</span>
                    </label>
                    <input className="form-control" id="name" value={editItem.data.rule_regex} onChange={e => {
                        setEditItem({
                            ...editItem,
                            data: {
                                ...editItem.data,
                                rule_regex: e.target.value
                            }
                        })
                    }}/>
                </div>
                <div className="margin-top-20 text-center">
                    <button className="btn theme_green" onClick={CreateNewRule}>Create new rule</button>
                </div>
            </Modal>

            <div className="box-style" style={{height: "calc(100% - 40px)", padding: '20px', display: 'flex', position: 'relative'}}>
                <div style={{width: '300px', height: 'calc(100% - 30px)', display: 'inline-block'}}>
                    <input className="form-control" disabled={true} onKeyDown={SearchByRuleName} placeholder="Find by rule's name ..."/>
                    <div className="list-container margin-top-10">
                        {rulesData.length === 0 ? (
                            <div>
                                <span>No rule founded!</span>
                            </div>
                        ) : rulesData.map((item, index) => {
                            return (
                                <div
                                    key={item.id}
                                    className="list-item"
                                    onClick={_ => GetRuleInfo(item)}>
                                    {item.rule_name}
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
                            <span className="bold">Rule's name:</span>
                        </label>
                        <input className="form-control" id="name" value={detailData.rule_name} onChange={e => {
                            setDetailData({
                                ...detailData,
                                rule_name: e.target.value
                            })
                        }}/>
                    </div>

                    <div className="margin-top-20">
                        <label htmlFor="desc">
                            <span className="bold">Rule's description:</span>
                        </label>
                        <input className="form-control" id="desc" value={detailData.rule_desc} onChange={e => {
                            setDetailData({
                                ...detailData,
                                rule_desc: e.target.value
                            })
                        }}/>
                    </div>

                    <div className="margin-top-20">
                        <label htmlFor="reg">
                            <span className="bold">Rule's regex: </span>
                            (Regex instruction <Link target="_blank" to={{pathname: "https://docs.microsoft.com/en-us/dotnet/standard/base-types/regular-expression-language-quick-reference"}}>here</Link>)
                        </label>
                        <input className="form-control" id="reg" value={detailData.rule_regex} onChange={e => {
                            setDetailData({
                                ...detailData,
                                rule_regex: e.target.value
                            })
                        }}/>
                    </div>

                    <div className="margin-top-20">
                        <label htmlFor="test_regex">
                            <span className="bold">Test regex: </span>
                        </label>
                        <input className="form-control" id="test_regex" placeholder="Type something" value={testRegex.value} onChange={CheckRegex}/>
                        {testRegex.notMatchRegex && <small className="error">Not match regex</small>}
                    </div>

                    <div className="margin-top-20">
                        <small className="italic">(Created: {detailData.created_at}, Last update: {detailData.updated_at})</small>
                    </div>

                    <div className="margin-top-20">
                        <button className="btn pull-right theme_red margin-left-10" onClick={() => DeleteRule(detailData)}>
                            <IconContext.Provider value={{size: 22, color: 'white', className: 'middle-btn'}}>
                                <FaRegWindowClose/>
                            </IconContext.Provider>
                            &nbsp;Delete rule
                        </button>
                        <button className="btn pull-right theme_cyan" onClick={SaveRuleChange}>
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

                    <div className={showAppBox ? "application-box flex" : "application-box"}>
                        <button className="btn theme_green700 margin-10" onClick={NewRule}>
                            <IconContext.Provider value={{size: 22, className: 'middle-btn'}}>
                                <BiAddToQueue/>
                            </IconContext.Provider>
                            &nbsp;New Rule</button>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Rules;