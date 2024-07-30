import { View, Text, TouchableOpacity, StyleSheet, SectionList, RefreshControl } from 'react-native'
import { useRouter } from 'expo-router'
import { useFocusEffect } from '@react-navigation/native'
import React, { useState, useCallback } from 'react'
import { getJobsSorted, createNewJob } from '../../../storage/json-storage-functions'


const Jobs = () => {
  
  const router = useRouter()
  const [jobs, setJobs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [refreshing, setRefreshing] = useState(false)

  const fetchJobs = useCallback(async () => {
    try {
      setIsLoading(true)
      const sortedJobs = await getJobsSorted()
      setJobs(sortedJobs)
    } catch (error) {
      setError(error.message)
    } finally {
      setIsLoading(false)
      setRefreshing(false)
    }
  }, [])

  useFocusEffect(
    useCallback(() => {
      fetchJobs()
    }, [fetchJobs])
  )

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    fetchJobs()
  }, [fetchJobs])


  const handleCreateNewJob = useCallback(async () => {
    try {
      await createNewJob()
      fetchJobs()
    } catch (err) {
      setError(err.message)
    }
  }, [fetchJobs])


  function renderItem({item}) {

    if (!item) return null
    return (
    <TouchableOpacity style={styles.item} 
      onPress={() => {
        router.push({pathname:'jobDisplay', params: {jobId: item.jobId}})
        }}
      >
      <Text style={styles.title}>{item.jobName}</Text>
    </TouchableOpacity>
    )
  }

  if (isLoading) {
    return( 
    <View style={styles.container}>
      <TouchableOpacity style={styles.createButton}>
          <Text style={styles.createButtonText}>Create a New Job</Text>
      </TouchableOpacity>
      <Text>Loading...</Text>
    </View>
    )
  }

  if (error) {
    return <Text>Error: {error}</Text>
  }


  return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.createButton} onPress={handleCreateNewJob}>
          <Text style={styles.createButtonText}>Create a New Job</Text>
        </TouchableOpacity>
        <SectionList
          sections={jobs.length > 0 ? jobs : [{ title: 'No Jobs', data: [] }]}
          keyExtractor={(item, index) => item.id || index.toString()}
          renderItem={renderItem}
          renderSectionHeader={({section: {title}}) => (
            <Text style={styles.header}>{title}</Text>
          )}
          ListEmptyComponent={<Text style={styles.emptyText}>No jobs found</Text>}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#cad2c5',
    flex: 1
  },
  createButton: {
    padding: 20,
    backgroundColor: '#354f52'
  },
  createButtonText: {
    fontSize: 22,
    color: '#cad2c5'
  },
  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 20,
    backgroundColor: '#84a98c'
  },
  header: {
    fontSize: 24,
    backgroundColor: "#52796f",
    color: '#cad2c5',
    padding: 5,
    paddingHorizontal: 15
  },
  title: {
    fontSize: 24,
    color: '#cad2c5'
  },
  emptyText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
  }

})

export default Jobs