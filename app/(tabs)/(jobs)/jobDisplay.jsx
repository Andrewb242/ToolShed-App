import { View, Text, TextInput, TouchableWithoutFeedback, Keyboard, TouchableOpacity, Modal, StyleSheet, ScrollView, FlatList, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, useNavigation, Link } from 'expo-router'
import { FontAwesome6 } from '@expo/vector-icons';
import DatePicker, { getToday, getFormatedDate} from 'react-native-modern-datepicker'
import EquipmentTag from '../../../components/EquipmentTag';
import { Feather, Ionicons } from '@expo/vector-icons';
import CustomTable from '../../../components/CustomTable';
import * as Clipboard from 'expo-clipboard'

const JobDisplay = () => {

  // Text input focus handling
  const [addressIsFocused, setAddressIsFocused] = useState(false)
  const [phoneIsFocused, setPhoneIsFocused] = useState(false)
  const [noteIsFocused, setNoteIsFocused] = useState(false)

  // Parsing input data
  const { jobData, quoteData, billData, equipmentData } = useLocalSearchParams()

  const job = jobData ? JSON.parse(jobData) : {}
  const quotes = quoteData ? JSON.parse(quoteData) : []
  const bills = billData ? JSON.parse(billData) : []
  const equipment = equipmentData ? JSON.parse(equipmentData) : []

  const [jobDataState, setJobDataState] = useState({
    jobName: job?.jobName,
    jobAddress: job?.jobAddress,
    jobPhone: job?.jobPhone,
    jobDate: job?.jobDate,
    jobEquipment: job.jobEquipment? JSON.parse(job.jobEquipment).sort():[],
    jobNote: job?.jobNote,
    jobActive: job?.jobActive,
  })

  const formatPhoneNumber = (number) => {
    const cleaned = ('' + number).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
    if (match) {
      const part1 = match[1] ? `(${match[1]}` : '';
      const part2 = match[2] ? `)-${match[2]}` : '';
      const part3 = match[3] ? `-${match[3]}` : '';
      return `${part1}${part2}${part3}`;
    }
    return number;
  }
  

  //Datepicker logic
  const [datePickerOpen, setDatePickerOpen] = useState(false)
  const today = new Date()
  const startDate = getFormatedDate(today.setDate(today.getDate()), 'YYYY/MM/DD')
  function formatDate(date) {
    date = date.split('/')
    return date[1] + '/' + date[2] + '/' + date[0]
  }
  
  //Navbar effects

  const navigation = useNavigation()

  useEffect(() => {
    navigation.setOptions({
      title: jobDataState.jobName || 'Job Details',
      headerStyle: {
        backgroundColor: '#52796f',
      },
      headerTintColor: '#fefae0',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    });
  }, [navigation, jobDataState.jobName]);
  
  
  //Equipment handling
  const [equipmentPickerOpen, setEquipmentPickerOpen] = useState(false)
  function handleEquipmentDelete(equipmentItem) {
    const equipment = jobDataState.jobEquipment.filter(item => item !== equipmentItem);
    setJobDataState({...jobDataState, jobEquipment: equipment})
  }
  const filteredEquipmentData = equipment.filter(item => !jobDataState.jobEquipment.includes(item))
  function handleEquipmentAdd (equipmentItem) {
    setJobDataState({...jobDataState, jobEquipment: [...jobDataState.jobEquipment, equipmentItem]})
  }

  // Quote table handling
  const [quoteRows, setQuoteRows] = useState(quotes)
  const addQuoteRow = () => {
    setQuoteRows([...quoteRows, { id: quoteRows.length + 1, expectedExpense: '', cost: '' }]);
  };
  const deleteQuoteRow = (id) => {
    const filteredRows = quoteRows.filter(row => row.id !== id);
    const reassignedRows = filteredRows.map((row, index) => ({
    ...row,
    id: index + 1
  }));
  setQuoteRows(reassignedRows);
  }
  const updateQuoteRow = (id, key, value) => {
    const updatedRows = quoteRows.map(row => {
      if (row.id === id) {
        return { ...row, [key]: value }
      }
      return row;
    });
    setQuoteRows(updatedRows)
  }

  async function copyQuoteToClipboard() {
    let copyData = ['Here is your quote information:']
    let total = 0
    for (const element of quoteRows) {
      if (element.expectedExpense) {
        copyData = [...copyData, `${element.expectedExpense}: $${element.cost}`]
        total += parseFloat(element.cost)
      }
    }
    copyData.push(`Total: $${total}`)
    const clipboardContent = copyData.join('\n')
    if (copyData.length > 2) {
      Clipboard.setStringAsync(clipboardContent)
      Alert.alert('Copied')
    } else {
      Alert.alert('No Data')
    }
  }

  // Bill table handling
  const [billRows, setBillRows] = useState(bills)
  const addBillRow = () => {
    setBillRows([...billRows, { id: billRows.length + 1, expectedExpense: '', cost: '' }]);
  };
  const deleteBillRow = (id) => {
    const filteredRows = billRows.filter(row => row.id !== id);
    const reassignedRows = filteredRows.map((row, index) => ({
    ...row,
    id: index + 1
  }));
  setBillRows(reassignedRows);
  }
  const updateBillRow = (id, key, value) => {
    const updatedRows = billRows.map(row => {
      if (row.id === id) {
        return { ...row, [key]: value }
      }
      return row;
    });
    setBillRows(updatedRows)
  }

  async function copyBillToClipboard() {
    let copyData = ['Here is your bill information:']
    let total = 0
    for (const element of billRows) {
      if (element.expectedExpense) {
        copyData = [...copyData, `${element.expectedExpense}: $${element.cost}`]
        total += parseFloat(element.cost)
      }
    }
    copyData.push(`Total: $${total}`)
    const clipboardContent = copyData.join('\n')
    if (copyData.length > 2) {
      Clipboard.setStringAsync(clipboardContent)
      Alert.alert('Copied')
    } else {
      Alert.alert('No Data')
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <ScrollView style={{flex: 1, backgroundColor: '#cad2c5'}}>
      <View>
        <Text style={styles.headerText}>Address:</Text>
        <TextInput 
          value={jobDataState.jobAddress} 
          onChangeText={(e) => {setJobDataState({...jobDataState, jobAddress: e})}}
          placeholder='Enter an Address'
          placeholderTextColor='#84a98c'
          selectTextOnFocus={true}
          onFocus={()=>{setAddressIsFocused(true)}}
          onBlur={()=>{setAddressIsFocused(false)}}
          style={StyleSheet.compose(styles.textInput, addressIsFocused && styles.textInputFucused)}
        />
        
        <Text style={styles.headerText}>Phone Number:</Text>
        <TextInput 
          value={jobDataState.jobPhone} 
          onChangeText={(e) => {
            const formattedNumber = formatPhoneNumber(e)
            if (formattedNumber.length <= 14) {
              setJobDataState({...jobDataState, jobPhone: formattedNumber})
            }
          }}
          placeholder='Enter a Phone Number'
          placeholderTextColor='#84a98c'
          selectTextOnFocus={true}
          onFocus={()=>{setPhoneIsFocused(true)}}
          onBlur={()=>{setPhoneIsFocused(false)}}
          style={StyleSheet.compose(styles.textInput, phoneIsFocused && styles.textInputFucused)}
          keyboardType='phone-pad'
        />
        
        <Text style={styles.headerText}>Scheduled Date:</Text>
        <View
        style={styles.dateTextInput}>
          <TextInput
            value={formatDate(jobDataState.jobDate)}
            editable={false}
            placeholder='No Date Selected'
            placeholderTextColor='#e9edc9'
            style={{
              color: '#354f52',
            }}
          />
          <TouchableOpacity onPress={() => {setDatePickerOpen(!datePickerOpen)}}>
            <FontAwesome6 name="edit" size={22} color="#2f3e46" />
          </TouchableOpacity>
        </View>
        <Modal animationType='slide' transparent={true} visible={datePickerOpen}>
          <View style={modalStyles.centeredView}>
            <View style={modalStyles.modalView}>
              <DatePicker
              mode='calendar'
              selected={jobDataState.jobDate}
              onDateChange={(date) => {setJobDataState({...jobDataState, jobDate: date})}}
              minimumDate={startDate}
              options={{
                backgroundColor: '#2f3e46',
                textHeaderColor: '#84a98c',
                textDefaultColor: '#cad2c5',
                mainColor: '#84a98c',
                selectedTextColor: '#354f52',
                textSecondaryColor: '#52796f'
              }}
              />
              <TouchableOpacity onPress={() => {setDatePickerOpen(false)}}>
                <Text style={{color: '#cad2c5', paddingTop: 5}}>Close</Text>
              </TouchableOpacity>
            </View>
            
          </View>
        </Modal>


        <Text style={styles.headerText}>Equipment Needed:</Text>
        <View style={{flexDirection: 'row', padding: 15, flexWrap: 'wrap', gap: 7}}>
          {jobDataState.jobEquipment && jobDataState.jobEquipment.length > 0 ? (jobDataState.jobEquipment.sort().map((equipmentItem, index)=>(
            <EquipmentTag 
              key={index}
              equipmentName={equipmentItem} 
              handlePress={() => handleEquipmentDelete(equipmentItem)}
            />
          ), [])):(
            null
          )}
          <View style={styles.equipmentPickerButton}>
            <TouchableOpacity onPress={()=>{setEquipmentPickerOpen(true)}}>
              <Ionicons name="add-circle-outline" size={22} color="#cad2c5"/>
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
        
        <Text style={styles.headerText}>Note:</Text>
        <TextInput
          style={StyleSheet.compose(styles.textInputNote, noteIsFocused && styles.textInputFucused)}
          value={jobDataState.jobNote} 
          onFocus={()=>{setNoteIsFocused(true)}}
          onBlur={()=>{setNoteIsFocused(false)}}
          onChangeText={(e) => {setJobDataState({...jobDataState, jobNote: e})}}
          multiline={true}
          numberOfLines={3}
         />
      </View>
      
      <View>
        <Text style={styles.headerText}>Quote:</Text>
        <CustomTable 
        rowState={quoteRows}
        addRow={addQuoteRow}
        deleteRow={deleteQuoteRow}
        updateRow={updateQuoteRow}
        copyToClipboard={copyQuoteToClipboard}
        />
      </View>

      <View>
        <Text style={styles.headerText}>Bill:</Text>
        <CustomTable 
        rowState={billRows}
        addRow={addBillRow}
        deleteRow={deleteBillRow}
        updateRow={updateBillRow}
        copyToClipboard={copyBillToClipboard}
        isBill={true}
        />
      </View>

      <View style={{marginTop:50}}>
        {jobDataState.jobActive ? (
          <TouchableOpacity activeOpacity={0.7}  onPress={() => {setJobDataState({...jobDataState, jobActive: false})}}>
            <Text>Archive</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity activeOpacity={0.7} onPress={() => {setJobDataState({...jobDataState, jobActive: true})}}>
            <Text>Activate</Text>
          </TouchableOpacity>
        )}
      </View>

      <View>
        <TouchableOpacity>
          <Text>Delete</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  textInput: {
    color: '#354f52',
    backgroundColor: '#cad2c5',
    borderColor: '#354f52',
    borderWidth: 2,
    borderRadius: '50%',
    padding: 10,
    minWidth: 250,
    alignSelf: 'flex-start',
    marginLeft: 15,
    marginTop: 10,
    marginBottom:5,
    flexWrap: 'wrap',
  },
  dateTextInput:{
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    backgroundColor: '#cad2c5',
    borderColor: '#354f52',
    borderWidth: 2,
    borderRadius: 15,
    alignSelf: 'flex-start',
    padding: 7,
    marginTop: 10,
    marginLeft: 15,    
  },
  textInputNote: {
    color: '#354f52',
    backgroundColor: '#cad2c5',
    borderColor: '#354f52',
    borderWidth: 2,
    borderRadius: '5%',
    padding: 10,
    minWidth: 360,
    maxWidth: 360,
    minHeight: 120,
    alignSelf: 'flex-start',
    marginLeft: 15,
    marginTop: 10,
    marginBottom:5,
    flexWrap: 'wrap',
  },
  textInputFucused: {
    borderColor: '#84a98c',
  },
  headerText: {
    fontSize: 20,
    paddingTop: 10,
    marginLeft: 15,
    color: '#2f3e46',
    fontWeight: '600'
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
  }
)


export default JobDisplay