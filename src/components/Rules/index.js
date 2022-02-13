import React, {useEffect, useState} from 'react';
import './../../GlobalStyle.sass';
import {LIST_OBJ_TYPE, LIST_RULES, RULE_INFO, WEB_BASE_NAME} from "../API_URL";
import {useDispatch, useSelector} from "react-redux";
import {ERROR, LOADED} from "../Redux/ReducersAndActions/Status/StatusActionsDefinition";
import {Link} from "react-router-dom";
import {FaRegWindowClose, RiFunctionLine, MdOutlineSave, BiAddToQueue} from "react-icons/all";
import {IconContext} from "react-icons";
import Select from "react-select";
import {ToastContainer} from "react-toastify";


function Rules (props) {
    const {_title}                              = props;
    const dispatch                              = useDispatch();
    const [detailData, setDetailData]           = useState({});
    const [showAppBox, setShowAppBox]           = useState(false);
    const [rulesData, setRulesData]             = useState([]);
    const [searchKeyWord, setSearchKeyWord]     = useState("");
    const [testRegex, setTestRegex]             = useState({notMatchRegex: false, value: ""});
    let OriginRulesData = [];

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

    const ToggleApplicationBox = (e) => {
        e.stopPropagation();
        setShowAppBox(!showAppBox);
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
        // for (let i of )
        setDetailData(item);
    }

    const CheckRegex = e => {
        let regex = new RegExp(detailData.regex, 'g');
        setTestRegex({
            ...testRegex,
            value: e.target.value,
            notMatchRegex: e.target.value === "" ? false : !regex.test(e.target.value)
        });
    }

    const AddObjectType = item => {

    }

    useEffect(function() {
        document.title = _title + WEB_BASE_NAME;
        let ListAPI = [{
           url: LIST_RULES,
           requestOptions: {
               method: 'POST',
               redirect: 'follow'
           }
        }
        // , {
        //     url: LIST_OBJ_TYPE,
        //     requestOptions: {
        //         method: 'POST',
        //         redirect: 'follow'
        //     }
        // }
        ];

        Promise.all(ListAPI.map(item => fetch(item.url, item.requestOptions)))
            .then(responses => Promise.all(responses.map(resp => resp.json())))
            .then(results => {
                console.log(results);
                let HasErr = false;
                for (let i of results) {
                    if (i.code !== 200) {
                        dispatch({
                            type: ERROR,
                            msg: i.msg
                        });
                        HasErr = true;
                    }
                    if (!HasErr) {
                        dispatch({type: LOADED});
                        setRulesData(results[0].msg);
                        // let TempArr = [];
                        // for (let i of results[1].msg) {
                        //     TempArr.push({
                        //         value: i.obj_type_id,
                        //         label: i.obj_type_name
                        //     });
                        // }
                        // setListObjectType(TempArr);
                        if (results[0].msg.length > 0) {
                            GetRuleInfo({id: results[0].id});
                        }
                    }
                }
            })
            .catch(e => {
                dispatch({
                    type: ERROR,
                    msg: e
                })
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
                    <input className="form-control" disabled={true} onKeyDown={SearchByRuleName} placeholder="Find by rule's name ..."/>
                    <div className="list-container margin-top-10">
                        {rulesData.length === 0 ? (
                            <div>
                                <span>No rule founded!</span>
                            </div>
                        ) : rulesData.map((item, index) => {
                            return (
                                <div
                                    key={index}
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

                <div onClick={e => e.stopPropagation()}>
                    <span className="fab-button" onClick={ToggleApplicationBox}>
                        <IconContext.Provider value={{size: 25, color: 'white'}}>
                            <RiFunctionLine/>
                        </IconContext.Provider>
                    </span>

                    <div className={showAppBox ? "application-box flex" : "application-box"}>
                        <button className="btn theme_green700 margin-10">
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