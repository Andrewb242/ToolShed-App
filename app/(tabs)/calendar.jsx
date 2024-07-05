import React, { useState, useCallback, useEffect } from 'react'
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native'
import { Agenda } from 'react-native-calendars'
import { useRouter } from 'expo-router'
import { getJobsSorted } from '../../storage/json-storage-functions'
import { useFocusEffect } from '@react-navigation/native'



const Calender = () => {

  const [refreshing, setRefreshing] = useState(false);
  const [itemsState, setItemsState] = useState({})

  const router = useRouter()

  const timeToString = (time) => {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
  }

  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true)
      await loadItems({ timestamp: new Date().getTime() })
    } catch (error) {
      setError(error.message)
    } finally {
      setRefreshing(false)
    }
  }, [loadItems]);

  const fetchJobs = useCallback(async () => {
    try {
      setRefreshing(true)
      const sortedJobs = await getJobsSorted()
      const activeJobs = sortedJobs[0].data
      return activeJobs
    } catch (error) {
      setError(error.message)
      return []
    } finally {
      setRefreshing(false)
    }
  }, [])

  useFocusEffect(
    useCallback(() => {
      loadItems({ timestamp: new Date().getTime() })
    }, [loadItems])
  )

  const loadItems = useCallback(async (day) => {

    setItemsState({})

    const items = itemsState || {};
    const jobs = await fetchJobs()

    for (let i = -15; i < 85; i++) {
      const time = day.timestamp + i * 24 * 60 * 60 * 1000;
      const strTime = timeToString(time)

      items[strTime] = [];

      const jobsForDay = jobs.filter(item => item.jobDate === strTime)
      jobsForDay.forEach(job => {
        items[strTime].push({
          name: job.jobName,
          height: Math.max(50, Math.floor(Math.random() * 150)),
          jobId: job.jobId,
          day: strTime
        });
      })
    }
    setItemsState(items)
    return true
  },[fetchJobs,timeToString])

  const renderDay = (item) => {
    return (
      <TouchableOpacity style={styles.itemContainer}
      onPress={() => {
        router.navigate({
          pathname: '/(jobs)/jobDisplay',
          params: {
            jobId: JSON.stringify(item.jobId),
          }
        })
      }}
      >
        <Text style={styles.itemText}>
          {item.name}
        </Text>
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.container}>
      <Agenda
        items={itemsState}
        loadItemsForMonth={loadItems}
        selected={new Date().toISOString().split('T')[0]}
        renderItem={renderDay}
        theme={calendarTheme}
        renderKnob={() => <View style={styles.knob} />}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemContainer: {
    backgroundColor: '#52796f',
    borderRadius: 20,
    margin: 5,
  },
  itemText: {
    color: '#cad2c5',
    alignSelf: 'center',
    padding: 30,
    fontSize: 20,
    fontWeight: 'bold'
  },
  knob: {
    width: 40,
    height: 5,
    backgroundColor: '#52796f',
    marginTop: 10,
    borderRadius: 5
  }
});

const calendarTheme = {
  calendarBackground: '#2f3e46',
  reservationsBackgroundColor: '#cad2c5',
  agendaTodayColor: '#84a98c',
  agendaDayTextColor: '#52796f',
  agendaDayNumColor: '#354f52',
  agendaKnobColor: '#52796f', 
  dayTextColor: '#cad2c5',
  selectedDayBackgroundColor: '#84a98c',
  selectedDayTextColor: '#354f52',
  dotColor: '#84a98c',
  monthTextColor: '#84a98c',
  textSectionTitleColor: '#52796f',
  textDisabledColor: '#A1A8A0',
  todayTextColor: '#84a98c'
};

export default Calender