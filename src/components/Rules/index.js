import React, {useEffect, useState} from 'react';
import './../../GlobalStyle.sass';
import {LIST_RULES, RULE_INFO, WEB_BASE_NAME} from "../API_URL";
import {useDispatch, useSelector} from "react-redux";
import {ERROR, LOADED} from "../Redux/ReducersAndActions/Status/StatusActionsDefinition";
import {Link} from "react-router-dom";


function Rules (props) {
    const {_title}                              = props;
    const dispatch                              = useDispatch();
    const {loading, error, _msg}                = useSelector(state => state.Status);
    const [detailData, setDetailData]           = useState({});
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
        })
        __FetchFunction(RULE_INFO, {id: item.id}, function(res) {
            setDetailData(res[0]);
        });
    }

    const CheckRegex = e => {
        let regex = new RegExp(detailData.regex);
        setTestRegex({
            ...testRegex,
            value: e.target.value,
            notMatchRegex: e.target.value === "" ? false : !regex.test(e.target.value)
        });
    }

    useEffect(function() {
        document.title = _title + WEB_BASE_NAME;
        __FetchFunction(LIST_RULES, undefined, function (res) {
            setRulesData(res);
            OriginRulesData = JSON.parse(JSON.stringify(res));
            GetRuleInfo({id: res[0].id});
        });
    }, []);

    return(
        <div className="container">
            <div className="box-style" style={{height: "calc(100% - 40px)", padding: '20px', display: 'flex'}}>

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
                                    {item.name}
                                </div>
                            )
                        })}
                    </div>
                </div>

                <div style={{
                    width: 'calc(100% - 350px)',
                    height: 'calc(100% - 30px)',
                    marginLeft: '50px',
                    display: 'inline-block',
                    overflow: 'auto',
                    padding: '10px'}}>

                    <div>
                        <label htmlFor="name">
                            <span className="bold">Rule's name:</span>
                        </label>
                        <input className="form-control" id="name" value={detailData.name} onChange={e => {
                            setDetailData({
                                ...detailData,
                                name: e.target.value
                            })
                        }}/>
                    </div>

                    <div className="margin-top-20">
                        <label htmlFor="desc">
                            <span className="bold">Rule's description:</span>
                        </label>
                        <input className="form-control" id="desc" value={detailData.desc} onChange={e => {
                            setDetailData({
                                ...detailData,
                                desc: e.target.value
                            })
                        }}/>
                    </div>

                    <div className="margin-top-20">
                        <label htmlFor="reg">
                            <span className="bold">Rule's regex: </span>
                            (Regex instruction <Link target="_blank" to={{pathname: "https://docs.microsoft.com/en-us/dotnet/standard/base-types/regular-expression-language-quick-reference"}}>here</Link>)
                        </label>
                        <input className="form-control" id="reg" value={detailData.regex} onChange={e => {
                            setDetailData({
                                ...detailData,
                                regex: e.target.value
                            })
                        }}/>
                    </div>

                    <div className="margin-top-20">
                        <label htmlFor="test_regex">
                            <span className="bold">Test regex: </span>
                        </label>
                        <input className="form-control" id="test_regex" placeholder="Type something" value={testRegex.value} onChange={CheckRegex}/>
                        {testRegex.notMatchRegex && <small>Not match regex</small>}
                    </div>

                    <div className="margin-top-20">
                        <small className="italic">(Created: {detailData.createdAt}, Last update: {detailData.updatedAt})</small>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Rules;