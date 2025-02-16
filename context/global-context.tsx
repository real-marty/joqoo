import { useAppwrite } from "@/hooks/use-appwrite";
import { createContext, useContext, useMemo } from "react";
import { getCurrentUserInformation } from "@/lib/appwrite";

import type { Models } from "react-native-appwrite";

interface ExtendedUser extends Models.User<{}> {
  avatar: string;
}

interface GlobalContextInterface {
  isLoggedIn: boolean;
  user: ExtendedUser | null;
  loading: boolean;
  refetch: (newParams: Record<string, string | number>) => Promise<void>;
}

const GlobalContext = createContext<GlobalContextInterface | undefined>(
  undefined,
);

export const GlobalContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const {
    data: userData,
    loading,
    refetch,
  } = useAppwrite({ fn: getCurrentUserInformation });

  const isLoggedIn = !!userData;

  const contextValue = useMemo(
    () => ({
      isLoggedIn,
      user: userData ?? null,
      loading,
      refetch,
    }),
    [isLoggedIn, userData, loading, refetch],
  );

  return (
    <GlobalContext.Provider value={contextValue}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = (): GlobalContextInterface => {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error(
      "useGlobalContext must be used within a GlobalContextProvider",
    );
  }
  return context;
};

export default GlobalContextProvider;
