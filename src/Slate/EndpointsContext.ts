import React from "react";

export const EndpointsContext = React.createContext<
  {
    redirectHref?(context: string | null, term: string): string;
  }
>({});
