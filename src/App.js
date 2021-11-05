import React from "react";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import BlackList from "./components/BlackLIst";
import SideBar from "./components/SideBar";
import {IoIosNotifications} from "react-icons/io";
import { BsFillHddNetworkFill } from "react-icons/bs";
import {FaBan} from "react-icons/fa";
import NotFound from "./components/NotFound";
import {TEMPLATE_URL} from "./components/API_URL";
import DownloadFile from "./components/DownloadFile";

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
            <Route exact path="/blacklist">
                <BlackList _title="Blacklist"/>
            </Route>
            <Route exact path="/download_template">
                <DownloadFile URI={TEMPLATE_URL + "CreateBlackListTemplate.xlsx"}/>
            </Route>
            <Route>
                <NotFound _title="404"/>
            </Route>
        </Switch>
      </Router>
  );
}

export default App;