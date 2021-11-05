import React from "react";
import {Route, BrowserRouter as Router, Switch, Redirect} from "react-router-dom";
import BlackList from "./components/BlackList";
import SideBar from "./components/SideBar";
import {IoIosNotifications} from "react-icons/io";
import { BsFillHddNetworkFill } from "react-icons/bs";
import {FaBan} from "react-icons/fa";
import NotFound from "./components/NotFound";

const ListItems = [{
  icon: <FaBan/>,
  path: "/blacklist",
  name: "Blacklist IP"
}, {
  icon: <BsFillHddNetworkFill/>,
  path: "/vlan",
  name: "VLAN IP (Pending)"
}, {
  icon: <IoIosNotifications/>,
  path: "/notification",
  name: "Notifications (Pending)"
}];

const App = () => {

  return(
      <Router>
        <Redirect to="/blacklist"/>
        <SideBar ListItems={ListItems}/>
        <Switch>

            <Route exact path="/blacklist">
                <BlackList _title="Blacklist"/>
            </Route>

            <Route>
                <NotFound _title="404"/>
            </Route>

        </Switch>
      </Router>
  );
}

export default App;