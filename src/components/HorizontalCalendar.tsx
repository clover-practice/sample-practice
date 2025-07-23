import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

const getNextDays = () => {
  const days = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    days.push({
      id: i,
      date,
      day: date.toLocaleString('default', { weekday: 'short' }), // Tue
      dateNum: date.getDate(), // 22
      month: date.toLocaleString('default', { month: 'short' }), // Apr
    });
  }

  return days;
};

const getFormattedDate = (date: Date): string => {
  const today = new Date();
  const isToday =
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();

  const day = date.getDate();
  const weekday = date.toLocaleString('default', { weekday: 'long' });
  const month = date.toLocaleString('default', { month: 'short' });
  const year = date.getFullYear();

  return `${isToday ? 'Today' : weekday
    } | ${day} ${month}, ${weekday}, ${year}`;
};

const HorizontalCalendar = () => {
  const days = getNextDays();
  const [selectedDate, setSelectedDate] = useState(days[0]);

  return (
    <View>
      <Text style={styles.label}>Select Date & Time of Appointment</Text>

      {/* Date input */}
      <View style={styles.inputBox}>
        <Text style={styles.inputText}>
          {getFormattedDate(selectedDate.date)}
        </Text>
      </View>

      {/* Calendar */}
      <FlatList
        horizontal
        data={days}
        keyExtractor={item => item.id.toString()}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 12 }}
        renderItem={({ item }) => {
          const isSelected = selectedDate.id === item.id;
          return (
            <TouchableOpacity
              style={[styles.dateItem, isSelected && styles.selectedDateItem]}
              onPress={() => setSelectedDate(item)}>
              <Text
                style={[styles.dateDay, isSelected && styles.selectedDateText]}>
                {item.day}
              </Text>
              <Text
                style={[styles.dateNum, isSelected && styles.selectedDateText]}>
                {item.dateNum}
              </Text>
              <Text
                style={[
                  styles.dateMonth,
                  isSelected && styles.selectedDateText,
                ]}>
                {item.month.toUpperCase()}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

export default HorizontalCalendar;

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  inputBox: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  inputText: {
    fontSize: 14,
    color: '#444',
  },
  dateItem: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginRight: 12,
    backgroundColor: '#f2f2f2',
  },
  selectedDateItem: {
    backgroundColor: '#000',
  },
  dateDay: {
    fontSize: 14,
    color: '#444',
    fontWeight: '600',
  },
  dateNum: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
  },
  dateMonth: {
    fontSize: 12,
    color: '#999',
  },
  selectedDateText: {
    color: '#fff',
  },
});
