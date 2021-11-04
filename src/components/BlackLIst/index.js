import React, { useEffect, useState } from "react";
import swal from "sweetalert";
import {BsPlusLg} from "react-icons/bs";
import {RiEditFill} from "react-icons/ri";
import {RiDeleteBin2Fill} from "react-icons/ri";
import "./BlackList.sass"
import { BLACKLIST_GET_IP } from '../API_URL';
import { IconContext } from "react-icons/lib";
import Modal from "../Modal";
import {useDispatch, useSelector} from "react-redux";
import {ERROR, LOADED, LOADING} from "../Redux/ReducersAndActions/Status/StatusActionsDefinition";

//Doc: https://sweetalert.js.org/guides/

const _MONTH = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Sep"];

const ReplaceCharacters = (msg) => {
    if (typeof(msg) !== 'string') return msg;
    return msg.replace(/"/g, '');
}

const ConvertTimeStamptoString = (timestamp, getDate = true, getTime = true) => {
    let msg = "";
    if (timestamp.length === 0) return "";
    let _d = new Date(timestamp);
    
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
    return msg;
}

function BlackList (props) {
    const [BlackListData, setBlackListData] = useState([]);
    const [TotalPage, setTotalPage]         = useState(0);
    const [offset, setOffSet]               = useState(0);
    const { loading, error, _msg }          = useSelector(state => state.Status);
    const dispatch                          = useDispatch();
    const LIMIT                             = 10;

    const _FetchAllData = (offset, limit) => {
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
                        msg: result.msg
                    })
                    alert(result.msg);
                }
            })
            .catch(e => {
                dispatch({
                    type: ERROR,
                    msg: e
                })
            });
    }

    const delIPs = (item) => {
        swal({
            title: "DELETE",
            text: `Do you want delete IP: ${item.ip}?`,
            icon: "warning",
            buttons: true,
            dangerMode: true
        }).then(val => {
            if (val) {
                //Delete IP here
            }
        })
    }

    const EditIP = (item) => {

    }

    const _content = () => {
        return (
            <div>Hi, Iam content</div>
        );
    }

    useEffect(() => {
        _FetchAllData(offset, LIMIT);
    }, [offset]);
    
    return(
        <div className="container">
            <Modal show={false} title={"Hello"} content={() => _content()}/>

            {loading && (
                <div className="center-div">
                    <span className="loader"></span>
                </div>
            )}

            {error && (
                <div className="center-div">
                    <p>{_msg}</p>
                </div>
            )}

            {!loading && !error && (
                <>
                    <div className="add_bl">
                        <button className="btn theme_green pull-right"><BsPlusLg/>&nbsp;&nbsp; Add blacklist IP</button>
                    </div>
                    {BlackListData.length === 0 && (
                        <div className="center-div">
                            <p>No blacklist IP!</p>
                        </div>
                    )}

                    {BlackListData.length !== 0 && (
                        <>
                            <table className="nice_theme padding-top-20">
                                <thead className="text-center">
                                <td>STT</td>
                                <td>Blacklist IPs</td>
                                <td>Description</td>
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
                                                <td>{ConvertTimeStamptoString(Number.parseInt(ReplaceCharacters(item.create_time)))}</td>
                                                <td>{ConvertTimeStamptoString(ReplaceCharacters(item.createdAt))}</td>
                                                <td>{ConvertTimeStamptoString(ReplaceCharacters(item.updatedAt))}</td>
                                                <td className="table_icon text-center">
                                                <span className="margin-right-20" onClick={() => EditIP(item)}>
                                                    <IconContext.Provider value={{size: 20, color: "#1886b5"}}>
                                                        <RiEditFill/>
                                                    </IconContext.Provider>
                                                </span>
                                                    <span onClick={() => delIPs(item)}>
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
                </>
            )}
        </div>
    );
}

export default BlackList;