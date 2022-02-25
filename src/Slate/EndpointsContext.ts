import React from "react";

import { CalcRedirectHref } from "./types";

export const EndpointsContext = React.createContext<{ redirectHref?: CalcRedirectHref; }>({});
