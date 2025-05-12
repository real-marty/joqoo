/*****************************************************
 * SOUBOR: featured-card.tsx
 * ---------------------------------------------------
 * Obsahuje dvě komponenty:
 *   - FeaturedCard: výrazná karta s velkým náhledem
 *   - Card: kompaktní varianta s menším náhledem
 *****************************************************/

import icons from "@/constants/icons";
import images from "@/constants/images";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { Models } from "react-native-appwrite";

/*****************************************************
 * 1. Props rozhraní
 * ---------------------------------------------------
 * - `item`: dokument z Appwrite (např. nemovitost)
 * - `onPress`: nepovinná callback funkce při kliknutí
 *****************************************************/
interface Props {
  item: Models.Document;
  onPress?: () => void;
}

/*****************************************************
 * 2. Komponenta: FeaturedCard
 * ---------------------------------------------------
 * - Velká, výrazná karta s obrázkem a informacemi
 * - Styl: tmavé sklo, kontrastní text, rating, cena
 * - Používá se např. v sekci „Doporučené nemovitosti“
 *****************************************************/
export const FeaturedCard = ({ item, onPress }: Props) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex flex-col items-start w-60 h-80 relative"
    >
      {/* Hlavní obrázek nemovitosti */}
      <Image source={{ uri: item.image }} className="size-full rounded-2xl" />

      {/* Překryvný gradient na spodní části obrázku */}
      <Image
        source={images.cardGradient}
        className="size-full rounded-2xl absolute bottom-0"
      />

      {/* Zobrazení hodnocení v pravém horním rohu */}
      <View className="flex flex-row items-center bg-black/50 backdrop-blur-md p-6 px-3 py-1.5 rounded-full absolute top-5 right-5">
        <Image source={icons.star} className="size-3.5" />
        <Text className="text-xs font-quicksand-bold text-primary-300 ml-1">
          {item.rating}
        </Text>
      </View>

      {/* Informace o nemovitosti ve spodní části karty */}
      <View className="flex flex-col items-start absolute bottom-5 inset-x-5">
        <Text
          className="text-xl font-quicksand-extrabold text-white"
          numberOfLines={1}
        >
          {item.name}
        </Text>
        <Text className="text-base font-quicksand text-white" numberOfLines={1}>
          {item.address}
        </Text>

        {/* Cena a ikona oblíbených (srdce) */}
        <View className="flex flex-row items-center justify-between w-full">
          <Text className="text-xl font-quicksand-extrabold text-white">
            {item.price}€
          </Text>
          <Image source={icons.heart} className="size-5" tintColor="#fff" />
        </View>
      </View>
    </TouchableOpacity>
  );
};

/*****************************************************
 * 3. Komponenta: Card
 * ---------------------------------------------------
 * - Menší, kompaktní karta vhodná do výpisu
 * - Obsahuje obrázek, název, adresu, cenu a hodnocení
 *****************************************************/
export const Card = ({ item, onPress }: Props) => {
  return (
    <TouchableOpacity
      className="flex-1 w-full mt-4 px-3 py-4 rounded-lg bg-white shadow-lg shadow-black-100/70 relative"
      onPress={onPress}
    >
      {/* Hodnocení v pravém horním rohu */}
      <View className="flex flex-row items-center absolute px-2 top-5 right-5 bg-black/50 backdrop-blur-md p-1 rounded-full z-50">
        <Image source={icons.star} className="size-2.5" />
        <Text className="text-xs font-quicksand-bold text-primary-300 ml-0.5">
          {item.rating}
        </Text>
      </View>

      {/* Náhledový obrázek */}
      <Image source={{ uri: item.image }} className="w-full h-40 rounded-lg" />

      {/* Textová část karty */}
      <View className="flex flex-col mt-2">
        <Text className="text-base font-quicksand-bold text-black">
          {item.name}
        </Text>
        <Text className="text-xs font-quicksand text-zinc-600">
          {item.address}
        </Text>

        {/* Cena + srdce (oblíbené) */}
        <View className="flex flex-row items-center justify-between mt-2">
          <Text className="text-base font-quicksand-bold text-primary-500">
            {item.price}€
          </Text>
          <Image
            source={icons.heart}
            className="w-5 h-5 mr-2"
            tintColor="#191D31"
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};
