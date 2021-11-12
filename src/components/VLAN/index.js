import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {ERROR, LOADED} from "../Redux/ReducersAndActions/Status/StatusActionsDefinition";
import Loading from "../Loading";
import {ToastContainer} from "react-toastify";
import {IconContext} from "react-icons/lib";
import {RiDeleteBin2Fill, RiEditFill} from "react-icons/all";
import {ConvertTimeStamptoString, ReplaceCharacters} from "../Utils";

function VLAN (props) {
    const [VLANData, setVLANData]           = useState([]);
    const [offset, setOffset]               = useState(0);
    const { _title }                        = props;
    const dispatch                          = useDispatch();
    const { loading, error, _msg }          = useSelector(state => state.Status);
    const LIMIT                             = 10;

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
                    callback(result);
                } else {
                    dispatch({
                        type: ERROR,
                        msg: result.msg
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

    useEffect(() => {

        __FetchFunction();
    }, [offset]);

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

            {loading && <Loading/>}

            {!loading && !error && (
                <>
                    <table className="nice_theme margin-top-20">
                        <thead className="text-center">
                        <td>Index</td>
                        <td>VLAN IPs</td>
                        <td>Created at</td>
                        <td>Last update</td>
                        <td>Edit / Del / Detail</td>
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
                                                <span className="margin-right-20" onClick={() => EditIP(item, index)}>
                                                    <IconContext.Provider value={{size: 20, color: "#1886b5"}}>
                                                        <RiEditFill/>
                                                    </IconContext.Provider>
                                                </span>
                                            <span onClick={() => delIPs(item, index)}>
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
                </>
            )}
        </div>
    );
}

export default VLAN;