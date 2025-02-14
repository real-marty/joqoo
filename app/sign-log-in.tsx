//! CONSTANTS
import images from "@/constants/images";

//! REACT NATIVE IMPORTS
import { Image, ScrollView } from "react-native";

//! THIRD-PARTY LIBRARIES
import { SafeAreaView } from "react-native-safe-area-context";

const SignLogIn = () => {
  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView contentContainerClassName="h-full">
        <Image
          source={images.onboarding}
          className="w-full h-full"
          resizeMode="contain"
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignLogIn;
