import UserViewModify from "./UserViewModify"
//import ErrorPage from "./error/ErrorPage";
import AddModifyRecipe from "./AddModifyRecipe";
import NavBar from './NavBar'

import { Router, Route, Switch } from "react-router";
import RecipesPanel from "./RecipesPanel";
import history from "../app-history";
import ErrorPage from "./ErrorPage";

const AppEntry = () => {

    
  return (
    <Router history={history}>
      <NavBar />
      <Switch>
        <Route exact path="/profile/:id" component={UserViewModify} />
        {/* <Route exact path="/error" component={ErrorPage} /> */}

        <Route exact path="/recipe/:id" render={() => <AddModifyRecipe />} />
        <Route exact path="/error" component={ErrorPage} />
        <Route exact path="/" render={() => <RecipesPanel />} />
      </Switch>
    </Router>
  );
};

export default AppEntry;
