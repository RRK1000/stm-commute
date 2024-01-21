import * as React from 'react';
import { Button, View } from 'react-native';
import { useAuth0, Auth0Provider } from 'react-native-auth0';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Dashboard from './dashboard/Dashboard';
import UserProfile from './dashboard/profile/UserProfile';
import Login from './login/Login';

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
  const {user} = useAuth0();

  if(user) {
    return (<NavigationContainer independent={true}>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Profile" component={Profile} />
        {/* <Tab.Screen name="Login" component={Login} /> */}
      </Tab.Navigator>
    </NavigationContainer>)
  } else 
  return <Login />
}