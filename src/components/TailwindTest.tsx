import { Text, View } from "react-native";

export default function TailwindTest() {
  return (
    <View className="w-full flex-1 items-center justify-center bg-blue-200">
      <Text className="text-white text-2xl font-bold mb-4">
        Tailwind 테스트
      </Text>
    </View>
  );
}
