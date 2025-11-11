"use client";

import api from "@/lib/api";
import { User } from "@/types";
import { useQuery } from "@tanstack/react-query";
import React, { FC, PropsWithChildren } from "react";
import { getCookie, deleteCookie } from "cookies-next";

type AuthContextType = {
  currentUser: User | null;
  signOut: () => void;
};

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error(
      "useAuthContext must be used within an AuthContextProvider"
    );
  }
  return context;
};

const AuthContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const { data: userRes, refetch } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      return api<User>(`/users/me`, {
        method: "GET",
        headers: {
          authorization: `Bearer ${getCookie("ac-token")}`,
        },
      });
    },
  });

  const signOut = () => {
    deleteCookie("ac-token");
    refetch();
    // Additional sign-out logic can be added here
  };

  return (
    <AuthContext value={{ currentUser: userRes?.data || null, signOut }}>
      {children}
    </AuthContext>
  );
};

export default AuthContextProvider;
