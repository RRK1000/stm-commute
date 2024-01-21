import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import UserProfile from './profile/UserProfile';
import Cards from './cards/Cards';

const Dashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState('My Cards');

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
    };

    return (
        <View style={styles.container}>
            {/* <Text style={styles.heading}>Dashboard</Text> */}
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'My Cards' && styles.activeTab]}
                    onPress={() => handleTabChange('My Cards')}
                >
                    <Text style={styles.tabText}>My Cards</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'My Profile' && styles.activeTab]}
                    onPress={() => handleTabChange('My Profile')}
                >
                    <Text style={styles.tabText}>My Profile</Text>
                </TouchableOpacity>
            </View>
            {activeTab === 'My Cards' && (
                <View>
                    {/* Render My Cards components here */}
                    <Cards/>
                </View>
            )}
            {activeTab === 'My Profile' && (
                <View>
                    {/* Render My Profile components here */}
                    <Text>My Profile</Text>
                    <UserProfile/> 
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#009EE0',
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    tabContainer: {
        flexDirection: 'row',
        anchorContent: 'bottom',
    },
    tab: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginRight: 10,
        borderRadius: 5,
        backgroundColor: '#ccc',
    },
    activeTab: {
        backgroundColor: 'blue',
    },
    tabText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default Dashboard;
