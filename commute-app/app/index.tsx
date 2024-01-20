import { Stack } from 'expo-router';

import { Welcome } from '@/templates/Welcome';
import Dashboard from '@/templates/dashboard/Dashboard';

const Home = () => (
  <>
    <Stack.Screen
      options={{
        title: 'STM Commute App',
      }}
    />
    {/* <Welcome /> */}
    <Dashboard/>
  </>
);

export default Home;
