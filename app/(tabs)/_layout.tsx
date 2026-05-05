import { Tabs } from "expo-router";
import { Text, View } from "react-native";

const GREEN = "#5CBC4F";
const LIGHT_GREEN = "#DDF3D8";

function TabIcon({ icon, focused }: { icon: string; focused: boolean }) {
  return (
    <View
      style={{
        width: focused ? 64 : 40,
        height: focused ? 52 : 40,
        borderRadius: 32,
        backgroundColor: focused ? LIGHT_GREEN : "transparent",
        alignItems: "center",
        justifyContent: "center",
        marginTop: focused ? -24 : 0,
      }}
    >
      <Text style={{ fontSize: 24, color: GREEN }}>{icon}</Text>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: GREEN,
        tabBarInactiveTintColor: GREEN,
        tabBarStyle: {
          height: 72,
          backgroundColor: "#fff",
          borderTopWidth: 0,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Huis",
          tabBarIcon: ({ focused }) => <TabIcon icon="⌂" focused={focused} />,
        }}
      />

      
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "DB",
          tabBarIcon: ({ focused }) => <TabIcon icon="▯" focused={focused} />,
        }}
      />

      <Tabs.Screen
        name="modules"
        options={{
          title: "Modules",
          tabBarIcon: ({ focused }) => <TabIcon icon="▦" focused={focused} />,
        }}
      />

      <Tabs.Screen
        name="instellingen"
        options={{
          title: "Meer",
          tabBarIcon: ({ focused }) => <TabIcon icon="⚙" focused={focused} />,
        }}
      />

      <Tabs.Screen
      name="module-preview"
      options={{
      href: null,
      headerShown: false,
       }}
      />

      <Tabs.Screen
  name="create-module"
  options={{
    href: null,
    headerShown: false,
  }}
/>

<Tabs.Screen
  name="questions"
  options={{
    href: null,
    headerShown: false,
  }}
/>

<Tabs.Screen
  name="loading"
  options={{
    href: null,
    headerShown: false,
  }}
/>
    </Tabs>
  );
}