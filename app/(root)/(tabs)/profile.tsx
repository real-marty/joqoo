import {
  Alert,
  Image,
  ImageSourcePropType,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { logout } from "@/lib/appwrite";
import { useGlobalContext } from "@/context/global-context";

import icons from "@/constants/icons";
import { settings } from "@/constants/data";

interface SettingsItemProp {
  icon: ImageSourcePropType;
  title: string;
  onPress?: () => void;
  textStyle?: string;
  showArrow?: boolean;
  tintColor?: string;
}

const SettingsItem = ({
  icon,
  title,
  onPress,
  textStyle,
  showArrow = true,
  tintColor,
}: SettingsItemProp) => (
  <TouchableOpacity
    onPress={onPress}
    className="flex flex-row items-center justify-between py-3"
  >
    <View className="flex flex-row items-center gap-3">
      <Image source={icon} className="size-6" tintColor={tintColor} />
      <Text className={`text-lg font-rubik-medium text-black-300 ${textStyle}`}>
        {title}
      </Text>
    </View>

    {showArrow && <Image source={icons.rightArrow} className="size-5" />}
  </TouchableOpacity>
);

const Profile = () => {
  const { user, refetch } = useGlobalContext();

  const handleLogout = async () => {
    const result = await logout();
    if (result) {
      Alert.alert("Akce dokončena", "Odhlášení proběhlo úspěšně");
      refetch({});
    } else {
      Alert.alert("Chyba", "Odhlášení se nezdařilo");
    }
  };

  return (
    <SafeAreaView className="h-full bg-white">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-32 px-7"
      >
        <View className="flex flex-row items-center justify-between mt-5">
          <Text className="text-xl font-rubik-bold">Účet</Text>
          <Image source={icons.bell} className="size-7" />
        </View>

        <View className="flex flex-row justify-center mt-5">
          <View className="flex flex-col items-center relative mt-5">
            <View className="bg-primary-500 rounded-full size-48 justify-center items-center">
              <Image
                source={{ uri: user?.avatar }}
                className="size-44 relative rounded-full"
              />
            </View>
            <View className="flex flex-row items-center mt-3 gap-2">
              <Text className="text-2xl font-rubik-bold ">{user?.name}</Text>
              <TouchableOpacity>
                <Image source={icons.edit} className="size-6 -mt-1" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View className="flex flex-col mt-10">
          <SettingsItem icon={icons.calendar} title="Moje rezervace" />
          <SettingsItem icon={icons.wallet} title="Platby" />
        </View>

        <View className="flex flex-col mt-5 border-t pt-5 border-primary-500">
          {settings.slice(2).map((item, index) => (
            <SettingsItem key={index} {...item} />
          ))}
        </View>

        <View className="flex flex-col border-t mt-5 pt-5 border-primary-500">
          <SettingsItem
            icon={icons.logout}
            title="Odhlásit se"
            textStyle="text-primary-500"
            tintColor="#C31034"
            showArrow={false}
            onPress={handleLogout}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
