/*****************************************************
 * SOUBOR: global-context.tsx
 * ---------------------------------------------------
 * Kontextová vrstva pro uchování globálních dat o uživateli
 * ---------------------------------------------------
 * Poskytuje:
 *   - informace o přihlášení
 *   - uživatelská data (včetně avatara)
 *   - načítací stav (loading)
 *   - refetch funkci pro znovunačtení uživatele
 *****************************************************/

import { useAppwrite } from "@/hooks/use-appwrite";
import { createContext, useContext, useMemo } from "react";
import { getCurrentUserInformation } from "@/lib/appwrite";
import type { Models } from "react-native-appwrite";

/*****************************************************
 * 1. Rozšířené rozhraní uživatele
 * ---------------------------------------------------
 * - Základní Appwrite uživatel doplněný o avatar
 *****************************************************/
interface ExtendedUser extends Models.User<{}> {
  avatar: string;
}

/*****************************************************
 * 2. Rozhraní globálního kontextu
 * ---------------------------------------------------
 * isLoggedIn: true/false podle přihlášení
 * user: objekt uživatele nebo null
 * loading: indikuje stav načítání
 * refetch: funkce pro opětovné načtení dat
 *****************************************************/
interface GlobalContextInterface {
  isLoggedIn: boolean;
  user: ExtendedUser | null;
  loading: boolean;
  refetch: (newParams: Record<string, string | number>) => Promise<void>;
}

/*****************************************************
 * 3. Vytvoření kontextu
 * ---------------------------------------------------
 * Inicializační hodnota je undefined – musí být kontrolována
 *****************************************************/
const GlobalContext = createContext<GlobalContextInterface | undefined>(
  undefined,
);

/*****************************************************
 * 4. Komponenta: GlobalContextProvider
 * ---------------------------------------------------
 * - Obaluje aplikaci a poskytuje globální data všem komponentám
 * - Využívá vlastní hook `useAppwrite` k získání dat
 * - Memoizuje hodnotu kontextu pro optimalizaci výkonu
 *****************************************************/
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

  // true, pokud existuje nějaké uživatelské data
  const isLoggedIn = !!userData;

  // Memoizace kontextové hodnoty – změna jen pokud se změní závislosti
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

/*****************************************************
 * 5. Vlastní hook: useGlobalContext
 * ---------------------------------------------------
 * - Vrací hodnoty z GlobalContextu
 * - Zajišťuje, že se používá pouze uvnitř Provideru
 *****************************************************/
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
