//! CONSTANTS
import icons from "@/constants/icons";
import images from "@/constants/images";

//! REACT NATIVE IMPORTS
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

//! THIRD-PARTY LIBRARIES
import { SafeAreaView } from "react-native-safe-area-context";

const SignLogIn = () => {
  const handleSignLogIn = () => {
    console.log("SignLogIn");
  };

  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView contentContainerClassName="h-full">
        <Image
          source={images.onboarding}
          className="w-full h-4/6"
          resizeMode="contain"
        />
        <View className="px-10">
          <Text className="text-center font-quicksand-medium text-black ">
            VÍTEJTE V{" "}
            <Text className="font-caveat-semibold text-3xl  text-primary-500">
              Joqoo
            </Text>
          </Text>
          <Text className="text-2xl font-quicksand-bold text-black text-center mt-2">
            Objevte svět, kde příběh začíná. {"\n"}
            <Text className="font-caveat-semibold text-4xl text-primary-500">
              Domov, kde sny ožívají. {"\n"}
            </Text>
          </Text>
          <Text className="font-quicksand-medium text-center text-lg mb-2">
            Přihlásit se <Text className="text-primary-500">|</Text> Registrovat
          </Text>
          <TouchableOpacity
            onPress={handleSignLogIn}
            className="bg-white shadow-sm shadow-neutral-400 rounded-full w-full py-4 mt-2.5"
          >
            <View className="flex flex-row items-center justify-center">
              <Image
                source={icons.google}
                className="size-6"
                resizeMode="contain"
              />
              <Text className="text-lg font-quicksand-medium text-black ml-3">
                Pokračovat s Googlem
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignLogIn;
