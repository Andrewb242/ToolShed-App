import React, { useState, useCallback } from 'react'
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native'
import { Agenda } from 'react-native-calendars'
import { useRouter } from 'expo-router';

const equipmentData = ["Hammer", "Nails", 'Rake', 'Screw Driver', 'Lawn Mower', 'Wheel Barrow', 'Filter Mask']
const quoteData = [{ id: 1, expectedExpense: "40yd of Mulch", cost: "500" }, { id: 2, expectedExpense: "60 buckets of stones", cost: "200" }]
const billData =[{ id: 1, expectedExpense: "30yd of Mulch", cost: "400" }, { id: 2, expectedExpense: "2 buckets of stones", cost: "5" }]

const jobData = [{
  jobName: 'Example Job',
  jobAddress: '123 Main St',
  jobPhone: '(814)-555-5555',
  jobDate: '2024-06-24',
  jobEquipment: '["Hammer", "Nails", "Rake", "Screw Driver"]',
  jobNote: 'Be careful with the windows.',
  jobActive: true
}, 
{
  jobName: 'Example Job',
  jobAddress: '123 Main St',
  jobPhone: '(814)-555-5555',
  jobDate: '2024-06-24',
  jobEquipment: '["Hammer", "Nails", "Rake", "Screw Driver"]',
  jobNote: 'Be careful with the windows.',
  jobActive: true
}]


const Calender = () => {

  const [refreshing, setRefreshing] = useState(false);

  const [itemsState, setItemsState] = useState({})
  const router = useRouter()

  const timeToString = (time) => {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      loadItems({ timestamp: new Date().getTime() });
      setRefreshing(false);
    }, 2000);
  }, []);

  const loadItems = (day) => {
    const items = itemsState || {};

    setTimeout(() => {
      for (let i = -15; i < 85; i++) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000;
        const strTime = timeToString(time);

        if (!items[strTime]) {
          items[strTime] = [];

          const jobsForDay = jobData.filter(item => item.jobDate === strTime)
          jobsForDay.forEach(job => {
            items[strTime].push({
              name: job.jobName,
              height: Math.max(50, Math.floor(Math.random() * 150)),
              jobData: job,
              day: strTime
            });
          })
        }
      }

      setItemsState(items);
    }, 1000);
  };

  const renderDay = (item) => {
    return (
      <TouchableOpacity style={styles.itemContainer}
      onPress={() => {
        console.log(item.jobData)
        router.push({
          pathname: '/(jobs)/jobDisplay',
          params: {
            jobData: JSON.stringify(item.jobData),
            quoteData: JSON.stringify(quoteData),
            equipmentData: JSON.stringify(equipmentData),
            billData: JSON.stringify(billData),
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