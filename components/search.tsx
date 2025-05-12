/*****************************************************
 * SOUBOR: Search.tsx
 * ---------------------------------------------------
 * Komponenta vyhledávání s debounce funkcionalitou
 * ---------------------------------------------------
 * Použití:
 *  - Vyhledávací pole na stránkách s výpisem položek
 *  - Automaticky aktualizuje URL parametr `query`
 *  - Pomocí `use-debounce` snižuje počet aktualizací
 *****************************************************/

import React, { useState } from "react";
import { View, TouchableOpacity, Image, TextInput } from "react-native";
import { useDebouncedCallback } from "use-debounce";

import icons from "@/constants/icons";
import { useLocalSearchParams, router } from "expo-router";

/*****************************************************
 * 1. Komponenta: Search
 * ---------------------------------------------------
 * - Čte parametr `query` z URL pomocí `useLocalSearchParams`
 * - Uchovává aktuální hodnotu vyhledávání v `useState`
 * - Po změně vstupu aktualizuje URL s debounce (500ms)
 *****************************************************/
const Search = () => {
  // Získání aktuálních parametrů URL (např. ?query=byt)
  const params = useLocalSearchParams<{ query?: string }>();

  // Hodnota vyhledávacího pole
  const [search, setSearch] = useState(params.query);

  /*****************************************************
   * 2. Funkce: debouncedSearch
   * ---------------------------------------------------
   * - Aktualizuje URL parametr `query` s 500ms zpožděním
   * - Zabraňuje zbytečnému množství změn URL při psaní
   *****************************************************/
  const debouncedSearch = useDebouncedCallback((text: string) => {
    router.setParams({ query: text });
  }, 500);

  /*****************************************************
   * 3. Funkce: handleSearch
   * ---------------------------------------------------
   * - Nastaví stav `search` podle vstupu uživatele
   * - Spouští `debouncedSearch` pro aktualizaci URL
   *****************************************************/
  const handleSearch = (text: string) => {
    setSearch(text);
    debouncedSearch(text);
  };

  /*****************************************************
   * 4. Render: View s vyhledávacím polem a ikonami
   * ---------------------------------------------------
   * - Levá část: ikona lupy + textové pole
   * - Pravá část: ikona filtru (zatím bez funkce)
   * - Styl: bílý podklad, zaoblené rohy, rámeček
   *****************************************************/
  return (
    <View className="flex flex-row items-center justify-between w-full px-4 rounded-lg bg-white border border-primary-500 mt-5 py-2">
      {/* Vstupní pole s ikonou hledání */}
      <View className="flex-1 flex flex-row items-center justify-start z-50">
        <Image source={icons.search} className="size-5" />
        <TextInput
          value={search}
          onChangeText={handleSearch}
          placeholder="Hledat cokoliv"
          className="text-sm font-quicksand-medium text-black ml-2 flex-1"
        />
      </View>

      {/* Ikona filtru (momentálně neaktivní) */}
      <TouchableOpacity>
        <Image source={icons.filter} className="size-5" />
      </TouchableOpacity>
    </View>
  );
};

export default Search;
