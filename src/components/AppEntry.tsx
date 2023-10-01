import UserViewModify from "./UserViewModify";
//import ErrorPage from "./error/ErrorPage";
import AddModifyRecipe from "./AddModifyRecipe";
import NavBar from './NavBar';

import { Route, Router, Switch } from "react-router";
import history from "../app-history";
import ErrorPage from "./ErrorPage";
import RecipesPanel from "./RecipesPanel";
import { useEffect } from "react";
import * as cookie from 'react-cookies';
import { useAppDispatch, useRecipeSelector, useUserSelector } from "../store/store.model";
import { getUser } from "../store/userSlice";
import jwtDecode from "jwt-decode";
import withLoading from "./LoadingPage";
import AppToast from "./AppToast";

const AppEntry = () => {

  const currentUser = useUserSelector((state) => state.users.loggedInUser);

  const userLoading = useUserSelector((state) => state.users.loading);

  const recipeLoading = useRecipeSelector((state) => state.recipes.loading);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!currentUser.id) {
      const jwt = cookie.load('jwt');
      const decodedJwt = jwtDecode(jwt) as any;
      const id = decodedJwt.sub?.split(':')[0];
      if (id) {
        dispatch(getUser({ id: parseInt(id), isLoggedInUser: true }));
      }
    }
  }, [currentUser, dispatch])

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
