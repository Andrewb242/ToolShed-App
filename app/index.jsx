import { Text, View } from 'react-native'
import { Redirect } from 'expo-router'
import { StatusBar } from 'expo-status-bar'


export default function App() {
  return (
    <View>
      <StatusBar style="light" translucent={true}/>
      <Redirect href='/jobs'/>
    </View>
  );
}
