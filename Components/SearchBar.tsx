import { icons } from "@/constants/icons";
import React from "react";
import { Image, TextInput, View } from "react-native";

interface Props {
  onPress?: () => void;
  placeholder: string;
}

const SearchBar = ({ onPress, placeholder }: Props) => {
  return (
    <View className="flex-row bg-dark-200 items-center gap-2 rounded-full ">
      <Image
        source={icons.search}
        className="size-5"
        resizeMode="contain"
        tintColor="#ab8bff"
      />
      <TextInput
        onPress={onPress}
        placeholder={placeholder}
        value=""
        onChangeText={() => {}}
        placeholderTextColor="#ab8bff"
        className="flex-1 text-white"
      />
    </View>
  );
};

export default SearchBar;
