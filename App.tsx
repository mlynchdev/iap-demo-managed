import * as InAppPurchases from 'expo-in-app-purchases'

import {
    Button,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'
import React, { useEffect } from 'react'

import { StatusBar } from 'expo-status-bar'

const items = Platform.select({
    ios: ['ec'],
    android: [''],
})

export default function App() {
    const [result, setResult] = React.useState<
        InAppPurchases.IAPItemDetails[] | null
    >(null)
    const [isConnected, setIsConnected] = React.useState(false)
    const [isCancelled, setIsCancelled] = React.useState(false)

    useEffect(() => {
        if (!isConnected) {
            connect()
        }
        InAppPurchases.setPurchaseListener(
            ({ responseCode, results, errorCode }) => {
                // Purchase was successful
                if (responseCode === InAppPurchases.IAPResponseCode.OK) {
                    results.forEach((purchase) => {
                        if (!purchase.acknowledged) {
                            console.log(
                                `Successfully purchased ${purchase.productId}`,
                            )
                            // Process transaction here and unlock content...

                            // Then when you're done
                            InAppPurchases.finishTransactionAsync(
                                purchase,
                                true,
                            )
                        }
                    })
                } else if (
                    responseCode ===
                    InAppPurchases.IAPResponseCode.USER_CANCELED
                ) {
                    console.log('User canceled the transaction')
                    setIsCancelled(true)
                    return
                } else if (
                    responseCode === InAppPurchases.IAPResponseCode.DEFERRED
                ) {
                    console.log(
                        'User does not have permissions to buy but requested parental approval (iOS only)',
                    )
                } else {
                    console.warn(
                        `Something went wrong with the purchase. Received errorCode ${errorCode}`,
                    )
                }
            },
        )
    }, [])

    const connect = async () => {
        await InAppPurchases.connectAsync()
            .then(() => {
                setIsConnected(true)
                console.log('CONNECTED')
            })
            .catch((err) => {
                console.log('is err', err)
            })
    }

    const handlePress = () => {
        getProducts()
    }
    const getProducts = async () => {
        const { responseCode, results } = await InAppPurchases.getProductsAsync(
            items!,
        )
        if (responseCode === InAppPurchases.IAPResponseCode.OK) {
            console.log('products be gotten')
            setResult(results)
        } else {
            console.log('no products')
            return []
        }
    }

    const killConnect = () => {
        InAppPurchases.disconnectAsync().then(() => {
            setIsConnected(false)
            console.log('disconnected')
        })
    }
    const buyStuff = async () => {
        await InAppPurchases.purchaseItemAsync('ec', 'test')
        // .then(() => {
        //     if (isCancelled) return
        //     console.log('purchased')
        // })
        // .catch((err) => {
        //     console.log('err', err)
        // })
    }
    return (
        <View style={styles.container}>
            <Text>
                {isConnected ? `You are connected` : `You are disconnected`}
            </Text>
            <Button title='Get Products' onPress={handlePress} />
            <Button title='Kill Connection' onPress={killConnect} />
            <Button
                disabled={isConnected}
                title='ReConnect'
                onPress={connect}
            />
            <Text>{result && result[0].price}</Text>
            <Text>{result && result[0].description}</Text>
            <TouchableOpacity
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#233468',
                    height: 60,
                    width: 250,
                    borderRadius: 30,
                }}
                onPress={buyStuff}>
                <Text
                    style={{
                        fontSize: 32,
                        color: '#fff',
                        fontWeight: 'bold',
                        paddingVertical: 10,
                        marginVertical: 10,
                    }}>
                    Buy Now!
                </Text>
            </TouchableOpacity>

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
