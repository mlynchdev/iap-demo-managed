import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View, Platform, Button } from 'react-native'
import * as InAppPurchases from 'expo-in-app-purchases'
import React, { useEffect } from 'react'

const items = Platform.select({
  ios: ['1602482662'],
  android: [''],
})

export default function App() {
  const [result, setResult] = React.useState<
    InAppPurchases.IAPItemDetails[] | null
  >(null)
  const [isConnected, setIsConnected] = React.useState(false)

  useEffect(() => {
    connect()
  }, [])

  const connect = async () => {
    if (!isConnected) {
      await InAppPurchases.connectAsync()
        .catch((err) => {
          console.log('is err', err)
        })
        .then(() => {
          setIsConnected(true)
          console.log('SUCCESS')
        })
    }
    return () => {
      InAppPurchases.disconnectAsync()
    }
  }

  const handlePress = () => {
    const _result = getProducts()
  }
  const getProducts = async () => {
    const { responseCode, results } = await InAppPurchases.getProductsAsync(
      items!
    )
    if (responseCode === InAppPurchases.IAPResponseCode.OK) {
      console.log('it worked', results)
      setResult(results)
      return results
    } else {
      console.log('no products')
      return []
    }
  }

  console.log(result)
  console.log(isConnected)
  return (
    <View style={styles.container}>
      <Text>This will be the demo!!!</Text>
      <Button title='Get Products' onPress={handlePress} />
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
