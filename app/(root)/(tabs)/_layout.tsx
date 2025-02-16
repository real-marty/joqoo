import { Image, ImageSourcePropType, Text, View } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import icons from "@/constants/icons";

const TabIcon = ({
  focused,
  icon,
  title,
}: {
  focused: boolean;
  icon: ImageSourcePropType;
  title: string;
}) => (
  <View className="flex-1 mt-2 flex flex-col items-center">
    <Image
      source={icon}
      tintColor={focused ? "#ac0d2f" : "#636363"}
      resizeMode="contain"
      className="size-7"
    />
    <Text
      className={`${
        focused
          ? "text-primary-600 font-quicksand-semibold"
          : "text-black font-quicksand-medium"
      } text-sm w-full text-center mt-1`}
    >
      {title}
    </Text>
  </View>
);

const TabsNavigation = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "white",
          borderTopColor: "#fdf4f5",
          borderTopWidth: 1,
          minHeight: 70,
          position: "absolute",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Domů",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.home} title="Domů" />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Najít",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.search} title="Najít" />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Účet",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.person} title="Účet" />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsNavigation;
