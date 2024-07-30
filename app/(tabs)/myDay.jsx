import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal } from 'react-native'
import React, { useCallback, useState, useEffect } from 'react'
import { getAllData, addTruck, deleteTruck, addTruckEquipment, deleteTruckEquipment, getJobsSorted, getJobsByDay } from '../../storage/json-storage-functions'
import { useRouter } from 'expo-router'
import { useFocusEffect } from '@react-navigation/native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Feather, Ionicons } from '@expo/vector-icons';
import EquipmentTag from '../../components/EquipmentTag'


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
  const [equipmentPickerOpen, setEquipmentPickerOpen] = useState(false)
  const [selectedTruck, setSelectedTruck] = useState('')
  const [filteredEquipmentData, setFilteredEquipmentData] = useState([])


  const router = useRouter()

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true)
      const allData = await getAllData()
      const today = new Date().toISOString().split('T')[0]
      const jobsForToday = await getJobsByDay(today)
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

  useEffect(() => {
    if (allEquipment && truckData) {
      const truckEquipmentSet = new Set(
        truckData.flatMap(truck => truck.truckEquipment)
      )
  
      const equipmentFiltered = allEquipment.filter(
        item => !truckEquipmentSet.has(item)
      )
  
      setFilteredEquipmentData(equipmentFiltered)
    }
  }, [allEquipment, truckData])

  const handleAddTruck = () => {
    Alert.prompt(
      "Enter Text", // Title
      "Please enter some text", // Message
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "OK",
          onPress: async (text) => {
            try {
              await addTruck(text)
              await fetchData()
            } catch (error) {
              Alert.alert('Tuck Already Exists', 'Choose a unique truck name')
            }
          }
        }
      ],
      "plain-text", // Type of input
      "", // Default text value
      "default" // Keyboard type
    )
  }

  const handleDeleteTruck = (truckName) => {
    Alert.alert(
      "Confirm Delete",
      `You are about to delete the truck: ${truckName}`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { text: "Confirm",
          onPress: async () => {
            try {
              await deleteTruck(truckName)
              await fetchData()
            } catch (error) {
              throw new Error(error)
            }
          } }
      ],
      { cancelable: false }
    )
  }

  const handleEquipmentAdd = async (equipmentItem) => {
    try {
      await addTruckEquipment(selectedTruck, equipmentItem)
      await fetchData()
      setEquipmentPickerOpen(false)
    } catch (error) {
      throw new Error(error)
    }
  }

  const handleEquipmentDelete = async (equipmentItem, truckName) => {
    try {
      await deleteTruckEquipment(truckName, equipmentItem)
      await fetchData()
    } catch (error) {
      throw new Error(error)
    }
  }

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
      <Text style={styles.headerText}>Today's Jobs</Text>
      <View style={styles.jobsContainer}>
        {todaysJobs && todaysJobs.length > 0 ? (
          todaysJobs.map((job, index) => (
            <View style={styles.jobContiner} key={index}>
              <TouchableOpacity style={styles.jobButton} onPress={() => {
                router.navigate({
                  pathname: '/(jobs)/jobDisplay',
                  params: {
                    jobId: job.jobId,
                  }
                })
              }}>
                <Text style={styles.jobNameText}>{job.jobName}</Text>
                <Text style={styles.jobAddressText}>{job.jobAddress || 'No Address Listed'}</Text>
              </TouchableOpacity>
            </View>
          ))
        ):(
          <View style={styles.jobsContainer}>
            <Text style={styles.noJobsText}>No jobs for today!</Text>
          </View>
        )}
      </View>

      <View style={styles.equipmentContainer}>
        <Text style={styles.headerText}>Needed Equipment</Text>
        <View style={styles.equipmentListContainer}>
          {todaysEquipment && todaysEquipment.length > 0 ? (
            todaysEquipment.sort().map((item, index) => (
              <View key={index}>
                <Text style={[styles.equipmentText, !filteredEquipmentData.includes(item) && styles.equipmentReadyText]}>{item}</Text>
              </View>
            ))
          ):(
            <View>
              <Text style={styles.equipmentText}>None</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.trucksContainer}>
        <Text style={styles.headerText}>My Trucks</Text>
        {truckData.map((truck, index) => (
          <View style={styles.truckContainer} key={index}>
            <View style={styles.truckHeaderContainer}>
              <Text style={styles.truckHeaderText}>{truck.truckName}</Text>
              <TouchableOpacity onPress={() => {handleDeleteTruck(truck.truckName)}}>
                <MaterialCommunityIcons style={{paddingRight: 10}}name="delete" size={22} color="#cad2c5" />
              </TouchableOpacity>
            </View>
            <View style={{flexDirection: 'row', padding: 15, flexWrap: 'wrap', gap: 7}}>
              {truck.truckEquipment && truck.truckEquipment.length > 0 ? (truck.truckEquipment.sort().map((equipmentItem, key)=>(
                <EquipmentTag 
                  key={key}
                  equipmentName={equipmentItem} 
                  handlePress={() => handleEquipmentDelete(equipmentItem, truck.truckName)}
                />
              ), [])):(
                null
              )}
              <View style={styles.equipmentPickerButton}>
                <TouchableOpacity onPress={()=>{
                  setSelectedTruck(truck.truckName)
                  setEquipmentPickerOpen(true)
                  }}>
                  <Ionicons name="add-circle-outline" size={22} color="#cad2c5"/>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
        <TouchableOpacity style={styles.createButton} onPress={handleAddTruck}>
          <Text style={styles.buttonText}>Create Truck</Text>
        </TouchableOpacity>
      </View>
    </View>

    <Modal animationType='slide' transparent={true} visible={equipmentPickerOpen}>
      <View style={modalStyles.centeredView}>
        <View style={modalStyles.modalView}>
          <ScrollView style={{}}>
            <View style={modalStyles.equipmentTagView}>
            {filteredEquipmentData && filteredEquipmentData.length > 0 ? (filteredEquipmentData.sort().map((equipmentItem, index)=>(
              <EquipmentTag 
                key={index}
                equipmentName={equipmentItem} 
                handlePress={() => handleEquipmentAdd(equipmentItem)}
                isDelete={false}
                />
                ), [])):(
                  null
                )}
            </View>
          </ScrollView>
          <TouchableOpacity onPress={() => {setEquipmentPickerOpen(false)}}>
            <Text style={{color: '#cad2c5'}}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>

    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#cad2c5',
  },
  headerText: {
    fontSize: 20,
    paddingTop: 10,
    marginLeft: 15,
    color: '#2f3e46',
    fontWeight: '600'
  },
  jobsContainer: {
    margin: 20,
    backgroundColor: '#52796f',
    padding: 10,
    justifyContent: 'center',
    borderRadius: 5,
  },
  jobContainer: {
    alignItems: 'center',
  },
  noJobsText: {
    color: '#cad2c5',
    fontSize: 22,
  },
  jobButton: {
    backgroundColor: '#354f52',
    marginVertical: 5,
    alignItems: 'center',
    padding: 10,
    borderStyle: 'solid',
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#cad2c5',
  },
  jobNameText: {
    color: '#cad2c5',
    fontSize: 16
  },
  jobAddressText: {
    color: '#cad2c5',
    fontSize: 14
  },
  equipmentListContainer: {
    margin: 20,
    borderRadius: 7,
  },
  equipmentText: {
    color: '#cad2c5',
    fontSize: 18,
    padding: 5,
    borderStyle: 'solid',
    borderRadius: 1,
    borderWidth: 2,
    borderColor: '#354f52',
    backgroundColor: '#354f52'
  },
  equipmentReadyText: {
    color: '#84a98c',
    textDecorationStyle: 'solid',
    textDecorationLine: 'line-through',
    backgroundColor: '#52796f',
    borderColor: '#354f52',
  },
  truckContainer: {
    margin: 20,
    backgroundColor: '#354f52',
    borderRadius: 2
  },
  truckHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  truckHeaderText: {
    color: '#cad2c5',
    fontSize: 18,
    padding: 5,
    paddingLeft: 12
  },
  createButton: {
    margin: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#52796f',
    padding: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: '#cad2c5',
    fontSize: 18,
  },
  equipmentPickerButton: {
    flexDirection: 'row',
    gap: 5,
    paddingHorizontal: 7,
    paddingVertical: 5,
    borderRadius: '50%', 
    alignSelf: 'flex-start', 
    alignItems: 'center', 
    justifyContent: 'center',
    backgroundColor: '#52796f',
    marginTop: 2,
  },
})

const modalStyles = StyleSheet.create({
  centeredView: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: '#2f3e46',
    borderRadius: 20,
    width: '90%',
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  equipmentTagView: {
    padding: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7, 
    minHeight: 350, 
    backgroundColor: '#354f52', 
    minWidth: 300,
    borderRadius: 20,
    marginBottom: 10
  }
})
export default myDay