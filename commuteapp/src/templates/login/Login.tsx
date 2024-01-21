import { useAuth0, Auth0Provider } from 'react-native-auth0';
import { Text, View, Button } from 'react-native';

const Login = () => {
    return (
      <Auth0Provider domain={"dev-jmuj1s6u16g3iiug.us.auth0.com"} clientId={"lMHrQtiBomIGFCTFxaNOl43AuMD8389V"}>
        {
        <View>
            <Text>mr worldwide mr 305</Text>
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

    return <Button onPress={onPress} title="Log in" />
}

export default Login;
