import React from "react";
import { Route, BrowserRouter as Router, Switch, Link } from "react-router-dom";
import BlackList from "./components/BlackLIst";
import SideBar from "./components/SideBar";

const App = () => {
  return(
    <Router>
      <SideBar/>
        <Switch>
          <Route path="/blacklist" component={BlackList}/>
        </Switch>
    </Router>
  );
}

export default App;