import React ,{useEffect} from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GoogleSignin ,GoogleSigninButton} from '@react-native-google-signin/google-signin';


const FirstScreen = ( props) => {
console.log('hellooo',props)
  useEffect(()=>{
    GoogleSignin.configure()


  },[])
  // Somewhere in your code
  const googleLogin = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    console.log("user Info ",userInfo)
    props.navigation.navigate('SecondScreen')
  } catch (error) {

    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      // user cancelled the login flow
      console.log(error)
    } else if (error.code === statusCodes.IN_PROGRESS) {
      props.navigation.navigate('SecondScreen')
      // operation (e.g. sign in) is in progress already
      console.log(error)
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      // play services not available or outdated
      console.log(error)
    } else {
      // some other error happened
      console.log(error)
    }
  }
};
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
      }}>
        <GoogleSigninButton size={GoogleSigninButton.Size.Wide} onPress={googleLogin} />
      
    </View>
  )
};
const styles=StyleSheet.create({
  btnstyle:{
    height:46,
    paddingHorizontal:9,
    backgroundColor:"pink"

  }
})
export default FirstScreen;