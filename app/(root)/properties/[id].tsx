import {
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Platform,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import icons from "@/constants/icons";
import images from "@/constants/images";
import Comment from "@/components/comment";
import { facilities } from "@/constants/data";

import { useAppwrite } from "@/hooks/use-appwrite";
import { getPropertyById } from "@/lib/appwrite";

/**
 * Výchozí komponenta pro zobrazení detailu nemovitosti.
 * Používá hook useLocalSearchParams pro získání ID nemovitosti z URL.
 * Načítá data nemovitosti přes Appwrite a zobrazuje různé sekce.
 */
const Property = () => {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const windowHeight = Dimensions.get("window").height;

  const { data: property } = useAppwrite({
    fn: getPropertyById,
    params: { id: id! },
  });

  console.log(property);

  if (!property) {
    // Zatímco čekáme na data, můžeme zobrazit prázdné View nebo indikátor načítání
    return null;
  }

  return (
    <View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-32 bg-white"
      >
        {/* Sekce hlavičky s obrázkem a ovládacími prvky */}
        <HeaderSection
          imageUri={property?.image}
          windowHeight={windowHeight}
          onBack={() => router.back()}
        />

        {/* Hlavní obsah */}
        <ContentSection property={property} />
      </ScrollView>

      {/* Dolní akční panel */}
      <FooterSection
        price={property.price}
        onBook={() => {
          /* logika rezervace */
        }}
      />
    </View>
  );
};

/**
 * Prop typu HeaderSection.
 * @property imageUri - URL hlavního obrázku nemovitosti.
 * @property windowHeight - Výška obrazovky pro výpočet rozměru obrázku.
 * @property onBack - Callback pro akci zpět.
 */
interface HeaderSectionProps {
  imageUri: string;
  windowHeight: number;
  onBack: () => void;
}

/**
 * Komponenta hlavičky s obrázkem nemovitosti a ovládacími tlačítky (zpět, srdíčko, odeslat).
 */
const HeaderSection = ({
  imageUri,
  windowHeight,
  onBack,
}: HeaderSectionProps) => (
  <View className="relative w-full" style={{ height: windowHeight / 2 }}>
    <Image
      source={{ uri: imageUri }}
      className="size-full"
      resizeMode="cover"
    />
    <Image
      source={images.whiteGradient}
      className="absolute top-0 w-full z-40"
    />

    <View
      className="z-50 absolute inset-x-7"
      style={{ top: Platform.OS === "ios" ? 70 : 20 }}
    >
      <View className="flex flex-row items-center w-full justify-between">
        <TouchableOpacity
          onPress={onBack}
          className="flex flex-row bg-primary-500 rounded-full size-11 items-center justify-center"
        >
          <Image
            source={icons.backArrow}
            className="size-5"
            tintColor="#ffffff"
          />
        </TouchableOpacity>

        <View className="flex flex-row items-center gap-3">
          <Image
            source={icons.heart}
            className="size-7"
            tintColor={"#191D31"}
          />
          <Image source={icons.send} className="size-7" />
        </View>
      </View>
    </View>
  </View>
);

/**
 * Prop typu ContentSection.
 * @property property - Objektní data nemovitosti získaná z API.
 */
interface ContentSectionProps {
  property: any;
}

/**
 * Komponenta, která seskupuje všechny dílčí sekce obsahu detailu nemovitosti.
 */
const ContentSection = ({ property }: ContentSectionProps) => (
  <View className="px-5 mt-7 flex gap-2">
    <TitleAndRatingSection
      name={property.name}
      type={property.type}
      rating={property.rating}
      reviewsCount={property.reviews?.length}
    />
    <RoomStatsSection
      bedrooms={property.bedrooms}
      bathrooms={property.bathrooms}
      area={property.area}
    />
    <AgentSection agent={property.agent} />
    <OverviewSection description={property.description} />
    <FacilitiesSection facilityKeys={property.facilities} />
    {property.gallery?.length > 0 && (
      <GallerySection gallery={property.gallery} />
    )}
    <LocationSection address={property.address} />
    {property.reviews?.length > 0 && (
      <ReviewsSection rating={property.rating} reviews={property.reviews} />
    )}
  </View>
);

/**
 * Prop typu TitleAndRatingSection.
 * @property name - Název nemovitosti.
 * @property type - Typ nemovitosti (např. Apartment).
 * @property rating - Průměrné hodnocení.
 * @property reviewsCount - Počet hodnocení.
 */
interface TitleAndRatingSectionProps {
  name: string;
  type: string;
  rating: number;
  reviewsCount: number;
}

/**
 * Komponenta pro zobrazení názvu nemovitosti, typu a hodnocení.
 */
const TitleAndRatingSection = ({
  name,
  type,
  rating,
  reviewsCount,
}: TitleAndRatingSectionProps) => (
  <>
    <Text className="text-2xl font-quicksand-bold">{name}</Text>
    <View className="flex flex-row items-center gap-3">
      <View className="flex flex-row items-center px-4 py-2 bg-primary-500 rounded-full">
        <Text className="text-xs font-quicksand-bold text-primary-50">
          {type}
        </Text>
      </View>
      <View className="flex flex-row items-center gap-2">
        <Image source={icons.star} className="size-5" />
        <Text className="text-zinc-700 text-sm mt-1 font-quicksand-medium">
          {rating} ({reviewsCount} Hodnocení)
        </Text>
      </View>
    </View>
  </>
);

/**
 * Prop typu RoomStatsSection.
 * @property bedrooms - Počet ložnic.
 * @property bathrooms - Počet koupelen.
 * @property area - Plocha v sqft.
 */
interface RoomStatsSectionProps {
  bedrooms: number;
  bathrooms: number;
  area: number;
}

/**
 * Komponenta pro zobrazení statistik místností (ložnice, koupelny, plocha).
 */
const RoomStatsSection = ({
  bedrooms,
  bathrooms,
  area,
}: RoomStatsSectionProps) => (
  <View className="flex flex-row items-center mt-5">
    <StatItem icon={icons.bed} value={`${bedrooms} Beds`} />
    <StatItem
      icon={icons.bath}
      value={`${bathrooms} Baths`}
      style={{ marginLeft: 28 }}
    />
    <StatItem
      icon={icons.area}
      value={`${area} sqft`}
      style={{ marginLeft: 28 }}
    />
  </View>
);

/**
 * Prop typu StatItem.
 * @property icon - Zdroj ikony.
 * @property value - Textová hodnota.
 * @property style - Dodatečné styly View.
 */
interface StatItemProps {
  icon: any;
  value: string;
  style?: object;
}

/**
 * Jednotlivá položka statistiky (ikona + text).
 */
const StatItem = ({ icon, value, style }: StatItemProps) => (
  <View className="flex flex-row items-center" style={style}>
    <View className="flex flex-row items-center justify-center bg-primary-500 rounded-full size-10">
      <Image source={icon} className="size-6" tintColor="#fde8eb" />
    </View>
    <Text className="text-black text-sm font-quicksand-medium ml-2">
      {value}
    </Text>
  </View>
);

/**
 * Prop typu AgentSection.
 * @property agent - Objekt obsahující jméno, email a avatar agenta.
 */
interface AgentSectionProps {
  agent: { name: string; email: string; avatar: string };
}

/**
 * Komponenta pro zobrazení informací o agentovi.
 */
const AgentSection = ({ agent }: AgentSectionProps) => (
  <View className="w-full border-t border-primary-300 pt-7 mt-5">
    <Text className="text-black text-xl font-quicksand-bold">Agent</Text>
    <View className="flex flex-row items-center justify-between mt-4">
      <View className="flex flex-row items-center">
        <Image
          source={{ uri: agent.avatar }}
          className="size-14 rounded-full"
        />
        <View className="flex flex-col items-start justify-center ml-3">
          <Text className="text-lg text-black font-quicksand-bold">
            {agent.name}
          </Text>
          <Text className="text-sm text-zinc-700 font-quicksand-medium">
            {agent.email}
          </Text>
        </View>
      </View>
      <View className="flex flex-row items-center gap-3">
        <Image source={icons.chat} className="size-7" />
        <Image source={icons.phone} className="size-7" />
      </View>
    </View>
  </View>
);

/**
 * Prop typu OverviewSection.
 * @property description - Popis nemovitosti.
 */
interface OverviewSectionProps {
  description: string;
}

/**
 * Komponenta pro sekci s přehledem popisu nemovitosti.
 */
const OverviewSection = ({ description }: OverviewSectionProps) => (
  <View className="mt-7">
    <Text className="text-black text-xl font-quicksand-bold">Overview</Text>
    <Text className="text-zinc-700 text-base font-quicksand mt-2">
      {description}
    </Text>
  </View>
);

/**
 * Prop typu FacilitiesSection.
 * @property facilityKeys - Pole názvů dostupných zařízení.
 */
interface FacilitiesSectionProps {
  facilityKeys: string[];
}

/**
 * Komponenta pro zobrazení seznamu zařízení ve formě ikon a popisků.
 */
const FacilitiesSection = ({ facilityKeys }: FacilitiesSectionProps) => (
  <View className="mt-7">
    <Text className="text-black text-xl font-quicksand-bold">Vybavení</Text>
    <View className="flex flex-row flex-wrap items-start justify-start mt-2 gap-5">
      {facilityKeys.map((key, index) => {
        const facility = facilities.find((f) => f.title === key);
        return (
          <View
            key={index}
            className="flex flex-1 flex-col items-center min-w-16 max-w-20"
          >
            <View className="size-14 bg-primary-100 rounded-full flex items-center justify-center">
              <Image
                source={facility ? facility.icon : icons.info}
                className="size-6"
              />
            </View>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              className="text-black text-sm text-center font-quicksand mt-1.5"
            >
              {key}
            </Text>
          </View>
        );
      })}
    </View>
  </View>
);

/**
 * Prop typu GallerySection.
 * @property gallery - Pole objektů s obrázky galerie.
 */
interface GallerySectionProps {
  gallery: { $id: string; image: string }[];
}

/**
 * Komponenta pro zobrazení horizontální galerie obrázků.
 */
const GallerySection = ({ gallery }: GallerySectionProps) => (
  <View className="mt-7">
    <Text className="text-black text-xl font-quicksand-bold">Galerie</Text>
    <FlatList
      contentContainerStyle={{ paddingRight: 20 }}
      data={gallery}
      keyExtractor={(item) => item.$id}
      horizontal
      showsHorizontalScrollIndicator={false}
      renderItem={({ item }) => (
        <Image source={{ uri: item.image }} className="size-40 rounded-xl" />
      )}
      contentContainerClassName="flex gap-4 mt-3"
    />
  </View>
);

/**
 * Prop typu LocationSection.
 * @property address - Adresa nemovitosti.
 */
interface LocationSectionProps {
  address: string;
}

/**
 * Komponenta pro zobrazení adresy a mapy lokace nemovitosti.
 */
const LocationSection = ({ address }: LocationSectionProps) => (
  <View className="mt-7">
    <Text className="text-black text-xl font-quicksand-bold">Lokalita</Text>
    <View className="flex flex-row items-center justify-start mt-4 gap-2">
      <Image source={icons.location} className="w-7 h-7" />
      <Text className="text-zinc-700 text-sm font-quicksand-medium">
        {address}
      </Text>
    </View>
    <Image source={images.map} className="h-52 w-full mt-5 rounded-xl" />
  </View>
);

/**
 * Prop typu ReviewsSection.
 * @property rating - Průměrné hodnocení nemovitosti.
 * @property reviews - Pole recenzí k zobrazení.
 */
interface ReviewsSectionProps {
  rating: number;
  reviews: any[];
}

/**
 * Komponenta pro zobrazení přehledu recenzí a jedné ukázkové recenze.
 */
const ReviewsSection = ({ rating, reviews }: ReviewsSectionProps) => (
  <View className="mt-7">
    <View className="flex flex-row items-center justify-between">
      <View className="flex flex-row items-center">
        <Image source={icons.star} className="size-6" />
        <Text className="text-black text-xl font-quicksand-bold ml-2">
          {rating} ({reviews?.length} hodnocení)
        </Text>
      </View>
      <TouchableOpacity>
        <Text className="text-primary-300 text-base font-quicksand-bold">
          Zobrazit vše
        </Text>
      </TouchableOpacity>
    </View>
    <View className="mt-5">
      <Comment item={reviews[0]} />
    </View>
  </View>
);

/**
 * Prop typu FooterSection.
 * @property price - Cena ubytování.
 * @property onBook - Callback po stisku tlačítka rezervace.
 */
interface FooterSectionProps {
  price: number;
  onBook: () => void;
}

/**
 * Dolní komponenta s přehledem ceny a tlačítkem rezervace.
 */
const FooterSection = ({ price, onBook }: FooterSectionProps) => (
  <View className="absolute bg-white bottom-0 w-full rounded-t-2xl border-t border-r border-l border-primary-200 p-7">
    <View className="flex flex-row items-center justify-between gap-10">
      <View className="flex flex-col items-start">
        <Text className="text-zinc-700 text-xs font-quicksand-medium">
          Cena
        </Text>
        <Text
          numberOfLines={1}
          className="text-primary-500 text-start text-2xl font-quicksand-bold"
        >
          {price}€
        </Text>
      </View>
      <TouchableOpacity
        onPress={onBook}
        className="flex-1 flex flex-row items-center justify-center bg-primary-500 py-3 rounded-full shadow-md shadow-zinc-400"
      >
        <Text className="text-white text-lg text-center font-quicksand-bold">
          Rezervovat
        </Text>
      </TouchableOpacity>
    </View>
  </View>
);

export default Property;
