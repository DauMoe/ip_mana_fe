import React, { useEffect, useState } from "react";
import "./SideBar.sass";
import ava from './1.jpg';
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {FaLessThan, FaGreaterThan} from "react-icons/fa";
import { OPEN_SIDEBAR, SELECT_ITEM, CLOSE_SIDEBAR } from "../Redux/ReducersAndActions/SideBar/SideBarActionsDefinition";
import { IconContext } from "react-icons/lib";

//Sass doc: https://sass-lang.com/guide
//Redux doc: https://viblo.asia/p/redux-hook-da-suong-lai-con-suong-hon-Az45brxQ5xY

const MiniSidebarIconSize = 25;
const SidebarIconSize = 20;

function SideBar (props) {
    const { ListItems } = props;
    const { is_open, _index } = useSelector(state => state.SideBar);
    const dispatch = useDispatch();
    const getWindowDimensions = () => {
        const { innerWidth: width, innerHeight: height } = window;
        return { width, height };
      }
    const [windowsSize, setWindowSize] = useState(getWindowDimensions());
    useEffect(function() {
        function handleResize()  {
            setWindowSize(getWindowDimensions());
        }
        window.addEventListener('resize', handleResize);
        return function() {
            window.removeEventListener("resize", handleResize);
        }
    }, []);

    const ToogleSideBar = () => {
        if (is_open) {
            dispatch({
                type: CLOSE_SIDEBAR
            })
        } else {
            dispatch({
                type: OPEN_SIDEBAR
            })
        }
    }

    const SelectItem = (index) => {
        dispatch({
            type: SELECT_ITEM,
            index: index
        })
    }

    return(
        <div className={"sidebar " + (is_open ? "open" : "closed")} style={{"height": windowsSize.height + 'px'}}>
            {/* Sidebar when open */}
            {is_open && (
                <>
                    <div className="sidebar_avatar">
                        <span onClick={ToogleSideBar} className="state_button">
                            <IconContext.Provider value={{className: "toogle_button"}}>
                                <FaLessThan/>
                            </IconContext.Provider>
                        </span>
                        <img src={ava}/>
                        <br/>
                        <span>Hello, Daumoe!</span>
                    </div>

                    <div className="sidebar_items">
                        <ul>
                            {ListItems.map((item, index) => {
                                return (
                                    <li key={index} onClick={() => SelectItem(index)}>
                                        <Link to={item.path}>
                                            <IconContext.Provider value={{size: SidebarIconSize}}>
                                                {item.icon}
                                            </IconContext.Provider>
                                            &nbsp;&nbsp; <span>{item.name}</span>
                                        </Link>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                </>
            )}

            {/* Sidebar when close  */}
            {!is_open && (
                <>
                    <div className="mini_sidebar_items">
                        <ul>
                            <li onClick={ToogleSideBar}>
                                <IconContext.Provider value={{className: "toogle_button"}}>
                                    <FaGreaterThan size={20}/>
                                </IconContext.Provider>
                            </li>
                            {ListItems.map((item, index) => {
                                return (
                                    <li key={index} onClick={() => SelectItem(index)} className={(index == _index ? "selected_item" : "")}>
                                        <Link to={item.path}>
                                            <IconContext.Provider value={{size: MiniSidebarIconSize, className: (index == _index ? "selected_item" : "")}}>
                                                {item.icon}
                                            </IconContext.Provider>
                                        </Link>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                </>
            )}

        </div>
    );
}

export default SideBar;