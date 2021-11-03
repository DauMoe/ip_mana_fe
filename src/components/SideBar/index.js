import React, { useEffect, useState } from "react";
import "./SideBar.sass";
import ava from './1.jpg';
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {FaLessThan} from "react-icons/fa";
import { OPEN_SIDEBAR, CLOSE_SIDEBAR } from "../Redux/ReducersAndActions/SideBar/ActionsDefinition";

//Sass doc: https://sass-lang.com/guide
//Redux doc: https://viblo.asia/p/redux-hook-da-suong-lai-con-suong-hon-Az45brxQ5xY

function SideBar (props) {
    const { ListItems } = props;
    const { is_open } = useSelector(state => state.SideBar);
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

    const CloseSideBar = () => {
        dispatch({
            type: OPEN_SIDEBAR
        })
    }

    return(
        <div className={"sidebar " + (is_open ? "" : "closed")} style={{"height": windowsSize.height + 'px'}}>

            <div className="sidebar_avatar">
                <span onClick={CloseSideBar} className="closed_button"><FaLessThan/></span>
                <img src={ava}/>
                <br/>
                <span>Hello, Daumoe!</span>
            </div>

            <div className="sidebar_items">
                <ul>
                    {ListItems.map((item, index) => {
                        return (
                            <li key={index}>
                                <Link to={item.path}>{item.icon}&nbsp;&nbsp; <span>{item.name}</span></Link>
                            </li>
                        )
                    })}
                </ul>
            </div>

        </div>
    );
}

export default SideBar;