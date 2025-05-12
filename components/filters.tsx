/*****************************************************
 * SOUBOR: Filters.tsx
 * ---------------------------------------------------
 * Komponenta pro horizontální výběr kategorie (filtru)
 * ---------------------------------------------------
 * Použití:
 *  - Zobrazuje horizontální scroll seznam kategorií
 *  - Vybraný filtr se nastaví do URL parametrů
 *  - Používá `router.setParams` z expo-router
 *****************************************************/

import React, { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { Text, ScrollView, TouchableOpacity } from "react-native";

import { categories } from "@/constants/data";

/*****************************************************
 * 1. Komponenta: Filters
 * ---------------------------------------------------
 * - Parametr `filter` z URL se přečte pomocí `useLocalSearchParams`
 * - Uživatel může klepnout na kategorii pro filtrování
 * - Po klepnutí se nastaví vybraný filtr do URL
 *****************************************************/
const Filters = () => {
  // Parametry z adresy URL (např. ?filter=Byt)
  const params = useLocalSearchParams<{ filter?: string }>();

  // Vybraná kategorie – výchozí hodnota buď z URL, nebo "Vše"
  const [selectedCategory, setSelectedCategory] = useState(
    params.filter || "Vše",
  );

  /*****************************************************
   * 2. Funkce: handleCategoryPress
   * ---------------------------------------------------
   * - Zpracuje kliknutí na kategorii
   * - Pokud uživatel klikne na již aktivní kategorii,
   *   filtr se zruší (nastaví se prázdný řetězec)
   * - Jinak se filtr nastaví na danou kategorii
   *****************************************************/
  const handleCategoryPress = (category: string) => {
    if (selectedCategory === category) {
      // Kliknutí na aktivní kategorii = reset filtru
      setSelectedCategory("");
      router.setParams({ filter: "" });
      return;
    }

    // Nastavení nové aktivní kategorie a URL parametru
    setSelectedCategory(category);
    router.setParams({ filter: category });
  };

  /*****************************************************
   * 3. Render: ScrollView s kategoriemi
   * ---------------------------------------------------
   * - Horizontálně scrollovatelný seznam kategorií
   * - Každá položka má vlastní vzhled podle toho,
   *   zda je aktivní (vybraná) nebo ne
   *****************************************************/
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="mt-3 mb-2"
    >
      {categories.map((item, index) => (
        <TouchableOpacity
          onPress={() => handleCategoryPress(item.category)}
          key={item.title + index}
          className={`flex flex-col items-start mr-4 px-4 py-2 rounded-full ${
            selectedCategory === item.category
              ? "bg-primary-500 border-primary-500"
              : "bg-primary-50 border border-primary-500"
          }`}
        >
          <Text
            className={`text-sm ${
              selectedCategory === item.category
                ? "text-white font-quicksand-bold mt-0.5"
                : "text-black font-quicksand-semibold"
            }`}
          >
            {item.title}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default Filters;
