import { Text, View } from 'react-native';
import { Redirect } from 'expo-router';

export default function App() {
  return (
    <View>
      <Redirect href='/jobs'/>
    </View>
  );
}
