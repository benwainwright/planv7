import React from "react";
import { User } from "@planv7/domain";

const CurrentUserContext = React.createContext<User | undefined>(undefined);

export default CurrentUserContext;
