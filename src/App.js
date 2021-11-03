import React from "react";
import { Route, BrowserRouter as Router, Switch, Link } from "react-router-dom";
import BlackList from "./components/BlackLIst";
import SideBar from "./components/SideBar";
import { FaGratipay, FaBuffer, FaCanadianMapleLeaf, FaBan } from "react-icons/fa";
import {IoIosNotifications} from "react-icons/io";
import { BsFillHddNetworkFill } from "react-icons/bs";
import NotFound from "./components/NotFound";

const ListItems = [{
  icon: <FaBan/>,
  path: "/blacklist",
  name: "Blacklist IP"
}, {
  icon: <BsFillHddNetworkFill/>,
  path: "/vlan",
  name: "VLAN IP"
}, {
  icon: <IoIosNotifications/>,
  path: "/noti",
  name: "Notifications (Pending)"
}];

const App = () => {
  return(
    <Router>
      <SideBar ListItems={ListItems}/>
      <Switch>
        <Route exact path="/blacklist" component={BlackList}/>
        <Route component={NotFound}/>
      </Switch>
    </Router>
  );
}

export default App;