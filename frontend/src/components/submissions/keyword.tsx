import React, { PropsWithChildren } from "react";

const Keyword: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <span className="bg-muted px-2 py-1 rounded-md text-sm font-mono">
      {children}
    </span>
  );
};

export default Keyword;
