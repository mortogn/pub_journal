import React, { FC } from "react";

type Props = {
  message: string;
};

const ErrorBar: FC<Props> = ({ message }) => {
  return (
    <div className="px-4 my-2 py-2.5 bg-red-100 rounded-md text-red-800 text-center tracking-wide text-sm">
      {message}
    </div>
  );
};

export default ErrorBar;
