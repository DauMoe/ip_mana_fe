import React from "react";
import {Route, BrowserRouter as Router, Switch, Redirect} from "react-router-dom";
import { BsFillHddNetworkFill, BsCardList, FaBan, IoIosNotifications } from "react-icons/all";
import BlackList from "./components/BlackList";
import SideBar from "./components/SideBar";
import NotFound from "./components/NotFound";
import VLAN from "./components/VLAN";
import Rules from "./components/Rules";

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

  return(
      <Router>
        <Redirect to="/rules"/>
        <SideBar ListItems={ListItems}/>
        <Switch>

            <Route exact path="/blacklist">
                <BlackList _title="Blacklist"/>
            </Route>

            <Route exact path="/vlan">
                <VLAN _title="VLAN"/>
            </Route>

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