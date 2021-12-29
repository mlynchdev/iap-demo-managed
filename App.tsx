import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View, Platform } from 'react-native'
import * as InAppPurchases from 'expo-in-app-purchases'
import { useEffect } from 'react'

const items = Platform.select({
  ios: ['ec'],
  android: [''],
})

export default function App() {
  useEffect(() => {
    InAppPurchases.connectAsync()
      .catch(() => {
        console.log("couldn't connect")
      })
      .then(() => {
        console.log('connected SUCCESS')
      })
    return () => {
      InAppPurchases.disconnectAsync()
    }
  }, [])

  return (
    <View style={styles.container}>
      <Text>This will be the demo!!!</Text>
      <StatusBar style='auto' />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
