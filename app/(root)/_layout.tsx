/*****************************************************
 * AppLayout – hlavní layout komponenta aplikace
 * ---------------------------------------------------
 * Odpovídá za:
 * - zobrazení loaderu během načítání
 * - přesměrování na login, pokud není uživatel přihlášen
 * - vykreslení slotu, pokud je vše připravené
 *****************************************************/

import { useGlobalContext } from "@/context/global-context";
import { Redirect, Slot } from "expo-router";
import { ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/*****************************************************
 * 1. useGlobalContext → získání globálního stavu
 * ---------------------------------------------------
 * Vrací dvě hodnoty:
 * - loading: boolean – značí, zda se aplikace načítá
 * - isLoggedIn: boolean – značí, zda je uživatel přihlášen
 *****************************************************/
export default function AppLayout() {
  const { loading, isLoggedIn } = useGlobalContext();

  /*****************************************************
   * 2. Kontrola stavu "loading"
   * ---------------------------------------------------
   * Pokud se aplikace teprve načítá, zobrazíme loader
   * UI:
   * - Bezpečné zobrazení (SafeAreaView)
   * - Aktivní indikátor načítání (ActivityIndicator)
   *****************************************************/
  if (loading) {
    return (
      <SafeAreaView className="bg-white h-full justify-center items-center">
        <ActivityIndicator className="text-primary-500" size={"large"} />
      </SafeAreaView>
    );
  }

  /*****************************************************
   * 3. Kontrola přihlášení
   * ---------------------------------------------------
   * Pokud uživatel není přihlášen, přesměrujeme ho
   * na obrazovku /sign-log-in
   *****************************************************/
  if (!isLoggedIn) {
    return <Redirect href={"/sign-log-in"} />;
  }

  /*****************************************************
   * 4. Výchozí návrat
   * ---------------------------------------------------
   * Pokud je uživatel přihlášen a nic se nenačítá,
   * vykreslíme aktuální podstránku (Slot)
   *****************************************************/
  return <Slot />;
}
