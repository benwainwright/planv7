import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { CurrentUserContext } from "./utils/CurrentUserContext";
import { useOptionalDependency } from "./utils/InversifyProvider";
import { APP_TYPES, LoginSessionDestroyer } from "@planv5/application/ports";

const Header: React.FC<{}> = () => {
  const currentUser = useContext(CurrentUserContext);
  const sessionDestroyer = useOptionalDependency<LoginSessionDestroyer>(
    APP_TYPES.LoginSessionDestroyer
  );

  const inOutLinks = currentUser
    ? [
        <Link to="/plans" key="plans-link">
          Plans
        </Link>,
        <Link
          to="/"
          key="logout-link"
          onClick={() => sessionDestroyer?.killSession()}
        >
          Logout
        </Link>
      ]
    : [
        <Link to="/login" key="login-link">
          Login
        </Link>,
        <Link to="/register" key="register-link">
          Register
        </Link>
      ];

  return (
    <header>
      <h1>Planv5</h1>
      <nav>
        <Link to="/">Home</Link>
        {inOutLinks}
      </nav>
    </header>
  );
};

export default Header;
