import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, TouchableWithoutFeedback } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons';
import EquipmentTag from '../../components/EquipmentTag';

const equipmentData = ["Hammer", "Nails", 'Rake', 'Screw Driver', 'Lawn Mower', 'Wheel Barrow', 'Filter Mask']

const Inventory = () => {

  const [equipment, setEquipment] = useState(equipmentData)
  const [newTag, setNewTag] = useState('')

  const showDeleteAlert = (equipmentItem) => {
    Alert.alert(
      "Confirm Delete",
      `You are about to delete the tag: ${equipmentItem}`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { text: "Confirm", onPress: () => handleEquipmentDelete(equipmentItem) }
      ],
      { cancelable: false }
    );
  };


  function handleEquipmentDelete(equipmentItem) {
    const newEquipment = equipment.filter(item => item !== equipmentItem);
    setEquipment(newEquipment)
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>New Tag:</Text>
      <View style={styles.newTagContainer}>
        <View style={styles.tagContainer}>
          <TextInput style={styles.tagText} 
          placeholder='Input Equipment Name'
          placeholderTextColor='#B0B8AB'
          value={newTag}
          onChangeText={(e) => {setNewTag(e)}}
          />
          <TouchableOpacity onPress={() => {
            if (!equipment.includes(newTag)) {
              setEquipment([...equipment,newTag])
              Alert.alert('Tag Added')
              setNewTag('')
            } else {
              Alert.alert('Tags Must be Unique','\nTry to use numbers: \nExample: Shovel 1')
            }
            }}>
            <Ionicons name="add-circle-outline" size={20} color="#cad2c5" />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.headerText}>All Tags:</Text>
      <View style={styles.equipmentContainer}>
        <ScrollView style={{flex:1}}>
          <View style={styles.equipmentDataContainer}>
            {equipment && equipment.length > 0 ? (equipment.sort().map((equipmentItem, index)=>(
              <EquipmentTag 
                key={index}
                equipmentName={equipmentItem} 
                handlePress={() => showDeleteAlert(equipmentItem)}
                />
              ), [])):(
                null
              )}
          </View>
        </ScrollView>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#cad2c5',
  },
  headerText: {
    marginTop: 20,
    fontSize: 20,
    paddingTop: 10,
    marginLeft: 15,
    color: '#2f3e46',
    fontWeight: '600'
  },
  newTagContainer: {
    marginHorizontal: 15,
    marginTop: 25
  },
  tagContainer: {
    flexDirection: 'row',
    gap: 5,
    paddingHorizontal: 7,
    paddingVertical: 5,
    borderRadius: '50%', 
    alignSelf: 'flex-start', 
    alignItems: 'center', 
    justifyContent: 'center',
    backgroundColor: '#52796f',
    marginTop: 3,
  },
  tagText: {
    fontWeight:'bold', 
    fontSize: 16, 
    color: '#cad2c5'
  },
  equipmentContainer: {
    backgroundColor: '#2f3e46',
    height: 450,
    marginHorizontal: 15,
    marginTop: 15,
    borderRadius: 20,
  },
  equipmentDataContainer: {
    padding: 10,
    margin: 20,
    flex: 1,
    minHeight: 412,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7, 
    backgroundColor: '#354f52', 
    borderRadius: 20,
    marginBottom: 10
  }
})
export default Inventory