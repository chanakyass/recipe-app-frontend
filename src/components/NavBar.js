import {
  Navbar,
  Nav,
  DropdownButton,
  Dropdown,
} from "react-bootstrap";

import cookie from "react-cookies";
import React, { useContext } from "react";
import { CurrentUserContext } from "../App";
import history from "../app-history";

const NavBar = React.memo(() => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const { setIsCurrentUserUpdated } = useContext(CurrentUserContext);

  setIsCurrentUserUpdated(false);

  const loggedInUser = cookie.load("current_user");

  const logout = (e) => {
    cookie.remove("jwt", { path: "/" });
    cookie.remove("current_user", { path: "/" });
    setTimeout(() => history.push("/login"), 200);
  };

  return (
    <>
      {
        <Navbar sticky="top" bg="primary" fixed="top" expand="lg">
          <Navbar.Brand href="/">Recipes app</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto">
              <DropdownButton
                variant="light"
                className="my-auto mr-4"
                menuAlign="right"
                title={loggedInUser.profileName}
              >
                <Dropdown.Item href={`/profile/${loggedInUser.id}`}>
                  <div>{loggedInUser.firstName+ " "+loggedInUser.middleName + " " + loggedInUser.lastName }</div>
                  <div>
                    <small>View your profile information</small>
                  </div>
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item href="#">Give feedback</Dropdown.Item>
                <Dropdown.Item href="#" onClick={(e) => logout(e)}>
                  Logout
                </Dropdown.Item>
              </DropdownButton>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      }
    </>
  );
});

export default NavBar;
