import React from "react";
import { Route, BrowserRouter as Router, Switch, Link } from "react-router-dom";
import BlackList from "./components/BlackLIst";
import SideBar from "./components/SideBar";
import { FaGratipay, FaBuffer, FaLessThan } from "react-icons/fa";
import NotFound from "./components/NotFound";

const ListItems = [{
  icon: <FaBuffer/>,
  path: "/blacklist",
  name: "Blacklist IP"
}, {
  icon: <FaGratipay/>,
  path: "/vlan",
  name: "VLAN IP"
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