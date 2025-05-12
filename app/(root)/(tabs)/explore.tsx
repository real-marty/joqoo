/*******************************************************
 * 1. Importy
 * -----------------------------------------------------
 * - React Native komponenty pro UI a interakci
 * - expo-router pro navigaci a získání parametrů
 * - vlastní moduly: ikony, komponenty, funkce pro API
 *******************************************************/
import {
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router";

import icons from "@/constants/icons";
import Search from "@/components/search";
import { Card } from "@/components/card";
import Filters from "@/components/filters";
import NoResults from "@/components/no-result";

import { getProperties } from "@/lib/appwrite";
import { useAppwrite } from "@/hooks/use-appwrite";

/*******************************************************
 * 2. Definice Explore komponenty
 * -----------------------------------------------------
 * - Získání volitelných query parametrů z URL
 * - Inicializace hooku useAppwrite pro načítání dat
 *   (skip: true → nevoláme hned, ale až v useEffect)
 *******************************************************/
const Explore: React.FC = () => {
  // a) Parametry z URL: query (hledaný text), filter (typ filtru)
  const params = useLocalSearchParams<{ query?: string; filter?: string }>();

  // b) useAppwrite vrací: data (seznam nemovitostí),
  //    refetch funkci pro znovunačtení a loading stav
  const {
    data: properties,
    refetch,
    loading,
  } = useAppwrite({
    fn: getProperties,
    params: {
      filter: params.filter!,
      query: params.query!,
    },
    skip: true,
  });

  /*****************************************************
   * 3. useEffect → znovunačtení při změně parametrů
   * ---------------------------------------------------
   * - Dependencie: params.filter a params.query
   * - Při změně parameterů zavoláme refetch s novými hodnotami
   *****************************************************/
  useEffect(() => {
    refetch({
      filter: params.filter!,
      query: params.query!,
    });
  }, [params.filter, params.query]);

  /*******************************************************
   * 4. handleCardPress
   * -----------------------------------------------------
   * - Při tapnutí na kartu nemovitosti navigujeme na detail
   * - Používáme router.push s cílovou cestou `/properties/{id}`
   *******************************************************/
  const handleCardPress = (id: string) => {
    router.push(`/properties/${id}`);
  };

  /*******************************************************
   * 5. Render SafeAreaView s FlatList
   * -----------------------------------------------------
   * - SafeAreaView chrání obsah před výřezy a notch
   * - FlatList vykreslí mřížku nemovitostí:
   *   • numColumns=2 → dvě sloupce
   *   • renderItem → kartu přes <Card>
   *   • ListHeaderComponent → vyhledávání, filtr, počet
   *   • ListEmptyComponent → spinner nebo zpráva o 0 výsledcích
   *******************************************************/
  return (
    <SafeAreaView className="h-full bg-white">
      <FlatList
        data={properties}
        numColumns={2}
        renderItem={({ item }) => (
          <Card item={item} onPress={() => handleCardPress(item.$id)} />
        )}
        keyExtractor={(item) => item.$id}
        contentContainerClassName="pb-32"
        columnWrapperClassName="flex gap-5 px-5"
        showsVerticalScrollIndicator={false}
        /* a) Co vykreslit, když není žádný datový prvek */
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator size="large" className="text-primary-500 mt-5" />
          ) : (
            <NoResults />
          )
        }
        /* b) Hlavička seznamu: navigace, vyhledávání, filtry, počet */
        ListHeaderComponent={() => (
          <View className="px-5">
            {/* Horní řádek s tlačítkem zpět, nadpisem a ikonou */}
            <View className="flex flex-row items-center justify-between mt-5">
              <TouchableOpacity
                onPress={() => router.back()}
                className="flex flex-row bg-primary-500 rounded-full size-11 items-center justify-center"
              >
                <Image
                  source={icons.backArrow}
                  className="size-5"
                  tintColor="#ffffff"
                />
              </TouchableOpacity>

              <Text className="text-2xl mr-2 text-center font-caveat-semibold text-zinc-600 p-1">
                Hledejte svůj ideální domov
              </Text>

              <Image source={icons.bell} className="w-6 h-6" />
            </View>

            {/* Komponenta pro zadání vyhledávacího dotazu */}
            <Search />

            <View className="mt-5">
              {/* Komponenta pro výběr filtrů */}
              <Filters />

              {/* Počet nalezených nemovitostí */}
              <Text className="text-xl font-quicksand-bold text-zinc-600 mt-5">
                Nalezeno {properties?.length} nemovitostí
              </Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default Explore;
