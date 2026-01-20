import { icons } from "@/constants/icons";
import { fetchMovieDetails } from "@/Services/api";
import useFetch from "@/Services/useFetch";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Image, ScrollView, Text, View } from "react-native";

interface InfoProps {
  label: string;
  value?: string | number | null;
}

const MovieInfo = ({ label, value }: InfoProps) => (
  <View className="flex-col items-start justify-center mt-5">
    <Text className="text-light-200 font-normal text-sm">{label}</Text>
    <Text className="text-light-100 font-bold text-sm mt-2">{value || 'N/A'}</Text>
  </View>
);

const MovieDetails = () => {
  const { id } = useLocalSearchParams();

  const { data: movie, loading } = useFetch(() =>
    fetchMovieDetails(id as string),
  );

  return (
    <View className="bg-primary flex-1">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 80,
        }}
      >
        <View>
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/w500${movie?.poster_path}`,
            }}
            className="w-full h-[550px]"
            resizeMode="stretch"
          />
        </View>

        <View className="px-5">
          <View className="flex-col gap-4 justify-center mt-5">
            <Text className="text-xl text-white">{movie?.title}</Text>

            <View className="flex-row gap-3 ">
              <Text className="text-sm text-light-200">
                {movie?.release_date.split("-")[0]}
              </Text>
              <Text className="text-light-200 text-sm">{movie?.runtime}m</Text>
            </View>

            <View className="flex-row gap-1 items-center ">
              <Image source={icons.star} className="size-4" />
              <Text className="text-white text-sm">
                {Math.round(movie?.vote_average ?? 0)}/10
              </Text>

              <Text className="text-light-200 text-sm">
                ({movie?.vote_count})
              </Text>
            </View>
          </View>

          <MovieInfo label="Overview" value={movie?.overview}/>
        </View>
      </ScrollView>
    </View>
  );
};

export default MovieDetails;
