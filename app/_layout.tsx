/*****************************************************
 * RootLayout – vstupní layout celé aplikace
 * ---------------------------------------------------
 * Odpovídá za:
 * - načtení vlastních fontů
 * - skrytí splash screen po načtení
 * - nastavení globálního kontextu
 * - nastavení stack navigace bez hlavičky
 *****************************************************/

import { SplashScreen, Stack } from "expo-router";

// Import globálních CSS stylů (např. Tailwind)
import "./global.css";

import { useFonts } from "expo-font";
import { useEffect } from "react";
import { GlobalContextProvider } from "@/context/global-context";

/*****************************************************
 * 1. useFonts → načtení vlastních fontů
 * ---------------------------------------------------
 * Fonty použité:
 * - Caveat (Bold, Medium, Regular, SemiBold)
 * - Quicksand (Bold, Medium, Regular, SemiBold, Light)
 *
 * Pokud fonty nejsou načteny, komponenta vrací null
 *****************************************************/
export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "Caveat-Bold": require("../assets/fonts/Caveat-Bold.ttf"),
    "Caveat-Medium": require("../assets/fonts/Caveat-Medium.ttf"),
    "Caveat-Regular": require("../assets/fonts/Caveat-Regular.ttf"),
    "Caveat-SemiBold": require("../assets/fonts/Caveat-SemiBold.ttf"),
    "Quicksand-Bold": require("../assets/fonts/Quicksand-Bold.ttf"),
    "Quicksand-Medium": require("../assets/fonts/Quicksand-Medium.ttf"),
    "Quicksand-Regular": require("../assets/fonts/Quicksand-Regular.ttf"),
    "Quicksand-SemiBold": require("../assets/fonts/Quicksand-SemiBold.ttf"),
    "Quicksand-Light": require("../assets/fonts/Quicksand-Light.ttf"),
  });

  /*****************************************************
   * 2. useEffect → skrytí splash screen po načtení fontů
   * ---------------------------------------------------
   * Dependencie:
   * - fontsLoaded
   *
   * Jakmile jsou fonty načteny, zavoláme:
   * - SplashScreen.hideAsync()
   *****************************************************/
  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // Pokud fonty ještě nejsou načteny, nevracíme nic (null)
  if (!fontsLoaded) return null;

  /*****************************************************
   * 3. Návrat komponenty
   * ---------------------------------------------------
   * - Obalíme aplikaci do GlobalContextProvider
   * - Použijeme Stack router bez zobrazené hlavičky
   *****************************************************/
  return (
    <GlobalContextProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </GlobalContextProvider>
  );
}
