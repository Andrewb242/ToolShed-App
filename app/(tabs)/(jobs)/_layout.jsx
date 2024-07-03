import React from 'react'
import { Stack } from 'expo-router'

const JobsLayout = () => {
  return (
    <Stack>
      <Stack.Screen name='jobs' options={{headerShown: false}}/>
      <Stack.Screen name='jobDisplay' options={{headerShown: false}}/>
    </Stack>
  )
}

export default JobsLayout