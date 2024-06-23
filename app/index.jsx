import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import { Redirect } from 'expo-router';

export default function App() {
  return (
    <View>
      <StatusBar style="auto" />
      <Redirect href='/jobs'/>
    </View>
  );
}
