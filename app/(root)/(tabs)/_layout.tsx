/*******************************************************
 * 1. Importy
 * -----------------------------------------------------
 * Zde importujeme nezbytné React Native komponenty,
 * knihovnu React, Expo Router pro záložky a náš
 * modul s ikonami.
 *******************************************************/
import { Image, ImageSourcePropType, Text, View } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import icons from "@/constants/icons";

/*******************************************************
 * 2. Definice typu props pro komponentu TabIcon
 * -----------------------------------------------------
 * - focused: boolean  → udává, zda je daná záložka aktivní
 * - icon: ImageSourcePropType → zdroj ikony (typ React Native)
 * - title: string → textový popisek záložky
 *******************************************************/
type TabIconProps = {
  focused: boolean;
  icon: ImageSourcePropType;
  title: string;
};

/*******************************************************
 * 3. Komponenta TabIcon
 * -----------------------------------------------------
 * Jednoduchá prezentační (stateless) komponenta,
 * která vykreslí ikonu a název záložky.
 *
 * - Používáme DRY: komponenta se stará jen o vzhled
 *   a dostává vše jako props, bez opakování kódu.
 *******************************************************/
const TabIcon: React.FC<TabIconProps> = ({ focused, icon, title }) => (
  <View
    className="flex-1 mt-2 flex flex-col items-center"
    /* 
      flex-1         → komponenta zabírá volné místo ve View
      mt-2           → margin-top pro vertikální odsazení
      flex-col       → uspořádání prvků ve sloupci
      items-center   → centrování horizontálně
    */
  >
    <Image
      source={icon}
      /* 
        tintColor      → barva ikony; změna podle stavu focused
           aktivní: "#ac0d2f"
           neaktivní: "#636363"
      */
      tintColor={focused ? "#ac0d2f" : "#636363"}
      resizeMode="contain"
      /* 
        resizeMode     → jak se daný obrázek přizpůsobí
                          (zachová poměr stran)
      */
      className="size-7"
      /* 
        velikost ikony: width & height odpovídá tailwind třídě size-7
      */
    />
    <Text
      className={`
        ${
          focused
            ? "text-primary-600 font-quicksand-semibold"
            : "text-black font-quicksand-medium"
        }
        text-sm w-full text-center mt-1
      `}
      /*
        text-primary-600     → barva textu pro aktivní záložku
        font-quicksand-semibold → tučnější řez písma pro aktivní
        text-black             → barva pro neaktivní text
        font-quicksand-medium  → lehčí řez pro neaktivní
        text-sm                → velikost písma
        w-full                 → šířka textu na 100 % rodiče
        text-center            → centrování textu
        mt-1                   → drobné odsazení od ikony
      */
    >
      {title}
    </Text>
  </View>
);

/*******************************************************
 * 4. Komponenta TabsNavigation
 * -----------------------------------------------------
 * Hlavní komponenta, která definuje strukturu záložek.
 *
 * - screenOptions: globální nastavení vzhledu tab baru
 * - Každá záložka je definována přes Tabs.Screen
 *   s vlastním názvem, nadpisem a ikonou.
 *******************************************************/
const TabsNavigation: React.FC = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        /* Skryjeme základní label pod ikonu */
        tabBarStyle: {
          backgroundColor: "white",
          borderTopColor: "#fdf4f5",
          borderTopWidth: 1,
          minHeight: 70,
          position: "absolute",
        },
        /*
          backgroundColor → barva pozadí tab baru
          borderTopColor → barva horního okraje
          borderTopWidth → tloušťka horního okraje
          minHeight      → minimální výška tab baru
          position: "absolute" → fixní pozice, překrývá obsah
        */
      }}
    >
      {/* Záložka: Domů */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Domů",
          headerShown: false,
          /* Vlastní ikona a popisek */
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.home} title="Domů" />
          ),
        }}
      />

      {/* Záložka: Najít */}
      <Tabs.Screen
        name="explore"
        options={{
          title: "Najít",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.search} title="Najít" />
          ),
        }}
      />

      {/* Záložka: Účet */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Účet",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.person} title="Účet" />
          ),
        }}
      />
    </Tabs>
  );
};

/*******************************************************
 * 5. Export
 * -----------------------------------------------------
 * Výchozí export komponenty TabsNavigation, kterou
 * použijeme jako hlavní navigaci v appce.
 *******************************************************/
export default TabsNavigation;
