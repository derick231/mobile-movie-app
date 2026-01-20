import { icons } from "@/constants/icons";
import React from "react";
import { Image, TextInput, View } from "react-native";

interface Props {
  onPress?: () => void;
  placeholder: string;
  value?: string
  onChangeText?: (text:string)=>void
}

const SearchBar = ({ onPress, placeholder, onChangeText,value }: Props) => {
  return (
    <View className="flex-row bg-dark-200 items-center gap-2 rounded-full ps-3">
      <Image
        source={icons.search}
        className="size-5"
        resizeMode="contain"
        tintColor="#ab8bff"
      />
      <TextInput
        onPress={onPress}
        placeholder={placeholder}
        onChangeText={onChangeText}
        placeholderTextColor="#ab8bff"
        className="flex-1 text-white"
        value={value}
      />
    </View>
  );
};

export default SearchBar;
