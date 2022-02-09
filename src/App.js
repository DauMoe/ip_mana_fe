import React, {useEffect, useState} from "react";
import {Route, BrowserRouter as Router, Switch, Redirect} from "react-router-dom";
import { BsFillHddNetworkFill, BsCardList, FaBan, IoIosNotifications } from "react-icons/all";
import SideBar from "./components/SideBar";
import NotFound from "./components/NotFound";
import Rules from "./components/Rules";
import {LIST_OBJ_TYPE} from "./components/API_URL";
import {ERROR, LOADED} from "./components/Redux/ReducersAndActions/Status/StatusActionsDefinition";
import {useDispatch} from "react-redux";
import ObjectA from "./components/ObjectA";
import BlackList from "./components/BlackList";

const App = () => {
    let ListSideBarItem = [{
        icon: <BsCardList/>,
        path: "/rules",
        name: "Rules",
        autoRender: false
    }];
    const dispatch = useDispatch();
    const [ListObjectType, setListObjectType] = useState([]);

    useEffect(function() {
        let requestOptions = {
            method: 'POST',
            redirect: 'follow'
        };

        fetch(LIST_OBJ_TYPE, requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result.code === 200) {
                    dispatch({type: LOADED});
                    for (let i of result.msg) {
                        ListSideBarItem.push({
                            obj_type_id: i.obj_type_id,
                            icon: <IoIosNotifications/>,
                            path: `/${i.obj_type_name.toLowerCase()}`,
                            name: i.obj_type_name,
                            autoRender: true
                        });
                    }
                    setListObjectType(ListSideBarItem);
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
    }, []);

  return(
      <Router>
        <Redirect to="/blacklist"/>
        <SideBar ListItems={ListObjectType}/>
        <Switch>
            {
                ListObjectType.map(function(item, index) {
                    return (
                        item.autoRender === true && (
                            <Route exact path={item.path}>
                                <ObjectA _title={item.name} _obj_type_id={item.obj_type_id}/>
                            </Route>
                        )
                    )
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