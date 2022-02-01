import React, {useEffect, useState} from "react";
import {Route, BrowserRouter as Router, Switch, Redirect} from "react-router-dom";
import { BsFillHddNetworkFill, BsCardList, FaBan, IoIosNotifications } from "react-icons/all";
import BlackList from "./components/BlackList";
import SideBar from "./components/SideBar";
import NotFound from "./components/NotFound";
import VLAN from "./components/VLAN";
import Rules from "./components/Rules";
import {ERROR, LOADED} from "./components/Redux/ReducersAndActions/Status/StatusActionsDefinition";
import {toast} from "react-toastify";
import {LIST_OBJ_TYPE} from "./components/API_URL";
import {useDispatch} from "react-redux";

const ListItems = [{
  icon: <FaBan/>,
  path: "/blacklist",
  name: "Blacklist IP"
}, {
  icon: <BsFillHddNetworkFill/>,
  path: "/vlan",
  name: "VLAN IP"
}, {
    icon: <BsCardList/>,
    path: "/rules",
    name: "Rules"
}, {
  icon: <IoIosNotifications/>,
  path: "/notification",
  name: "Notifications (Pending)"
}];

const App = () => {
    const dispatch = useDispatch();
    let ListTemp = [{
        icon: <BsCardList/>,
        path: "/rules",
        name: "Rules",
        autoRender: false
    }];
    const [ListSideBarItem, setListSideBarItem] = useState([]);

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
                    toast.error(result.msg);
                    dispatch({
                        type: ERROR,
                        msg: result.msg
                    });
                }
            })
            .catch(e => {
                toast.error(e);
                dispatch({
                    type: ERROR,
                    msg: e
                })
            });
    }

    const GetListObjectType = () => {
        __FetchFunction(LIST_OBJ_TYPE, undefined, function (response) {
           for(let i of response) {
                ListTemp.push({
                    icon: <BsCardList/>,
                    path: `/${i.obj_type_name.toLowerCase()}`,
                    name: i.obj_type_name,
                    autoRender: true
                });
           }
            setListSideBarItem(ListTemp);
        });
    }

    useEffect(GetListObjectType, []);
    return(
          <Router>
            <Redirect to="/rules"/>
            <SideBar ListItems={ListSideBarItem}/>
            <Switch>
                {
                    ListSideBarItem.map((item, index) => {
                        return (
                            item.autoRender && (
                                <Route exact path={item.path}>
                                    <BlackList _title={item.name}/>
                                </Route>
                            )
                        );
                    })
                }

                <Route exact path="/rules">
                    <Rules _title="Rules"/>
                </Route>

                <Route>
                    <NotFound _title="404"/>
                </Route>

            </Switch>
          </Router>
    );
}

export default App;