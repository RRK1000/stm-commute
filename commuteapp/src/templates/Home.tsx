import * as React from 'react';
import { Text, View } from 'react-native';
import { useAuth0, Auth0Provider } from 'react-native-auth0';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Dashboard from './dashboard/Dashboard';
import UserProfile from './dashboard/profile/UserProfile';
import { Button } from 'react-native-elements';
import LoginButton from './login/Login';

function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Dashboard />
    </View>
  );
}

function Profile() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <UserProfile />
    </View>
  );
}

const Tab = createBottomTabNavigator();

export default function Home() {
  const [isAuth, setIsAuth] = React.useState(false);


    const onPress = async () => {
        try {
            await authorize();
            console.log("Authenticated!")
        } catch (e) {
            console.log(e);
        }
    };

  return (
    <Auth0Provider domain={"dev-00koxu7a0rd8crlg.us.auth0.com"} clientId={"xDBcV4UsghX8xbTbCguS7NQY8NNJpjhG"}>
      {!isAuth ?
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>STM - Commute</Text>
          <LoginButton fn={setIsAuth} />

        </View>
        :
        <NavigationContainer independent={true}>
          <Tab.Navigator>
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Profile" component={Profile} />
          </Tab.Navigator>
        </NavigationContainer>
      }
    </Auth0Provider>
  )
}