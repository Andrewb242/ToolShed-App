import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { Feather, Ionicons } from '@expo/vector-icons';


const EquipmentTag = ({equipmentName, handlePress, isDelete = true}) => {
  return (
    <View style={styles.tagContainer}>
        <Text style={styles.tagText}>{equipmentName}</Text>
        <TouchableOpacity onPress={handlePress}>
            {isDelete ?  (
                <Feather name="x-circle" size={20} color="#cad2c5" />
                ) : (
                <Ionicons name="add-circle-outline" size={20} color="#cad2c5" />
                )
            }
        </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
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
  }
})

export default EquipmentTag