/*****************************************************
 * SOUBOR: Comment.tsx
 * ---------------------------------------------------
 * Komponenta pro zobrazení jedné uživatelské recenze
 * ---------------------------------------------------
 * Obsahuje:
 *  - avatar uživatele (profilový obrázek)
 *  - jméno uživatele
 *  - text recenze
 *  - počet „líbí se mi“ (statický)
 *  - datum vytvoření recenze
 *****************************************************/

import { View, Text, Image } from "react-native";
import icons from "@/constants/icons";
import { Models } from "react-native-appwrite";

/*****************************************************
 * 1. Typová anotace Props
 * ---------------------------------------------------
 * item: dokument typu `Models.Document` obsahující:
 *   - `avatar`: URL adresa profilového obrázku
 *   - `name`: jméno autora recenze
 *   - `review`: samotný text recenze
 *   - `$createdAt`: datum vytvoření dokumentu
 *****************************************************/
interface Props {
  item: Models.Document;
}

/*****************************************************
 * 2. Komponenta: Comment
 * ---------------------------------------------------
 * - Slouží pro výpis jedné recenze pod nemovitostí
 * - Styl: čistý, čitelný, připravený pro responzivitu
 *****************************************************/
const Comment = ({ item }: Props) => {
  return (
    <View className="flex flex-col items-start">
      {/* Hlavička komentáře: avatar a jméno */}
      <View className="flex flex-row items-center">
        {/* Profilový obrázek uživatele */}
        <Image source={{ uri: item.avatar }} className="size-14 rounded-full" />

        {/* Jméno uživatele */}
        <Text className="text-base text-black text-start font-quicksand-bold ml-3">
          {item.name}
        </Text>
      </View>

      {/* Text samotné recenze */}
      <Text className="text-zinc-800 text-base font-quicksand mt-2">
        {item.review}
      </Text>

      {/* Spodní část: počet srdíček a datum vytvoření */}
      <View className="flex flex-row items-center w-full justify-between mt-4">
        {/* Počet srdíček (zatím statická hodnota) */}
        <View className="flex flex-row items-center">
          <Image
            source={icons.heart}
            className="size-5"
            tintColor={"#C31034"} // primární červená barva
          />
          <Text className="text-black text-sm font-quicksand-medium ml-2">
            120
          </Text>
        </View>

        {/* Datum vytvoření recenze ve formátu např. „Mon May 12 2025“ */}
        <Text className="text-zinc-600 text-sm font-quicksand">
          {new Date(item.$createdAt).toDateString()}
        </Text>
      </View>
    </View>
  );
};

export default Comment;
