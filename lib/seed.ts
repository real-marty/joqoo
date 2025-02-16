import { ID } from "react-native-appwrite";
import { databases, appwrite } from "./appwrite";
import {
  agentImages,
  galleryImages,
  propertiesImages,
  reviewImages,
} from "./data";

const COLLECTIONS = {
  AGENT: appwrite.agentsCollectionId,
  REVIEWS: appwrite.reviewsCollectionId,
  GALLERY: appwrite.galleriesCollectionId,
  PROPERTY: appwrite.propertiesCollectionId,
};

const propertyTypes = [
  "Dům",
  "Řadový dům",
  "Kondominium",
  "Duplex",
  "Studio",
  "Vila",
  "Byt",
  "Jiné",
];

const facilities = [
  "Prádelna",
  "Parkoviště",
  "Sportovní centrum",
  "Příbory",
  "Posilovna",
  "Bazén",
  "Wi‑Fi",
  "Centrum pro domácí mazlíčky",
];
function getRandomSubset<T>(
  array: T[],
  minItems: number,
  maxItems: number,
): T[] {
  if (minItems > maxItems) {
    throw new Error("minItems cannot be greater than maxItems");
  }
  if (minItems < 0 || maxItems > array.length) {
    throw new Error(
      "minItems or maxItems are out of valid range for the array",
    );
  }

  // Generate a random size for the subset within the range [minItems, maxItems]
  const subsetSize =
    Math.floor(Math.random() * (maxItems - minItems + 1)) + minItems;

  // Create a copy of the array to avoid modifying the original
  const arrayCopy = [...array];

  // Shuffle the array copy using Fisher-Yates algorithm
  for (let i = arrayCopy.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [arrayCopy[i], arrayCopy[randomIndex]] = [
      arrayCopy[randomIndex],
      arrayCopy[i],
    ];
  }

  // Return the first `subsetSize` elements of the shuffled array
  return arrayCopy.slice(0, subsetSize);
}

async function seed() {
  try {
    // Clear existing data from all collections
    for (const key in COLLECTIONS) {
      const collectionId = COLLECTIONS[key as keyof typeof COLLECTIONS];
      console.log(`Listing documents in collection: ${collectionId}`);
      const documents = await databases.listDocuments(
        appwrite.databaseId,
        collectionId,
      );
      console.log(`Found ${documents.documents.length} documents.`);
      for (const doc of documents.documents) {
        console.log(`Deleting document with ID: ${doc.$id}`);
        await databases.deleteDocument(
          appwrite.databaseId,
          collectionId,
          doc.$id,
        );
        console.log(`Deleted document with ID: ${doc.$id}`);
      }
      console.log(`Finished deleting documents in collection: ${collectionId}`);
    }

    console.log("Cleared all existing data.");

    // Seed Agents
    const agents = [];
    for (let i = 1; i <= 5; i++) {
      console.log(`Creating agent ${i}`);
      const agent = await databases.createDocument(
        appwrite.databaseId,
        COLLECTIONS.AGENT,
        ID.unique(),
        {
          name: `Prodejce ${i}`,
          email: `prodejce${i}@example.com`,
          avatar: agentImages[Math.floor(Math.random() * agentImages.length)],
        },
      );
      console.log(`Created agent ${i} with ID: ${agent.$id}`);
      agents.push(agent);
    }
    console.log(`Seeded ${agents.length} agents.`);

    // Seed Reviews
    const reviews = [];
    for (let i = 1; i <= 20; i++) {
      const review = await databases.createDocument(
        appwrite.databaseId,
        COLLECTIONS.REVIEWS,
        ID.unique(),
        {
          name: `Recenzent ${i}`,
          avatar: reviewImages[Math.floor(Math.random() * reviewImages.length)],
          review: `Toto je recenze od recenzenta ${i}.`,
          rating: Math.floor(Math.random() * 5) + 1, // Rating between 1 and 5
        },
      );
      reviews.push(review);
    }
    console.log(`Seeded ${reviews.length} reviews.`);

    // Seed Galleries
    const galleries = [];
    for (const image of galleryImages) {
      const gallery = await databases.createDocument(
        appwrite.databaseId,
        COLLECTIONS.GALLERY,
        ID.unique(),
        { image },
      );
      galleries.push(gallery);
    }

    console.log(`Seeded ${galleries.length} galleries.`);

    // Seed Properties
    for (let i = 1; i <= 20; i++) {
      const assignedAgent = agents[Math.floor(Math.random() * agents.length)];

      const assignedReviews = getRandomSubset(reviews, 5, 7); // 5 to 7 reviews
      const assignedGalleries = getRandomSubset(galleries, 3, 8); // 3 to 8 galleries

      const selectedFacilities = facilities
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.floor(Math.random() * facilities.length) + 1);

      const image =
        propertiesImages.length - 1 >= i
          ? propertiesImages[i]
          : propertiesImages[
              Math.floor(Math.random() * propertiesImages.length)
            ];

      const property = await databases.createDocument(
        appwrite.databaseId,
        COLLECTIONS.PROPERTY,
        ID.unique(),
        {
          name: `Nemovitost ${i}`,
          type: propertyTypes[Math.floor(Math.random() * propertyTypes.length)],
          description: `Toto je popis nemovitosti ${i}.`,
          address: `Ulice Nemovitosti 123, Město ${i}`,
          geolocation: `192.168.1.${i}, 192.168.1.${i}`,
          price: Math.floor(Math.random() * 9000) + 1000,
          area: Math.floor(Math.random() * 3000) + 500,
          bedrooms: Math.floor(Math.random() * 5) + 1,
          bathrooms: Math.floor(Math.random() * 5) + 1,
          rating: Math.floor(Math.random() * 5) + 1,
          facilities: selectedFacilities,
          image: image,
          agent: assignedAgent.$id,
          reviews: assignedReviews.map((review) => review.$id),
          gallery: assignedGalleries.map((gallery) => gallery.$id),
        },
      );

      console.log(`Seeded property: ${property.name}`);
    }

    console.log("Data seeding completed.");
  } catch (error) {
    console.error("Error seeding data:", error);
  }
}

export default seed;
