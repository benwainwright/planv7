import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { CurrentUserContext } from "../components/utils/CurrentUserContext";

const Home: React.FC<{}> = () => {
  const currentUser = useContext(CurrentUserContext);

  if (currentUser) {
    return (
      <section>
        <h2>Logged in as {currentUser.getName()}</h2>
        <p>Click on one of the links above...</p>
      </section>
    );
  } else {
    return (
      <section>
        <h2>Not logged in</h2>
        <p>
          Please <Link to="login">login</Link> or{" "}
          <Link to="/register">register</Link> an account...
        </p>
      </section>
    );
  }
};

export default Home;
