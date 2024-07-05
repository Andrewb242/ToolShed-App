import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import React, { useCallback, useState } from 'react'
import { getAllData, purgeData } from '../../storage/json-storage-functions'
import { useRouter } from 'expo-router'
import { useFocusEffect } from '@react-navigation/native'


const truckData = [
  {
    truckName: 'My Truck',
    turckEquipment: ['Hammer', 'Weedwacker']
  }
]

const myDay = () => {

  const [todaysJobs, setTodaysJobs] = useState([])
  const [todaysEquipment, setTodaysEquipment] = useState([])
  const [allEquipment, setAllEquipment] = useState([])
  const [truckData, setTruckData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const router = useRouter()

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true)
      const allData = await getAllData()
      const today = new Date().toISOString().split('T')[0]
      const jobsForToday = allData.jobs.filter(job => job.jobDate === today)
      const equipmentForToday = []
      jobsForToday.forEach(job => {
        job.jobEquipment.forEach(item => {
          if (!equipmentForToday.includes(item)) {
            equipmentForToday.push(item)
          }
        })
      })
      setTodaysJobs(jobsForToday)
      setTodaysEquipment(equipmentForToday)
      setAllEquipment(allData.equipment)
      setTruckData(allData.trucks)
    } catch (error) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useFocusEffect(
    useCallback(() => {
      fetchData()
    }, [fetchData])
  )

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    )
  }

  if (error) {
    return <Text>Error: {error}</Text>
  }

  return (
    <ScrollView style={styles.container}>
    <View>
      <View>
        <Text>Today's Jobs</Text>
        {todaysJobs && todaysJobs.length > 0 ? (
          todaysJobs.map((job, index) => (
            <View key={index}>
              <TouchableOpacity onPress={() => {
                router.navigate({
                  pathname: '/(jobs)/jobDisplay',
                  params: {
                    jobId: index + 1,
                  }
                })
              }}>
                <Text>{job.jobName}</Text>
                <Text>{job.jobAddress}</Text>
              </TouchableOpacity>
            </View>
          ))
        ):(null)}
      </View>
      <View>
        <Text>Needed Equipment</Text>
        {todaysEquipment && todaysEquipment.length > 0 ? (
          todaysEquipment.sort().map((item, index) => (
            <View key={index}>
              <Text>{item}</Text>
            </View>
          ))
        ):(null)}
      </View>
      <View>
        <Text>My Trucks</Text>
        {truckData.map((truck, index) => (
          <View key={index}>
            <Text>{truck.truckName}</Text>
            <View>

            </View>
          </View>
        ))}
      </View>
    </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#cad2c5',
  },
})

export default myDay