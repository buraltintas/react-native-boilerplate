/**
 * Features - Animals - Screens - Detail
 */

import React from 'react';
import {View, Text, StyleSheet, ActivityIndicator, ScrollView} from 'react-native';
import {useRoute, RouteProp} from '@react-navigation/native';
import {AnimalsStackParamList, RootStackParamList} from '@navigation/types';
import {useAnimal} from '../hooks/useAnimals';

type AnimalDetailRouteProp =
  | RouteProp<AnimalsStackParamList, 'AnimalDetail'>
  | RouteProp<RootStackParamList, 'AnimalDetailModal'>;

export default function AnimalDetailScreen() {
  const route = useRoute<AnimalDetailRouteProp>();
  const {id} = route.params as {id: string};

  const {data: animal, isLoading, error} = useAnimal(id);

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error || !animal) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Failed to load animal details</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.section}>
        <Text style={styles.label}>Name</Text>
        <Text style={styles.value}>{animal.name}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Species</Text>
        <Text style={styles.value}>{animal.species}</Text>
      </View>

      {animal.breed && (
        <View style={styles.section}>
          <Text style={styles.label}>Breed</Text>
          <Text style={styles.value}>{animal.breed}</Text>
        </View>
      )}

      {animal.age && (
        <View style={styles.section}>
          <Text style={styles.label}>Age</Text>
          <Text style={styles.value}>{animal.age} years</Text>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.label}>ID</Text>
        <Text style={styles.value}>{animal.id}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
  },
  section: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  value: {
    fontSize: 16,
    color: '#000',
  },
  errorText: {
    fontSize: 16,
    color: '#ff3b30',
  },
});
