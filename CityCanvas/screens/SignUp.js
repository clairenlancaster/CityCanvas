import {
  Text,
  SafeAreaView,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebaseConfig';
import {
  doc,
  setDoc,
  getDoc,
  query,
  collection,
  where,
  writeBatch,
} from 'firebase/firestore';
import uuid from 'react-native-uuid';

const SignupSchema = Yup.object({
  firstName: Yup.string()
    .min(2, 'Too short')
    .max(20, 'Too long')
    .required('Required'),
  lastName: Yup.string()
    .min(2, 'Too short')
    .max(30, 'Too long')
    .required('Required'),
  username: Yup.string()
    .min(2, 'Too short')
    .max(20, 'Too long')
    .required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string()
    .min(8, 'Too short')
    .max(20, 'Too long')
    .required('Required')
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
      'Must include at least one letter, one number and one special character'
    ),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Required'),
});

const SignUp = () => {
  const register = (firstName, lastName, username, email, password) => {
    const batch = writeBatch(db);
    const userData = { firstName, lastName, username, email };
    const docRef = doc(db, 'usernames', username);

    const checkUsernamePromise = getDoc(docRef).then((snapShot) => {
      if (snapShot.exists()) {
        Alert.alert('username already exists');
      } else {
        console.log("doc doesn't exist");
      }
    });

    const createUserPromise = createUserWithEmailAndPassword(
      auth,
      email,
      password
    ).then(() => {
      console.log('user created');
    });

    return Promise.all([checkUsernamePromise, createUserPromise]).then(() => {
      console.log("we're here");
      console.log(userData, '<userData');
      const writeUsers = doc(db, 'users');
      const writeUsernames = doc(db, 'usernames');

      batch.set(writeUsers, userData);
      batch.set(writeUsernames, { username: userData.username });
      batch.commit();
    });

    // .catch((error) => {
    //   console.log(error, '<error');
    //   Alert.alert('oops, email already exists');
    // });
  };

  // const createUser = async (firstName, lastName, username, email) => {
  //   const docSnap = await getDoc(docRef);
  // };

  return (
    <SafeAreaView>
      <Text>SignUp</Text>
      <Formik
        initialValues={{
          firstName: '',
          lastName: '',
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
        }}
        validationSchema={SignupSchema}
        onSubmit={({
          firstName,
          lastName,
          username,
          email,
          password,
          confirmPassword,
        }) => {
          register(firstName, lastName, username, email, password);
        }}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          onBlur,
          values,
          errors,
          touched,
        }) => (
          <View>
            <View>
              <TextInput
                placeholder="first name"
                value={values.firstName}
                onChangeText={handleChange('firstName')}
                onBlur={handleBlur('firstName')}
                autoCapitalize="none"
              />
              {errors.firstName && touched.firstName && (
                <View>
                  <Text>{errors.firstName}</Text>
                </View>
              )}
            </View>
            <View>
              <TextInput
                placeholder="last name"
                value={values.lastName}
                onChangeText={handleChange('lastName')}
                onBlur={handleBlur('lastName')}
                autoCapitalize="none"
              />
              {errors.lastName && touched.lastName && (
                <View>
                  <Text>{errors.lastName}</Text>
                </View>
              )}
            </View>
            <View>
              <TextInput
                placeholder="username"
                value={values.userName}
                onChangeText={handleChange('username')}
                onBlur={handleBlur('username')}
                autoCapitalize="none"
              />
              {errors.username && touched.username && (
                <View>
                  <Text>{errors.username}</Text>
                </View>
              )}
            </View>
            <View>
              <TextInput
                placeholder="email"
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                autoCapitalize="none"
              />
              {errors.email && touched.email && (
                <View>
                  <Text>{errors.email}</Text>
                </View>
              )}
            </View>
            <View>
              <TextInput
                placeholder="password"
                value={values.password}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                autoCapitalize="none"
                secureTextEntry
              />
              {errors.password && touched.password && (
                <View>
                  <Text>{errors.password}</Text>
                </View>
              )}
            </View>
            <View>
              <TextInput
                placeholder="confirm password"
                value={values.confirmPassword}
                onChangeText={handleChange('confirmPassword')}
                onBlur={handleBlur('confirmPassword')}
                autoCapitalize="none"
                secureTextEntry
              />
              {errors.confirmPassword && touched.confirmPassword && (
                <View>
                  <Text>{errors.confirmPassword}</Text>
                </View>
              )}
            </View>
            <TouchableOpacity onPress={handleSubmit}>
              <Text>Sign up</Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>
    </SafeAreaView>
  );
};

export default SignUp;
