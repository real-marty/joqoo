/*****************************************************
 * SOUBOR: NoResults.tsx
 * ---------------------------------------------------
 * Komponenta pro zobrazení informace o prázdném výsledku
 * ---------------------------------------------------
 * Použití:
 *  - Zobrazuje se, když nebyla nalezena žádná data
 *  - Např. při filtrování nebo chybějících výsledcích
 *****************************************************/

import React from "react";
import { View, Text, Image } from "react-native";
import images from "@/constants/images";

/*****************************************************
 * 1. Komponenta: NoResults
 * ---------------------------------------------------
 * - Statická komponenta bez props
 * - Vhodná pro případy, kdy není co zobrazit
 * - Obsahuje obrázek, nadpis a podnadpis
 *****************************************************/
const NoResults = () => {
  return (
    <View className="flex items-center my-5">
      {/* Obrázek symbolizující prázdný výsledek */}
      <Image
        source={images.noResult}
        className="w-11/12 h-80"
        resizeMode="contain"
      />

      {/* Hlavní nadpis */}
      <Text className="text-2xl font-quicksand-bold text-black mt-5">
        Žádný výsledek
      </Text>

      {/* Podnadpis s vysvětlením */}
      <Text className="text-base text-zinc-600 mt-2 font-quicksand">
        Nenašli jsme žádný výsledek
      </Text>
    </View>
  );
};

export default NoResults;
