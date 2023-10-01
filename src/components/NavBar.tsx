import {
  Dropdown,
  DropdownButton,
  Nav,
  Navbar,
} from "react-bootstrap";

import * as React from "react";
import * as cookie from "react-cookies";
import history from "../app-history";
import { useUserSelector } from "../store/store.model";

const NavBar = React.memo(() => {
  const loggedInUser = useUserSelector((state) => state.users.loggedInUser);

  const logout = (_e: Event) => {
    cookie.remove("jwt", { path: "/" });
    cookie.remove("current_user", { path: "/" });
    setTimeout(() => history.push("/login"), 200);
  };

  return (
    <>
      {loggedInUser.id &&
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
                <Dropdown.Item href="#" onClick={(e: Event) => logout(e)}>
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
