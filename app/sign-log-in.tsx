/*****************************************************
 * SignLogIn – přihlašovací a registrační obrazovka
 * ---------------------------------------------------
 * Odpovídá za:
 * - zobrazení onboarding obrázku a textu
 * - přihlášení pomocí Google účtu přes Appwrite
 * - přesměrování na hlavní stránku po přihlášení
 *****************************************************/

//! KONSTANTY
import icons from "@/constants/icons";
import images from "@/constants/images";
import { useGlobalContext } from "@/context/global-context";

//? APPWRITE FUNKCE
import { signLogIn } from "@/lib/appwrite";
import { Redirect } from "expo-router";

//! REACT NATIVE KOMPONENTY
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

//! THIRD-PARTY KOMPONENTY
import { SafeAreaView } from "react-native-safe-area-context";

/*****************************************************
 * Komponenta SignLogIn
 * ---------------------------------------------------
 * - Získává hodnoty z global-context: loading, isLoggedIn, refetch
 * - Při úspěšném přihlášení refetchne uživatelská data
 * - Pokud je uživatel již přihlášen, přesměruje ho na /
 *****************************************************/
const SignLogIn = () => {
  const { refetch, loading, isLoggedIn } = useGlobalContext();

  /*****************************************************
   * 1. Redirect → pokud je uživatel přihlášen
   * ---------------------------------------------------
   * Pokud:
   * - isLoggedIn === true
   * - loading === false
   * Pak se automaticky přesměruje na hlavní stránku "/"
   *****************************************************/
  if (isLoggedIn && !loading) {
    return <Redirect href={"/"} />;
  }

  /*****************************************************
   * 2. handleSignLogIn → spuštění login funkce
   * ---------------------------------------------------
   * - Volá signLogIn() (Google login)
   * - Pokud login proběhne úspěšně → zavolá refetch({})
   * - Jinak zobrazí chybovou hlášku přes Alert
   *****************************************************/
  const handleSignLogIn = async () => {
    const loginResult = await signLogIn();
    if (loginResult) {
      refetch({});
    } else {
      Alert.alert("Chyba", "Přihlášení se nezdařilo");
    }
  };

  /*****************************************************
   * 3. Návratové UI
   * ---------------------------------------------------
   * - SafeAreaView a ScrollView pro mobilní zobrazení
   * - Obrázek onboarding
   * - Texty s názvem aplikace a výzvou k přihlášení
   * - Tlačítko „Pokračovat s Googlem“
   *****************************************************/
  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView contentContainerClassName="h-full">
        <Image
          source={images.onboarding}
          className="w-full h-4/6"
          resizeMode="contain"
        />
        <View className="px-10">
          <Text className="text-center font-quicksand-medium text-black">
            VÍTEJTE V{" "}
            <Text className="font-caveat-semibold text-3xl text-primary-500">
              Joqoo
            </Text>
          </Text>
          <Text className="text-2xl font-quicksand-bold text-black text-center mt-2">
            Najděte si nový domov. {"\n"}
            <Text className="font-caveat-semibold text-4xl text-primary-500">
              Ještě dnes {"\n"}
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
