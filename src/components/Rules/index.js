import React, {useEffect, useState} from 'react';
import './../../GlobalStyle.sass';
import './../../Animation.sass';
import {LIST_RULES, RULE_INFO, WEB_BASE_NAME} from "../API_URL";
import {useDispatch, useSelector} from "react-redux";
import {ERROR, LOADED} from "../Redux/ReducersAndActions/Status/StatusActionsDefinition";


function Rules (props) {
    const {_title} = props;
    const dispatch = useDispatch();
    const {loading, error, _msg} = useSelector(state => state.Status);
    const [detailData, setDetailData] = useState({});
    const [rulesData, setRulesData] = useState([]);
    const [searchKeyWord, setSearchKeyWord] = useState("");
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
        __FetchFunction(RULE_INFO, {id: item.id}, function(res) {
            setDetailData(res[0]);
        });
    }

    useEffect(function() {
        document.title = _title + WEB_BASE_NAME;
        __FetchFunction(LIST_RULES, undefined, function (res) {
            setRulesData(res);
            OriginRulesData = JSON.parse(JSON.stringify(res));
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
                                <div className="list-item" key={item.id} onClick={_ => GetRuleInfo(item)}>
                                    {item.name}
                                </div>
                            )
                        })}
                    </div>
                </div>

                <div style={{width: 'calc(100% - 350px)', height: 'calc(100% - 30px)', marginLeft: '50px', display: 'inline-block', overflow: 'auto'}}>
                    <p>{JSON.stringify(detailData)}</p>
                </div>

                {/*<div className="col-3 padding-15" style={{*/}
                {/*    height: 'calc(100% - 30px)'*/}
                {/*}}>*/}
                {/*    <input className="form-control" disabled={true} onKeyDown={SearchByRuleName} placeholder="Find by rule's name ..."/>*/}
                {/*    <div className="list-container margin-top-10">*/}
                {/*        {rulesData.length === 0 ? (*/}
                {/*            <div>*/}
                {/*                <span>No rule founded!</span>*/}
                {/*            </div>*/}
                {/*        ) : rulesData.map((item, index) => {*/}
                {/*            return (*/}
                {/*                <div className="list-item" key={item.id} onClick={_ => GetRuleInfo(item)}>*/}
                {/*                    {item.name}*/}
                {/*                </div>*/}
                {/*            )*/}
                {/*        })}*/}
                {/*    </div>*/}
                {/*</div>*/}

            </div>
        </div>
    );
}

export default Rules;