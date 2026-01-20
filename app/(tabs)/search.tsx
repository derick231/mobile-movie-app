import MovieCard from "@/Components/MovieCard";
import SearchBar from "@/Components/SearchBar";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { fetchMovies } from "@/Services/api";
import { updateSearchCount } from "@/Services/appwrite";
import useFetch from "@/Services/useFetch";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, Text, View } from "react-native";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: movies,
    loading,
    error,
    refetch: loadMovies,
    reset,
  } = useFetch(
    () =>
      fetchMovies({
        query: searchQuery,
      }),
    false, // 🔴 disable auto fetch
  );

  /* ---------------------------------- */
  /* 🔹 Debounced Search */
  /* ---------------------------------- */
  useEffect(() => {
    const timeOutId = setTimeout(async () => {
      if (searchQuery.trim()) {
        await loadMovies();
      } else {
        reset();
      }
    }, 500);

    return () => clearTimeout(timeOutId);
  }, [searchQuery]);

  /* ---------------------------------- */
  /* 🔹 Log search AFTER movies load */
  /* ---------------------------------- */
  useEffect(() => {
    if (movies?.length > 0 && movies?.[0]) {
      updateSearchCount(searchQuery, movies[0]);
    }
  }, [movies]);

  /* ---------------------------------- */
  /* 🔹 Optimized renderItem */
  /* ---------------------------------- */

  return (
    <View className="bg-primary flex-1">
      <Image
        source={images.bg}
        className="absolute w-full h-full z-0"
        resizeMode="cover"
      />

      <FlatList
        data={movies ?? []}
        renderItem={({ item }) => <MovieCard {...item} />}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={{
          justifyContent: "center",
          gap: 16,
          marginVertical: 16,
        }}
        contentContainerStyle={{ paddingBottom: 100 }}
        className="px-5"
        ListHeaderComponent={
          <>
            <View className="mt-20 w-full flex-row justify-center items-center">
              <Image source={icons.logo} className="h-10 w-12" />
            </View>

            <View className="my-10">
              <SearchBar
                placeholder="Search movies..."
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            {!loading && !error && searchQuery.trim() && movies?.length > 0 && (
              <Text className="text-white">
                Search results for{" "}
                <Text className="text-accent">{searchQuery}</Text>
              </Text>
            )}
          </>
        }
        ListEmptyComponent={
          !loading && !error ? (
            <View className="mt-10 px-5">
              <Text className="text-center text-gray-500">
                {searchQuery.trim() ? "No movies found" : "Search for a movie"}
              </Text>
            </View>
          ) : null
        }
      />

      {/* 🔹 Overlay loader (no flicker) */}
      {loading && (
        <View className="absolute inset-0 items-center justify-center bg-black/20">
          <ActivityIndicator size="large" />
        </View>
      )}

      {error && (
        <Text className="absolute bottom-5 text-red-500 self-center">
          {error.message}
        </Text>
      )}
    </View>
  );
};

export default Search;
