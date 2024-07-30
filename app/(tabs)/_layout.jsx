import { View, Text, Image, StyleSheet } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

import icons from '../../constants/icons'
import { SafeAreaView } from 'react-native-safe-area-context'

const TabIcon = ({ icon, color, name, focused}) => {

    const iconStyles = StyleSheet.create({
        iconText: {
            color: color,
            fontSize: 12
        },
        iconTextFocused: {
            fontWeight: 'bold'
        }
    })
    
    return (
        <View
        style={{
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2
        }}
        >
            <Image
                source={icon}
                tintColor={color}
                style={{width: 30, height: 30, marginBottom: 3,}}
            />
            <Text style={StyleSheet.compose(iconStyles.iconText, focused && iconStyles.iconTextFocused)}>
                {name}
            </Text>
        </View>
    )
}


const TabsLayout = () => {
  return (
    <>
    <StatusBar style="light" translucent={true}/>
    <SafeAreaView style={{flex:1}}>
        <Tabs
            options={{
                headerShown: false
            }}
            screenOptions={{
            tabBarShowLabel: false,
            tabBarActiveTintColor: '#84a98c',
            tabBarInactiveTintColor: '#52796f',
            tabBarStyle: {
                backgroundColor: '#2f3e46',
                borderTopWidth: 1,
                borderTopColor: '#2f3e46',
                height: 90,
                paddingTop: 20
            },
        }}
        >
            <Tabs.Screen 
                name='(jobs)'
                options={{
                    title: 'Jobs',
                    headerShown: false,
                    tabBarIcon: ({ color, focused}) => (
                        <TabIcon
                            icon={icons.dig}
                            color={color}
                            name="Jobs"
                            focused={focused}
                        />
                    )
                }}
            />
            <Tabs.Screen 
                name='calendar'
                options={{
                    title: 'Calendar',
                    headerShown: false,
                    tabBarIcon: ({ color, focused}) => (
                        <TabIcon
                            icon={icons.calendar}
                            color={color}
                            name="Calendar"
                            focused={focused}
                        />
                    )
                }}
            />
            <Tabs.Screen 
                name='myDay'
                options={{
                    title: 'My Day',
                    headerShown: false,
                    tabBarIcon: ({ color, focused}) => (
                        <TabIcon
                            icon={icons.list}
                            color={color}
                            name="My Day"
                            focused={focused}
                        />
                    )
                }}
            />
            <Tabs.Screen 
                name='inventory'
                options={{
                    title: 'Inventory',
                    headerShown: false,
                    tabBarIcon: ({ color, focused}) => (
                        <TabIcon
                            icon={icons.inventory}
                            color={color}
                            name="Inventory"
                            focused={focused}
                        />
                    )
                }}
            />
        </Tabs>
    </SafeAreaView>
    </>
  )
  
}

export default TabsLayout