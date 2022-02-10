import {Menu, MenuItem, ProSidebar, SidebarContent, SidebarFooter, SidebarHeader} from "react-pro-sidebar";
import {FaGem, FaHeart, FaGithub, IoIosArrowDropleftCircle, IoIosArrowDroprightCircle} from "react-icons/all";
import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import SideBarBackGroundImage from './sidebar_bg.png';
import VNPTIcon from './vnpt.svg';
import {IconContext} from "react-icons/lib";

// ProSidebar: https://www.npmjs.com/package/react-pro-sidebar

function SideBarCustom(props) {
    const {list_item} = props;
    const [SideBarClosing, setSideBarState] = useState(true);
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

    return (
        <ProSidebar
            image={SideBarBackGroundImage}
            breakPoint="md"
            collapsed={SideBarClosing}
            style={{
                "height": windowsSize.height + 'px',
                "display": "inline-block",
                "position": "fixed",
                "top": "0",
                "left": "0"
            }}
        >
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
                    <span onClick={() => setSideBarState(!SideBarClosing)}>
                        <IconContext.Provider value={{"size": "30"}}>
                            {SideBarClosing === false ? <IoIosArrowDropleftCircle/> : <IoIosArrowDroprightCircle/>}
                        </IconContext.Provider>
                    </span>
                    {SideBarClosing === false && <span style={{display: "inline-block", "marginLeft": "10px"}}>IP Manager</span>}
                </div>
            </SidebarHeader>
            <SidebarContent>
                    {
                        list_item.map(function(item, index) {
                            return(
                                <Menu key={`sidebar_item_${index}`} iconShape="circle">
                                    <MenuItem icon={item.icon}>{item.name}<Link onClick={() => setSideBarState(true)} to={item.path}/></MenuItem>
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
                    <img alt={"VNPT Icon"} width={"30"} src={VNPTIcon}/>
                </div>
            </SidebarFooter>
        </ProSidebar>
    );
}

export default SideBarCustom;