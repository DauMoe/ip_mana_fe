import React, { useEffect, useState } from "react";
import "./SideBar.sass";
import ava from './1.jpg';
import {} from "react-icons/fa";

//Sass doc: https://sass-lang.com/guide

function SideBar (props) {
    const getWindowDimensions = () => {
        const { innerWidth: width, innerHeight: height } = window;
        return {
          width,
          height
        };
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

    return(
        <div className="sidebar" style={{"height": windowsSize.height + 'px'}}>
            <div className="sidebar_avatar">
                <img src={ava}/>
                <br/>
                <span>Hello, Daumoe!</span>
            </div>
            <div className="sidebar_items">
                <ul>
                    <li>Home</li>
                </ul>
            </div>
        </div>
    );
}

export default SideBar;