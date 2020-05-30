import React from "react";
import { User } from "@choirpractise/domain";

const CurrentUserContext = React.createContext<User | undefined>(undefined);

export default CurrentUserContext;
