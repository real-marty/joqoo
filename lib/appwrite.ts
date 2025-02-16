import {
  Client,
  Account,
  Avatars,
  OAuthProvider,
  Databases,
  Storage,
  Query,
} from "react-native-appwrite";
import { openAuthSessionAsync } from "expo-web-browser";
import * as Linking from "expo-linking";

export const appwrite = {
  platform: "com.joqoo.live",
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
  databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
  agentsCollectionId: process.env.EXPO_PUBLIC_APPWRITE_AGENTS_COLLECTION_ID!,
  galleriesCollectionId:
    process.env.EXPO_PUBLIC_APPWRITE_GALLERIES_COLLECTION_ID!,
  propertiesCollectionId:
    process.env.EXPO_PUBLIC_APPWRITE_PROPERTIES_COLLECTION_ID!,
  reviewsCollectionId: process.env.EXPO_PUBLIC_APPWRITE_REVIEWS_COLLECTION_ID!,
};

export const client = new Client();

client
  .setEndpoint(appwrite.endpoint)
  .setProject(appwrite.projectId)
  .setPlatform(appwrite.platform);

export const avatar = new Avatars(client);
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

export async function signLogIn() {
  try {
    const redirectURI = Linking.createURL("/");
    const response = await account.createOAuth2Token(
      OAuthProvider.Google,
      redirectURI,
    );
    if (!response) {
      throw new Error("Failed to create OAuth2 token");
    }
    const browserResult = await openAuthSessionAsync(
      response.toString(),
      redirectURI,
    );

    if (browserResult.type !== "success") {
      throw new Error("Failed to open browser");
    }

    const url = new URL(browserResult.url);

    const secret = url.searchParams.get("secret")?.toString();
    const userId = url.searchParams.get("userId")?.toString();

    if (!secret || !userId) {
      throw new Error("Failed to parse OAuth2 token");
    }

    const session = await account.createSession(userId, secret);

    if (!session) {
      throw new Error("Failed to create session");
    }

    return session;
  } catch (error) {
    console.error(error);
  }
}

export async function logout() {
  try {
    await account.deleteSession("current");
    return true;
  } catch (error) {
    console.error(error);
  }
}

export async function getCurrentUserInformation() {
  try {
    const result = await account.get();
    if (result.$id) {
      const userAvatar = avatar.getInitials(result.name);

      return {
        ...result,
        avatar: userAvatar.toString(),
      };
    }
    return null;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getLatestProperties() {
  try {
    const result = await databases.listDocuments(
      appwrite.databaseId,
      appwrite.propertiesCollectionId,
      [Query.orderAsc("$createdAt"), Query.limit(5)],
    );

    return result.documents;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getProperties({
  filter,
  query,
  limit,
}: {
  filter: string;
  query: string;
  limit?: number;
}) {
  try {
    const buildQuery = [Query.orderDesc("$createdAt")];

    if (filter && filter !== "All")
      buildQuery.push(Query.equal("type", filter));

    if (query)
      buildQuery.push(
        Query.or([
          Query.search("name", query),
          Query.search("address", query),
          Query.search("type", query),
        ]),
      );

    if (limit) buildQuery.push(Query.limit(limit));

    const result = await databases.listDocuments(
      appwrite.databaseId,
      appwrite.propertiesCollectionId,
      buildQuery,
    );

    return result.documents;
  } catch (error) {
    console.error(error);
    return [];
  }
}

// write function to get property by id
export async function getPropertyById({ id }: { id: string }) {
  try {
    const result = await databases.getDocument(
      appwrite.databaseId,
      appwrite.propertiesCollectionId,
      id,
    );
    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
}
