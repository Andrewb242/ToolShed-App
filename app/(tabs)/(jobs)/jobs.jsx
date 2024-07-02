import { View, Text, TouchableOpacity, StyleSheet, SectionList } from 'react-native'
import { useRouter } from 'expo-router'
import React, { useState, useEffect, useCallback } from 'react'
import { getJobsSorted, createNewJob, purgeData } from '../../../storage/json-storage-functions'


const Jobs = () => {
  
  const router = useRouter()
  const [jobs, setJobs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchJobs = useCallback(async () => {
    try {
      setIsLoading(true)
      const sortedJobs = await getJobsSorted()
      setJobs(sortedJobs)
      setIsLoading(false)
    } catch (error) {
      setError(err.message)
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
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
    return <Text>Loading...</Text>
  }

  if (error) {
    return <Text>Error: {error}</Text>
  }


  return (
      <View>
        <TouchableOpacity onPress={handleCreateNewJob}>
          <Text>Create a New Job</Text>
        </TouchableOpacity>
        <SectionList
          sections={jobs.length > 0 ? jobs : [{ title: 'No Jobs', data: [] }]}
          keyExtractor={(item, index) => item.id || index.toString()}
          renderItem={renderItem}
          renderSectionHeader={({section: {title}}) => (
            <Text style={styles.header}>{title}</Text>
          )}
          ListEmptyComponent={<Text style={styles.emptyText}>No jobs found</Text>}
        />
      </View>
  )
}

const styles = StyleSheet.create({
  item: {
    padding: 20,
    marginVertical: 8,
  },
  header: {
    fontSize: 32,
    backgroundColor: "#fff"
  },
  title: {
    fontSize: 24,
  },
  emptyText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
  }

})

export default Jobs