import { View, Text, ScrollView } from 'react-native'
import { Link } from 'expo-router'
import React from 'react'

//Data on job by job id
const jobData = {
  jobName: 'Example Job',
  jobAddress: '123 Main St',
  jobPhone: '(814)-555-5555',
  jobDate: '2024/06/20',
  jobEquipment: '["Hammer", "Nails", "Rake", "Screw Driver"]',
  jobNote: 'Be careful with the windows.',
  jobActive: true
};

//All Equipment in inventory
const equipmentData = ["Hammer", "Nails", 'Rake', 'Screw Driver', 'Lawn Mower', 'Wheel Barrow', 'Filter Mask']

const quoteData = [{ id: 1, expectedExpense: "40yd of Mulch", cost: "500" }, { id: 2, expectedExpense: "60 buckets of stones", cost: "200" } ]

const Jobs = () => {
  return (
      <View>
        <ScrollView>
          <Link href={{pathname:'jobDisplay', params: {
            jobData: JSON.stringify(jobData),
            quoteData: JSON.stringify(quoteData),
            equipmentData: JSON.stringify(equipmentData)
            }}}>Test Job</Link>
          <Text>Job 2</Text>
          <Text>Job 3</Text>
        </ScrollView>
      </View>
  )
}

export default Jobs