import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native'
import React from 'react'
import { AntDesign } from '@expo/vector-icons'
import { useRouter } from 'expo-router'

const CustomNavbar = ({ handleOnSave }) => {

    const router = useRouter()

    const handleBackButton = () => {
         Alert.alert(
           'Confirm Cancel',
           'All edits will be undone',
           [
             {
               text: 'Cancel',
               style: 'cancel'
             },
             { text: 'Confirm', onPress: () => {router.back()} }
           ],
           { cancelable: false }
         )
     }
   
     const handleEditButton = () => {
         Alert.alert(
           'Confirm Changes',
           'All changes will be saved',
           [
             {
               text: 'Cancel',
               style: 'cancel'
             },
             { text: 'Confirm', onPress: () => {
              if (handleOnSave) {
                handleOnSave()
              }
              router.back()
             }
            }
           ],
           { cancelable: false }
         )
     }
   
     return (
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackButton}>
          <AntDesign name="left" size={20} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.editButton} onPress={handleEditButton}>
          <Text>Save</Text>
        </TouchableOpacity>
      </View>
     )
}

const styles = StyleSheet.create({
    navBar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      backgroundColor: '#84a98c'
    },
    backButton: {
      flexDirection: 'row',
      padding: 10,
    },
    editButton: {
      justifyContent: 'center',
      padding: 10,
    },
  })

export default CustomNavbar