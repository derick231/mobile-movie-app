import { Client, ID, Query, TablesDB } from "react-native-appwrite";

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const TABLE_ID = process.env.EXPO_PUBLIC_APPWRITE_TABLE_ID!;

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!)
  .setPlatform("com.your.app"); // REQUIRED for React Native

const tables = new TablesDB(client);

export const updateSearchCount = async (query: string, movie: Movie) => {
  try {
    // 1️⃣ Normalize query (CRITICAL)
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return;

    // 2️⃣ Look for existing search term
    const result = await tables.listRows({
      databaseId: DATABASE_ID,
      tableId: TABLE_ID,
      queries: [Query.equal("searchTerm", normalizedQuery)],
    });

    // 3️⃣ Update existing row
    if (result.rows.length > 0) {
      const row = result.rows[0];

      await tables.updateRow({
        databaseId: DATABASE_ID,
        tableId: TABLE_ID,
        rowId: row.$id,
        data: {
          count: (row.count ?? 0) + 1,
        },
      });

      return;
    }

    // 4️⃣ Create new row
    await tables.createRow({
      databaseId: DATABASE_ID,
      tableId: TABLE_ID,
      rowId: ID.unique(),
      data: {
        searchTerm: normalizedQuery,
        movie_id: movie.id, // ensure correct type
        count: 1,
        title: movie.title,
        poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      },
    });
  } catch (error) {
    console.error("updateSearchCount error:", error);
    throw error;
  }
};
