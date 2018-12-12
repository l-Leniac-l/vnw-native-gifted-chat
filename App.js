/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from "react"
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Button,
  TextInput
} from "react-native"
import { GiftedChat } from "react-native-gifted-chat"
import firebase from "react-native-firebase"

export default class App extends Component {
  constructor(props) {
    super(props)

    this.ref = firebase.firestore().collection("chat-1")

    this.state = {
      formCompleted: false,
      user: {
        _id: undefined,
        name: undefined,
        avatar: undefined
      },
      messages: []
    }

    this.onSend = this.onSend.bind(this)
    this.completeForm = this.completeForm.bind(this)
  }

  componentDidMount() {
    this.ref.orderBy("createdAt", "desc").onSnapshot(snapshot => {
      let receivedMessages = []

      snapshot.docs.map(doc => {
        receivedMessages.push({
          _id: doc.id,
          ...doc.data()
        })
      })

      this.setState(prevState => ({
        messages: GiftedChat.append(prevState.message, receivedMessages)
      }))
    })
  }

  onSend([message]) {
    this.ref.add(message)
  }

  completeForm() {
    this.setState(prevState => ({
      formCompleted: !prevState.formCompleted
    }))
  }

  render() {
    const { formCompleted, messages, user } = this.state
    if (formCompleted) {
      return <GiftedChat messages={messages} onSend={this.onSend} user={user} />
    }

    return (
      <View>
        <Text>Form</Text>
        <TextInput
          placeholder="id"
          onChangeText={text =>
            this.setState(prevState => ({
              user: {
                ...prevState.user,
                _id: text
              }
            }))
          }
        />
        <TextInput
          placeholder="name"
          onChangeText={text =>
            this.setState(prevState => ({
              user: {
                ...prevState.user,
                name: text
              }
            }))
          }
        />
        <TextInput
          placeholder="avatar"
          onChangeText={text =>
            this.setState(prevState => ({
              user: {
                ...prevState.user,
                avatar: text
              }
            }))
          }
        />
        <Button onPress={this.completeForm} title="Complete Form" />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5
  }
})
