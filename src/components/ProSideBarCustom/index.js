import {Menu, MenuItem, ProSidebar, SidebarContent, SidebarFooter, SidebarHeader} from "react-pro-sidebar";
import * as Icons from "react-icons/all";
import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import SideBarBackGroundImage from './sidebar_bg.png';
import VNPTIcon from './vnpt.svg';
import {IconContext} from "react-icons/lib";
import {FiLogOut, IoIosLogOut, MdLogout, MdOutlineSave} from "react-icons/all";
import {ERROR, LOADED} from "../Redux/ReducersAndActions/Status/StatusActionsDefinition";
import {toast, ToastContainer} from "react-toastify";
import {useDispatch, useSelector} from "react-redux";
import {LOGOUT} from "../API_URL";
import {NOT_LOGGED_IN} from "../Redux/ReducersAndActions/Authentication/AuthenActionsDefinition";

// ProSidebar: https://www.npmjs.com/package/react-pro-sidebar

function SideBarCustom(props) {
    const {list_item}                       = props;
    const dispatch                          = useDispatch();
    const {token, fullname, is_admin}       = useSelector(state => state.Authen);
    const [SideBarClosed, setSideBarState] = useState(true);

    const getWindowDimensions = () => {
        const { innerWidth: width, innerHeight: height } = window;
        return { width, height };
    }
    const [windowsSize, setWindowSize] = useState(getWindowDimensions());

    const DynamicIcon = (IconName) => {
        //Doc: https://stackoverflow.com/questions/65576629/how-to-render-react-icon-depending-on-string-from-database
        const IconComponent = Icons[IconName];
        if (!IconComponent) { // Return a default one
            return <Icons.FaBeer />;
        }
        return <IconComponent />;
    }

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
                    callback(result.msg, null);
                } else {
                    toast.error(result.msg);
                    callback(null, result.msg);
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

    const Logout = () => {
        let BodyData = {
            "ssid": token
        }
        __FetchFunction(LOGOUT, BodyData, function (resp) {
            toast.success(resp.msg);
            dispatch({type: NOT_LOGGED_IN});
        });
    }

    useEffect(function() {
        function handleResize()  {
            setWindowSize(getWindowDimensions());
        }
        window.addEventListener('resize', handleResize);
        return function() {
            window.removeEventListener("resize", handleResize);
        }
    }, []);

    return (
        <ProSidebar
            image={SideBarBackGroundImage}
            breakPoint="md"
            collapsed={SideBarClosed}
            style={{
                "height": windowsSize.height + 'px',
                "display": "inline-block",
                "position": "fixed",
                "top": "0",
                "left": "0"
            }}
        >

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

            <SidebarHeader>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        padding: '24px',
                        textTransform: 'uppercase',
                        fontWeight: 'bold',
                        fontSize: 18,
                        letterSpacing: '1px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        color: "#e5e5e5"
                    }}
                >
                    <span onClick={() => setSideBarState(!SideBarClosed)}>
                        <IconContext.Provider value={{"size": "30"}}>
                            {SideBarClosed === false ? <Icons.IoIosArrowDropleftCircle/> : <Icons.IoIosArrowDroprightCircle/>}
                        </IconContext.Provider>
                    </span>
                    {SideBarClosed === false && (
                        <span style={{display: "inline-block", "marginLeft": "10px"}}>
                            IP Manager
                            <br/>
                            <span style={{fontSize: '10px', fontWeight: 600}}>{fullname} ({is_admin ? "ADMIN" : "MEMBER"})</span>
                        </span>
                    )}
                </div>
            </SidebarHeader>
            <SidebarContent>
                    {
                        list_item.map(function(item, index) {
                            return(
                                <Menu key={`sidebar_item_${index}`} iconShape="circle">
                                    <MenuItem icon={DynamicIcon(item.icon)}>{item.name}<Link onClick={() => setSideBarState(true)} to={item.path}/></MenuItem>
                                </Menu>
                            )
                        })
                    }
            </SidebarContent>
            <SidebarFooter style={{ textAlign: 'center' }}>
                <div
                    style={{
                        padding: '20px 24px',
                    }}>
                    {/*<img alt={"VNPT Icon"} width={"30"} src={VNPTIcon}/>*/}

                    {!SideBarClosed && (
                        <button onClick={Logout} className={"btn btn-block theme_strawberry"}>
                            <span style={{overflow: "hidden", whiteSpace: 'nowrap', textOverflow: 'ellipsis'}}>
                                Logout&nbsp;&nbsp;
                            </span>
                            <IconContext.Provider value={{size: 22, color: 'white', className: 'middle-btn'}}>
                                <MdLogout/>
                            </IconContext.Provider>
                        </button>
                    )}

                    {SideBarClosed && (
                        <button
                            onClick={Logout}
                            className={"theme_strawberry"}
                            style={{
                                borderRadius: "50%",
                                padding: "10px 7px 10px 13px",
                                border: "none",
                                cursor: "pointer"
                        }}>
                            <IconContext.Provider value={{size: 22, color: 'white', className: 'middle-btn'}}>
                                <MdLogout/>
                            </IconContext.Provider>
                        </button>
                    )}

                </div>
            </SidebarFooter>
        </ProSidebar>
    );
}

export default SideBarCustom;