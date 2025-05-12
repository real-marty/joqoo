/*******************************************************
 * 1. Importy
 * -----------------------------------------------------
 * - React Native komponenty pro vykreslení UI
 * - useEffect pro životní cyklus komponenty
 * - expo-router pro navigaci a čtení parametrů z URL
 * - SafeAreaView z react-native-safe-area-context pro
 *   ochranu obsahu před výřezy (notch, status bar)
 * - polyfill pro URL (potřebné pro Appwrite)
 *******************************************************/
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import "react-native-url-polyfill/auto";

import icons from "@/constants/icons";

import Search from "@/components/search";
import Filters from "@/components/filters";
import NoResults from "@/components/no-result";
import { Card, FeaturedCard } from "@/components/card";

import { useAppwrite } from "@/hooks/use-appwrite";
import { useGlobalContext } from "@/context/global-context";

import { getLatestProperties, getProperties } from "@/lib/appwrite";

/*******************************************************
 * 2. Definice komponenty Home
 *******************************************************/
const Home: React.FC = () => {
  /*****************************************************
   * 2.1. Kontext uživatele
   * ---------------------------------------------------
   * Získáme informace o přihlášeném uživateli
   * (např. avatar, jméno) z globálního kontextu.
   *****************************************************/
  const { user } = useGlobalContext();

  /*****************************************************
   * 2.2. Parametry z URL
   * ---------------------------------------------------
   * Čteme volitelné query parametry:
   * - query  → text ke hledání nemovitostí
   * - filter → výběr filtru (např. typ nemovitosti)
   *****************************************************/
  const params = useLocalSearchParams<{ query?: string; filter?: string }>();

  /*****************************************************
   * 2.3. Načtení nejnovějších nemovitostí
   * ---------------------------------------------------
   * useAppwrite volá getLatestProperties hned při mountu.
   * Vrací:
   * - data: latestProperties → pole objektů nemovitostí
   * - loading: latestPropertiesLoading → stav načítání
   *****************************************************/
  const { data: latestProperties, loading: latestPropertiesLoading } =
    useAppwrite({
      fn: getLatestProperties,
    });

  /*****************************************************
   * 2.4. Načtení filtrovaných nemovitostí (omezeno na 6)
   * ---------------------------------------------------
   * - skip: true → nevoláme hned, ale až v useEffect
   * - refetch: funkce pro manuální načtení s parametry
   *****************************************************/
  const {
    data: properties,
    refetch,
    loading,
  } = useAppwrite({
    fn: getProperties,
    params: {
      filter: params.filter!,
      query: params.query!,
      limit: 6,
    },
    skip: true,
  });

  /*****************************************************
   * 2.5. useEffect → znovunačtení při změně parametrů
   * ---------------------------------------------------
   * Dependencie:
   * - params.filter
   * - params.query
   *
   * Při jakékoliv změně voláme refetch s novými hodnotami:
   * - filter
   * - query
   * - limit (stále 6)
   *****************************************************/
  useEffect(() => {
    refetch({
      filter: params.filter!,
      query: params.query!,
      limit: 6,
    });
  }, [params.filter, params.query]);

  /*****************************************************
   * 2.6. Handler pro stisk karty nemovitosti
   * ---------------------------------------------------
   * Přesměruje uživatele na detail vybrané nemovitosti.
   * Používá router.push s cestou `/properties/{id}`.
   *****************************************************/
  const handleCardPress = (id: string) => {
    router.push(`/properties/${id}`);
  };

  /*******************************************************
   * 3. Render komponenty
   * -----------------------------------------------------
   * Hlavní struktura:
   * - SafeAreaView chrání obsah před výřezy
   * - FlatList vykreslí dvě sekce:
   *    a) Hlavní výpis (properties)
   *    b) Hlavička seznamu s vyhledáváním, doporučeními, filtry
   *******************************************************/
  return (
    <SafeAreaView className="h-full bg-white">
      <FlatList
        /* Data pro hlavní mřížku (2 sloupce) */
        data={properties}
        numColumns={2}
        renderItem={({ item }) => (
          <Card item={item} onPress={() => handleCardPress(item.$id)} />
        )}
        keyExtractor={(item) => item.$id}
        contentContainerClassName="pb-32"
        columnWrapperClassName="flex gap-5 px-5"
        showsVerticalScrollIndicator={false}
        /* Co zobrazit, pokud není žádný prvek */
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator size="large" className="text-primary-500 mt-5" />
          ) : (
            <NoResults />
          )
        }
        /* Hlavička seznamu: uživatel, vyhledávání, doporučené, filtry */
        ListHeaderComponent={() => (
          <View className="px-5">
            {/* 3.1. Horní řádek: avatar, pozdrav, jméno, notifikace */}
            <View className="flex flex-row items-center justify-between mt-5">
              <View className="flex flex-row">
                <Image
                  source={{ uri: user?.avatar }}
                  className="size-12 rounded-full"
                />
                <View className="flex flex-col items-start ml-2 justify-center">
                  <Text className="text-xs font-quicksand text-zinc-600">
                    Dobré ráno
                  </Text>
                  <Text className="text-base font-quicksand-medium text-black">
                    {user?.name}
                  </Text>
                </View>
              </View>
              <Image source={icons.bell} className="size-6" />
            </View>

            {/* 3.2. Komponenta pro zadání vyhledávání */}
            <Search />

            {/* 3.3. Sekce „Doporučené“ (horizontální seznam) */}
            <View className="my-3">
              <View className="flex flex-row items-center justify-between">
                <Text className="text-2xl font-caveat-bold text-primary-500 p-1">
                  Doporučené
                </Text>
                <TouchableOpacity>
                  <Text className="text-base font-quicksand-bold text-black">
                    Zobrazit vše
                  </Text>
                </TouchableOpacity>
              </View>

              {latestPropertiesLoading ? (
                /* Spinner během načítání doporučení */
                <ActivityIndicator size="large" className="text-primary-500" />
              ) : !latestProperties || latestProperties.length === 0 ? (
                /* Žádné doporučené nemovitosti */
                <NoResults />
              ) : (
                /* Horizontální FlatList pro doporučené karty */
                <FlatList
                  data={latestProperties}
                  renderItem={({ item }) => (
                    <FeaturedCard
                      item={item}
                      onPress={() => handleCardPress(item.$id)}
                    />
                  )}
                  keyExtractor={(item) => item.$id}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerClassName="flex gap-5 mt-5"
                />
              )}
            </View>

            {/* 3.4. Sekce „Naše doporučení“ + filtry */}
            <View className="mt-3">
              <View className="flex flex-row items-center justify-between">
                <Text className="text-2xl font-caveat-bold text-primary-500  p-1">
                  Naše doporučení
                </Text>
                <TouchableOpacity>
                  <Text className="text-base font-quicksand-bold text-black">
                    Zobrazit vše
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Komponenta pro výběr filtrů */}
              <Filters />
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

/*******************************************************
 * 4. Export komponenty
 *******************************************************/
export default Home;
