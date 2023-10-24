import UserViewModify from "./UserViewModify";
//import ErrorPage from "./error/ErrorPage";
import AddModifyRecipe from "./AddModifyRecipe";
import NavBar from './NavBar';

import jwtDecode from "jwt-decode";
import { useEffect } from "react";
import * as cookie from 'react-cookies';
import { Route, Router, Switch, useHistory } from "react-router";
import { useAppDispatch, useRecipeSelector, useUserSelector } from "../store/store.model";
import { getUser } from "../store/user";
import AppToast from "./AppToast";
import ErrorPage from "./ErrorPage";
import RecipesPanel from "./RecipesPanel";

const AppEntry = () => {

  const currentUser = useUserSelector((state) => state.users.loggedInUser);

  const userLoading = useUserSelector((state) => state.users.loading);

  const recipeLoading = useRecipeSelector((state) => state.recipes.loading);

  const dispatch = useAppDispatch();

  const history = useHistory();

  useEffect(() => {
    if (!currentUser.id) {
      const jwt = cookie.load('jwt');
      const decodedJwt = jwtDecode(jwt) as any;
      const id = decodedJwt.sub?.split(':')[0];
      if (id) {
        dispatch(getUser({ id: parseInt(id), setLoggedInUser: true }));
      }
    }
  }, [currentUser.id, dispatch])

  return (
    <Router history={history}>
      <NavBar />
      <AppToast />
      <Switch>
        <Route exact path="/profile/:id" render={() => <UserViewModify loadingStatus={userLoading}/>} />
        <Route exact path="/recipe/:id" render={() => <AddModifyRecipe />} />
        <Route exact path="/error" component={ErrorPage} />
        <Route exact path="/" render={() => <RecipesPanel loadingStatus={userLoading && recipeLoading} />} />
      </Switch>
    </Router>
  );
};

export default AppEntry;
