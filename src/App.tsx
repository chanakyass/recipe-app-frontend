import './App.css';
import Register from './components/Register';
import Login from './components/Login';
import * as cookie from 'react-cookies';
import ErrorPage from './components/ErrorPage';

//import history from './components/util/app-history'

import { Router, Redirect, Route, Switch } from "react-router";
import AppEntry from './components/AppEntry';
import history from './app-history';

function App() {

  const userExists = () => {
    const jwtToken = cookie.load('jwt');
    if (jwtToken) {
      return true;
    }
    return false;
  }

  return <>
    <Router history={history}>
      <Switch>
        {/* <Route exact path="/recipe/:id" render={() => userExists() ? <AddModifyRecipe /> : <Redirect to={{pathname: "/login"}} />} />
        <Route exact path="/" render={() => userExists() ? <RecipesPanel /> : <Redirect to={{ pathname: "/login" }} />} /> */}
        <Route exact path="/login" component={Login}></Route>
        <Route exact path="/register" component={Register}></Route>
        <Route exact path="/auth_error" component={ErrorPage} />
        <Route exact path="/conn_error" component={ ErrorPage} />
        <Route exact path="*" render={() => userExists() ? <AppEntry /> : <Redirect to="/login" />}></Route>
      </Switch>
    </Router>
    </>
}

export default App;
