import React from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

const JobsLayout = () => {
  return (
    <>
    <StatusBar style="light" translucent={true}/>
    <Stack>
      <Stack.Screen name='jobs' options={{headerShown: false}}/>
      <Stack.Screen name='jobDisplay' options={{headerShown: false}}/>
    </Stack>
    </>
  )
}

export default JobsLayout