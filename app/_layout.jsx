
import { Stack } from 'expo-router'
import { View } from 'react-native'
import { StatusBar } from 'expo-status-bar'

const RootLayout = () => {
    
    return (
        <>
            <View style={{flex: 1}}>
                <Stack>
                    <Stack.Screen name="index" options={{headerShown: false}}/>
                    <Stack.Screen name='(tabs)' options={{headerShown: false}}/>
                </Stack>
            </View>
            <View style={{
                position:'absolute',
                backgroundColor: '#2f3e46',
                height: 60,
                width: '100%',
                top: 0,
            }}
            />
            <View style={{
                position:'absolute',
                backgroundColor: '#2f3e46',
                height: 50,
                width: '100%',
                bottom: 0,
            }}
            />
            <StatusBar style="light" />
        </>
    )
}

export default RootLayout
