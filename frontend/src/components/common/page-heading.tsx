import React from "react";

type Props = {
  title: string;
  subtitle?: string;
};

const PageHeading = ({ title, subtitle }: Props) => {
  return (
    <div>
      <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
      {subtitle && (
        <p className="text-muted-foreground text-sm tracking-wide">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default PageHeading;
