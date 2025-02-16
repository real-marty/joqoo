import { View, Text, Image } from "react-native";

import icons from "@/constants/icons";
import { Models } from "react-native-appwrite";

interface Props {
  item: Models.Document;
}

const Comment = ({ item }: Props) => {
  return (
    <View className="flex flex-col items-start">
      <View className="flex flex-row items-center">
        <Image source={{ uri: item.avatar }} className="size-14 rounded-full" />
        <Text className="text-base text-black text-start font-quicksand-bold ml-3">
          {item.name}
        </Text>
      </View>

      <Text className="text-zinc-800 text-base font-quicksand mt-2">
        {item.review}
      </Text>

      <View className="flex flex-row items-center w-full justify-between mt-4">
        <View className="flex flex-row items-center">
          <Image
            source={icons.heart}
            className="size-5"
            tintColor={"#C31034"}
          />
          <Text className="text-black text-sm font-quicksand-medium ml-2">
            120
          </Text>
        </View>
        <Text className="text-zinc-600 text-sm font-quicksand">
          {new Date(item.$createdAt).toDateString()}
        </Text>
      </View>
    </View>
  );
};

export default Comment;
