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

const Explore = () => {
  const params = useLocalSearchParams<{ query?: string; filter?: string }>();

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

  useEffect(() => {
    refetch({
      filter: params.filter!,
      query: params.query!,
    });
  }, [params.filter, params.query]);

  const handleCardPress = (id: string) => router.push(`/properties/${id}`);

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
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator size="large" className="text-primary-500 mt-5" />
          ) : (
            <NoResults />
          )
        }
        ListHeaderComponent={() => (
          <View className="px-5">
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

            <Search />

            <View className="mt-5">
              <Filters />

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
