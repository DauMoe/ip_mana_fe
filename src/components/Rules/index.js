import React, {useEffect, useState} from 'react';
import './../../GlobalStyle.sass';
import {
    DELETE_RULE,
    INSERT_RULE,
    LIST_OBJ_TYPE,
    LIST_RULES,
    RULE_INFO,
    SEARCH_OBJECT,
    SEARCH_RULE, UPDATE_RULE,
    WEB_BASE_NAME
} from "../API_URL";
import {useDispatch, useSelector} from "react-redux";
import {ERROR, LOADED, LOADING} from "../Redux/ReducersAndActions/Status/StatusActionsDefinition";
import {Link} from "react-router-dom";
import {FaRegWindowClose, RiFunctionLine, MdOutlineSave, BiAddToQueue} from "react-icons/all";
import {IconContext} from "react-icons";
import swal from "sweetalert";
import {toast, ToastContainer} from "react-toastify";
import Modal from "../Modal";


function Rules (props) {
    const ADD_RULE_MODE                         = 1;
    const {_title}                              = props;
    const dispatch                              = useDispatch();
    const [DetailData, setDetailData]           = useState({});
    const [showAppBox, setShowAppBox]           = useState(false);
    const [rulesData, setRulesData]             = useState([]);
    const [SearchBoxValue, setSearchBoxValue]   = useState("");
    const [ModalData, setModalData]             = useState({mode: -1, data: {}, show: false, title: "no title"});
    const { loading, error, _msg }              = useSelector(state => state.Status);
    const [testRegex, setTestRegex]             = useState({notMatchRegex: false, value: ""});

    const __FetchFunction = (URL, body, callback, dismiss = true) => {
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        let requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(body),
            redirect: 'follow'
        };
        dispatch({type: LOADING});
        fetch(URL, requestOptions)
            .then(res => res.json())
            .then(result => {
                if (result.code === 200) {
                    if (dismiss) dispatch({type: LOADED})
                    callback(result.msg, null);
                } else {
                    if (dismiss) {
                        dispatch({
                            type: ERROR,
                            msg: result.msg[0]
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
                    })
                }
                toast.error(e);
            });
    }

    const ToggleApplicationBox = (e) => {
        e.stopPropagation();
        setShowAppBox(!showAppBox);
    }

    const SearchByRuleName = (e) => {
        if (e.keyCode === 13 && loading === false) {
            let BodyData = {
                "rule_name": SearchBoxValue
            }
            __FetchFunction(SEARCH_RULE, BodyData, function(response) {
                setRulesData(response);
                if (response.length > 0) {
                    GetRuleInfo(response[0]);
                }
            });
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
        let regex = new RegExp(DetailData.rule_regex, 'g');
        setTestRegex({
            ...testRegex,
            value: e.target.value,
            notMatchRegex: e.target.value === "" ? false : !regex.test(e.target.value)
        });
    }
    
    const DeleteRule = () => {
      swal({
          title: "Delete",
          text: `Rule data will be removed and CAN NOT recover. Continue?`,
          icon: "warning",
          buttons: true,
          dangerMode: true})
          .then(isConfirm => {
              if (isConfirm) {
                  let BodyData = {
                      "rule_id": DetailData.rule_id
                  };
                  __FetchFunction(DELETE_RULE, BodyData, function(response) {
                      GetListRule();
                      toast.success(response);
                  }, false);
              }
          })
    }

    const GetListRule = () => {
      __FetchFunction(LIST_RULES, undefined, function (response) {
          GetRuleInfo(response[0]);
          setRulesData(response);
      });
    }

    const HandleClickOut = (e) => {
        setModalData({
            ...ModalData,
            show: false
        })
    }

    const CreateNewRule = () => {
      setModalData({
          mode: ADD_RULE_MODE,
          data: {
              rule_name: "",
              rule_desc: "",
              rule_regex: ""
          },
          show: true,
          title: "Create new rule"
      })
    }

    const InsertRule = () => {
      if (ModalData.data.rule_name.trim() === "") {
          toast.error("Rule needs a name");
          return;
      }
      let BodyData = {
          "rule_name": ModalData.data.rule_name,
          "rule_desc": ModalData.data.rule_desc,
          "rule_regex": ModalData.data.rule_regex
      }
      __FetchFunction(INSERT_RULE, BodyData, function(response) {
          setModalData({
              ...ModalData,
              show: false
          });
          GetListRule();
          toast.success(response);
      }, false);
    }

    const SaveRuleChange = () => {
      if (DetailData.rule_name.trim() === "") {
          toast.error("Rule needs a name");
          return;
      }
        let BodyData = {
            "rule_name": DetailData.rule_name,
            "rule_desc": DetailData.rule_desc,
            "rule_regex": DetailData.rule_regex
        }
        __FetchFunction(UPDATE_RULE, BodyData, function(response) {
            setModalData({
                ...ModalData,
                show: false
            });
            GetListRule();
            toast.success(response);
        }, false);
    }

    useEffect(function() {
        dispatch({type: LOADING});
        document.title = _title + WEB_BASE_NAME;
        let ListAPI = [{
           url: LIST_RULES,
           requestOptions: {
               method: 'POST',
               redirect: 'follow'
           }
        }];

        Promise.all(ListAPI.map(item => fetch(item.url, item.requestOptions)))
            .then(responses => Promise.all(responses.map(resp => resp.json())))
            .then(results => {
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
                        if (results[0].msg.length > 0) {
                            GetRuleInfo(results[0].msg[0]);
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
        return () => {
            setRulesData([]);
        }
    }, []);

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
                    ModalData.mode === ADD_RULE_MODE && (
                        <div style={{
                            minWidth: '60vw',
                        }}>
                            <div className="margin-top-20">
                                <label htmlFor={"_insert_rule_name"}>
                                    <span className="bold" style={{textTransform: "capitalize"}}>Rule's name:</span>
                                </label>
                                <input className={"form-control"} id={"_insert_rule_name"} placeholder={"Rule's name"} value={ModalData.data.rule_name} onChange={e => {setModalData({
                                    ...ModalData,
                                    data: {
                                        ...ModalData.data,
                                        rule_name: e.target.value
                                    }
                                })}}/>
                            </div>

                            <div className="margin-top-20">
                                <label htmlFor={"_insert_rule_desc"}>
                                    <span className="bold" style={{textTransform: "capitalize"}}>Rule's desc:</span>
                                </label>
                                <input className={"form-control"} id={"_insert_rule_desc"} placeholder={"Rule's name"} value={ModalData.data.rule_desc} onChange={e => {setModalData({
                                    ...ModalData,
                                    data: {
                                        ...ModalData.data,
                                        rule_desc: e.target.value
                                    }
                                })}}/>
                            </div>

                            <div className="margin-top-20">
                                <label htmlFor={"_insert_rule_regex"}>
                                    <span className="bold" style={{textTransform: "capitalize"}}>Rule's regex:</span>
                                </label>
                                <input className={"form-control"} id={"_insert_rule_regex"} placeholder={"Rule's name"} value={ModalData.data.rule_regex} onChange={e => {setModalData({
                                    ...ModalData,
                                    data: {
                                        ...ModalData.data,
                                        rule_regex: e.target.value
                                    }
                                })}}/>
                            </div>
                            <div className={"margin-top-25"}>
                                <button className={"btn pull-right"} onClick={_ => setModalData({...ModalData, show: false})}>Cancel</button>
                                <button className={"btn pull-right margin-right-10 theme_green"} onClick={InsertRule}>Create</button>
                            </div>
                        </div>
                    )
                }
            </Modal>

            <div className="box-style" style={{height: "calc(100% - 40px)", padding: '20px', display: 'flex', position: 'relative'}}>

                <div style={{width: '300px', height: 'calc(100% - 30px)', display: 'inline-block'}}>
                    <input className="form-control" onChange={e => setSearchBoxValue(e.target.value)} onKeyDown={SearchByRuleName} placeholder="Find by rule's name ..."/>
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

                {Array.isArray(rulesData) && rulesData.length > 0 && (<div style={{
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
                        <input className="form-control" id="name" value={DetailData.rule_name} onChange={e => {
                            setDetailData({
                                ...DetailData,
                                rule_name: e.target.value
                            })
                        }}/>
                    </div>

                    <div className="margin-top-20">
                        <label htmlFor="desc">
                            <span className="bold">Rule's description:</span>
                        </label>
                        <input className="form-control" id="desc" value={DetailData.rule_desc} onChange={e => {
                            setDetailData({
                                ...DetailData,
                                rule_desc: e.target.value
                            })
                        }}/>
                    </div>

                    <div className="margin-top-20">
                        <label htmlFor="reg">
                            <span className="bold">Rule's regex: </span>
                            (Regex instruction <Link target="_blank" to={{pathname: "https://docs.microsoft.com/en-us/dotnet/standard/base-types/regular-expression-language-quick-reference"}}>here</Link>)
                        </label>
                        <input className="form-control" id="reg" value={DetailData.rule_regex} onChange={e => {
                            setDetailData({
                                ...DetailData,
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
                        <small className="italic">(Created: {DetailData.created_at}, Last update: {DetailData.updated_at})</small>
                    </div>

                    <div className="margin-top-20">
                        <button className="btn pull-right theme_red margin-left-10" onClick={DeleteRule}>
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
                </div>)}

                <div onClick={e => e.stopPropagation()}>
                    <span className="fab-button" onClick={ToggleApplicationBox}>
                        <IconContext.Provider value={{size: 25, color: 'white'}}>
                            <RiFunctionLine/>
                        </IconContext.Provider>
                    </span>

                    <div className={showAppBox ? "application-box flex" : "application-box"}>
                        <button className="btn theme_green700 margin-10" onClick={CreateNewRule}>
                            <IconContext.Provider value={{size: 22, className: 'middle-btn'}}>
                                <BiAddToQueue/>
                            </IconContext.Provider>
                            &nbsp;Create Rule</button>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Rules;