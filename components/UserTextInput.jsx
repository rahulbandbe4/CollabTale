import { View, Text, TextInput, StyleSheet, TouchableOpacity, Dimensions } from 'react-native'
import React, { useState } from 'react'
import Icon from 'react-native-vector-icons/FontAwesome'

const UserTextInput = ({ placeholder, isPass, value, onChangeText }) => {
    const [eyeIcon, setEyeIcon] = useState('eye');
    const [secureTextEntry, setSecureTextEntry] = useState(isPass);

    let icon = '';
    if (placeholder === "Enter your username" || placeholder === "Enter your full name") {
        icon = 'user';
    } else if (placeholder === "Enter your email") {
        icon = 'envelope';
    } else {
        icon = 'lock';
    }

    const handleSecureText = () => {
        setSecureTextEntry(!secureTextEntry);
        setEyeIcon(secureTextEntry ? 'eye-slash' : 'eye');
    }

    return (
        <View style={styles.inputContainer}>
            <Icon name={icon} size={24} color="#000000" style={styles.icon} />
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                placeholderTextColor="#A9A9A9"
                secureTextEntry={secureTextEntry}
                value={value}
                onChangeText={onChangeText}
            />

            {isPass && (
                <TouchableOpacity onPress={handleSecureText} style={{ position: 'absolute', right: 8 }}>
                    <Icon name={eyeIcon} size={24} color="#000000" />
                </TouchableOpacity>
            )}
        </View>
    )
};

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#000000',
        borderRadius: 8,
        padding: 8,
        width: Dimensions.get('window').width - 50,
    },
    icon: {
        marginRight: 8,
        width: 25
    },
    input: {
        color: '#000000',
        height: 40,
        flex: 1,
    },
});

export default UserTextInput;
