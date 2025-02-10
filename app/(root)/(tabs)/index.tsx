import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text className="font-bold text-gl my-10">
        Vítejte v aplikace Host do domu
      </Text>
      <Link href={"/sign-log-in"}>Přihlásit & Registrovat</Link>
      <Link href={"/explore"}>Hledat možnosti</Link>
      <Link href={"/profile"}>Profil</Link>
      <Link href={"/properties/[id]"}>Dům</Link>
    </View>
  );
}
