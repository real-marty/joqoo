/*******************************************************
 * 1. Importy
 * -----------------------------------------------------
 * - React Native základní komponenty: View, Text, Image, atd.
 * - Komponenta SafeAreaView chrání před výřezy obrazovky
 * - ScrollView pro vertikální posouvání obsahu
 * - TouchableOpacity pro stisknutelné prvky
 * - Alert pro zobrazení notifikací (např. úspěch/chyba)
 * - Polyfill URL pro Appwrite (v případě potřeby)
 *******************************************************/
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

import "react-native-url-polyfill/auto";

import { logout } from "@/lib/appwrite";
import { useGlobalContext } from "@/context/global-context";

import icons from "@/constants/icons";
import { settings } from "@/constants/data";

/*******************************************************
 * 2. Rozhraní SettingsItemProp
 * -----------------------------------------------------
 * Popis parametrů pro položku nastavení:
 * - icon      : zdroj ikony (ImageSourcePropType)
 * - title     : textový nadpis položky
 * - onPress?  : volitelná funkce, která se spustí při stisku
 * - textStyle?: volitelná další třída pro styl textu
 * - showArrow?: boolean, zda zobrazit šipku vpravo (default true)
 * - tintColor?: volitelná barva ikony
 *******************************************************/
interface SettingsItemProp {
  icon: ImageSourcePropType;
  title: string;
  onPress?: () => void;
  textStyle?: string;
  showArrow?: boolean;
  tintColor?: string;
}

/*******************************************************
 * 3. Komponenta SettingsItem
 * -----------------------------------------------------
 * Jednoduchá prezentační komponenta, která:
 * - vykreslí ikonu a text vedle sebe
 * - obalí je do TouchableOpacity pro stisk
 * - volitelně zobrazí šipku vpravo
 * - podporuje přizpůsobení stylu ikony a textu
 *
 * DRY princip: vše v jediné komponentě,
 *              lze použít opakovaně bez duplikace kódu.
 *******************************************************/
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
    {/* Levá část: ikona + nadpis */}
    <View className="flex flex-row items-center gap-3">
      <Image source={icon} className="size-6" tintColor={tintColor} />
      <Text className={`text-lg font-rubik-medium text-black-300 ${textStyle}`}>
        {title}
      </Text>
    </View>
    {/* Pravá část: šipka, pokud showArrow=true */}
    {showArrow && <Image source={icons.rightArrow} className="size-5" />}
  </TouchableOpacity>
);

/*******************************************************
 * 4. Komponenta Profile
 * -----------------------------------------------------
 * Hlavní obrazovka profilu uživatele:
 * - zobrazí hlavičku s titulkem "Účet" a ikonou zvonku
 * - vykreslí avatar, jméno uživatele a tlačítko editace
 * - seznam položek nastavení rozdělený do sekcí
 * - funkci pro odhlášení s potvrzením výsledku
 *******************************************************/
const Profile = () => {
  /*****************************************************
   * 4.1. Globální kontext
   * ---------------------------------------------------
   * Získáme aktuálního uživatele a funkci refetch
   * pro případ aktualizace dat po odhlášení.
   *****************************************************/
  const { user, refetch } = useGlobalContext();

  /*****************************************************
   * 4.2. Funkce handleLogout
   * ---------------------------------------------------
   * - Asynchronně voláme logout() z Appwrite knihovny
   * - Pokud odhlášení proběhne, zobrazíme Alert s úspěchem
   *   a zavoláme refetch() pro obnovu kontextu
   * - V opačném případě zobrazíme Alert s chybou
   *****************************************************/
  const handleLogout = async () => {
    const result = await logout();
    if (result) {
      Alert.alert("Akce dokončena", "Odhlášení proběhlo úspěšně");
      refetch({});
    } else {
      Alert.alert("Chyba", "Odhlášení se nezdařilo");
    }
  };

  /*****************************************************
   * 4.3. Render SafeAreaView + ScrollView
   * ---------------------------------------------------
   * - SafeAreaView zajistí, že obsah nebude pod notchem
   * - ScrollView umožní vertikální rolování celé obrazovky
   *****************************************************/
  return (
    <SafeAreaView className="h-full bg-white">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-32 px-7"
      >
        {/***********************/
        /* 4.3.1. Hlavička obrazovky */
        /******************************/}
        <View className="flex flex-row items-center justify-between mt-5">
          <Text className="text-xl font-rubik-bold">Účet</Text>
          <Image source={icons.bell} className="size-7" />
        </View>

        {/*******************************/
        /* 4.3.2. Avatar a jméno uživatele */
        /**********************************/}
        <View className="flex flex-row justify-center mt-5">
          <View className="flex flex-col items-center relative mt-5">
            {/* Kruhové pozadí pro avatar */}
            <View className="bg-primary-500 rounded-full size-48 justify-center items-center">
              <Image
                source={{ uri: user?.avatar }}
                className="size-44 relative rounded-full"
              />
            </View>
            {/* Jméno + tlačítko pro editaci */}
            <View className="flex flex-row items-center mt-3 gap-2">
              <Text className="text-2xl font-rubik-bold">{user?.name}</Text>
              <TouchableOpacity>
                <Image source={icons.edit} className="size-6 -mt-1" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/******************************************/
        /* 4.3.3. Sekce: základní nastavení účtu */
        /******************************************/}
        <View className="flex flex-col mt-10">
          <SettingsItem icon={icons.calendar} title="Moje rezervace" />
          <SettingsItem icon={icons.wallet} title="Platby" />
        </View>

        {/******************************************/
        /* 4.3.4. Sekce: pokročilé nastavení (data) */
        /******************************************/}
        <View className="flex flex-col mt-5 border-t pt-5 border-primary-500">
          {settings.slice(2).map((item, index) => (
            <SettingsItem key={index} {...item} />
          ))}
        </View>

        {/******************************************/
        /* 4.3.5. Sekce: odhlášení uživatele */
        /******************************************/}
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

/*******************************************************
 * 5. Export komponenty Profile
 *******************************************************/
export default Profile;
