import React from "react";
import { User } from "@planv5/domain";

export const CurrentUserContext = React.createContext<User | undefined>(
  undefined
);
