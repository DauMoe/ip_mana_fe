import React, {useEffect, useState} from "react";
import {Route, BrowserRouter as Router, Switch, Redirect} from "react-router-dom";
import NotFound from "./components/NotFound";
import Rules from "./components/Rules";
import {LIST_OBJ_TYPE} from "./components/API_URL";
import {ERROR, LOADED, LOADING} from "./components/Redux/ReducersAndActions/Status/StatusActionsDefinition";
import {useDispatch, useSelector} from "react-redux";
import ObjectA from "./components/ObjectA";
import 'react-pro-sidebar/dist/css/styles.css';
import SideBarCustom from "./components/ProSideBarCustom";
import Property from "./components/Property";
import Loading from "./components/Loading";

const App = () => {
    let ListSideBarItem                         = [];
    const dispatch                              = useDispatch();
    const [ListObjectType, setListObjectType]   = useState([]);
    const { loading, error, _msg }              = useSelector(state => state.Status);

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
                            ...i,
                            path: `/${i.obj_type_name.toLowerCase()}`,
                            name: i.obj_type_name,
                            autoRender: true
                        });
                    }
                    ListSideBarItem.push({
                        icon: "BsCardList",
                        path: "/rules",
                        name: "Rules",
                        autoRender: false
                    }, {
                        icon: "AiOutlinePropertySafety",
                        path: "/property",
                        name: "Property",
                        autoRender: false
                    });
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
        <>
            <Router>
                <SideBarCustom list_item={ListObjectType}/>
                <Switch>
                    {
                        ListObjectType.map(function(item, index) {
                            return (
                                item.autoRender === true && (
                                    <Route exact path={item.path}>
                                        <ObjectA _title={item.name} _obj_type_id={item.obj_type_id} _obj_type_name={item.obj_type_name}/>
                                    </Route>
                                )
                            )
                        })
                    }

                    <Route exact path="/rules">
                        <Rules _title="Rules"/>
                    </Route>

                    <Route exact path="/property">
                        <Property _title="Rules"/>
                    </Route>

                    <Route>
                        <NotFound _title="404"/>
                    </Route>
                </Switch>
                <Redirect to={(Array.isArray(ListObjectType) && ListObjectType.length > 0) ? ListObjectType[0].path : "/rules"}/>
            </Router>
            {loading && <Loading/>}
        </>
    );
}

export default App;