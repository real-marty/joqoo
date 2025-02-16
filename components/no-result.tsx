import React from "react";
import { View, Text, Image } from "react-native";

import images from "@/constants/images";

const NoResults = () => {
  return (
    <View className="flex items-center my-5">
      <Image
        source={images.noResult}
        className="w-11/12 h-80"
        resizeMode="contain"
      />
      <Text className="text-2xl font-quicksand-bold text-black mt-5">
        Žádný výsledek
      </Text>
      <Text className="text-base text-zinc-600 mt-2 font-quicksand">
        Nenašli jsme žádný výsledek
      </Text>
    </View>
  );
};

export default NoResults;
