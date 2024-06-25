import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { Feather } from '@expo/vector-icons';

const CustomTable = ({ rowState, updateRow, addRow, deleteRow, copyToClipboard, isBill=false }) => {

  const renderRow = ({ item }) => (
    <View style={styles.row}>
      <TextInput
        style={styles.input}
        placeholder={!isBill ? 'Expected Expense' : 'Expense'}
        value={item.expectedExpense}
        onChangeText={(text) => updateRow(item.id, 'expectedExpense', text)}
      />
      <TextInput
        style={styles.costInupt}
        placeholder="Cost"
        value={item.cost}
        onChangeText={(text) => updateRow(item.id, 'cost', text)}
        keyboardType='numeric'
      />
      <TouchableOpacity onPress={() => deleteRow(item.id)}>
        <Feather name="x-circle" size={24} color="#354f52" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={rowState}
        renderItem={renderRow}
        keyExtractor={item => item.id.toString()}
        nestedScrollEnabled={true}
        ListFooterComponent={
        <View style={styles.footerContainer}>
            <TouchableOpacity style={styles.addButton} onPress={addRow}>
                <Text style={styles.footerText}>Add Row</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={copyToClipboard}>
                <Text style={styles.footerText}>Copy</Text>
            </TouchableOpacity>
        </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#354f52',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#354f52',
    padding: 8,
    marginRight: 10,
    color: '#52796f',
  },
  costInupt: {
    borderWidth: 1,
    borderColor: '#354f52',
    padding: 8,
    marginRight: 10,
    color: '#52796f',
  },
  iconPlaceholder: {
    width: 24,
  },
  footerContainer:{
    flexDirection: 'row',
    marginTop:10,
    justifyContent: 'space-evenly',
    alignItems: 'center'
  },
  addButton: {
  },
  copyButton: {
  },
  footerText: {
    color: '#84a98c', 
    fontWeight: 200,
    borderWidth: 1,
    padding: 5,
    borderColor: '#2f3e46'
  }
});

export default CustomTable;
