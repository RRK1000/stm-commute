import { useAuth0, Auth0Provider } from 'react-native-auth0';
import { Text, View } from 'react-native';
import { Button } from 'react-native-elements';

const Login = () => {
    return (
      <Auth0Provider domain={"dev-00koxu7a0rd8crlg.us.auth0.com"} clientId={"xDBcV4UsghX8xbTbCguS7NQY8NNJpjhG"}>
        {
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>STM - Commute</Text>
            <LoginButton />
        </View>
        }
      </Auth0Provider>
    );
  };

  const LoginButton = () => {
    const {authorize} = useAuth0();

    const onPress = async () => {
        try {
            await authorize();
        } catch (e) {
            console.log(e);
        }
    };
    return (
        <Button onPress={onPress} title="Sign In" /> 
    );
}

export default Login;
