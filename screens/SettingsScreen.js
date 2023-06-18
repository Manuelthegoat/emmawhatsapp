import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import PageTitle from "../components/PageTitle";
import PageContainer from "../components/PageContainer";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { useCallback } from "react";
import { validateInput } from "../utils/actions/formActions";
import { useReducer } from "react";
import { reducer } from "../utils/reducers/formReducer";
import Input from "../components/input";
import { useDispatch, useSelector } from "react-redux";
import colors from "../constants/colors";
import SubmitButton from "../components/SubmitButton";
import {
  updateSignedInUserData,
  userLogout,
} from "../utils/actions/authActions";
import { updateLoggedInUserData } from "../store/authSlice";
import ProfileImage from "../components/ProfileImage";
import { ScrollView } from "react-native";

const SettingsScreen = (props) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const userData = useSelector((state) => state.auth.userData);
  const firstName = userData.firstName || "";
  const lastName = userData.lastName || "";
  const email = userData.email || "";
  const about = userData.about || "";
  const initialState = {
    inputValues: {
      firstName,
      lastName,
      email,
      about,
    },
    inputValidities: {
      firstName: undefined,
      lastName: undefined,
      email: undefined,
      about: undefined,
    },
    formIsValid: false,
  };
  const [formState, dispatchFormState] = useReducer(reducer, initialState);

  const inputChangedHandler = useCallback(
    (inputId, inputValue) => {
      const result = validateInput(inputId, inputValue);
      dispatchFormState({ inputId, validationResult: result, inputValue });
    },
    [dispatchFormState]
  );
  const saveHandler = useCallback(async () => {
    const updatedValues = formState.inputValues;
    try {
      setIsLoading(true);
      await updateSignedInUserData(userData.userId, updatedValues);
      dispatch(updateLoggedInUserData({ newData: updatedValues }));
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [formState, dispatch]);

  const hasChangess = () => {
    const currentValues = formState.inputValues;
    return (
      currentValues.firstName != firstName ||
      currentValues.lastName != lastName ||
      currentValues.email != email ||
      currentValues.about != about
    );
  };
  return (
    <PageContainer>
      <ScrollView contentContainerStyle={styles.formContainer}>
        <PageTitle text="Settings" />
        <ProfileImage
          showEditButton={true}
          size={80}
          uri={userData.profilePicture}
          userId={userData.userId}
        />
        <Input
          id="firstName"
          onInputChanged={inputChangedHandler}
          label="First Name"
          iconPack={FontAwesome}
          autoCapitalize="none"
          errorText={formState.inputValidities["firstName"]}
          icon="user-o"
          initialValue={userData.firstName}
        />
        <Input
          id="lastName"
          onInputChanged={inputChangedHandler}
          label="Last Name"
          iconPack={FontAwesome}
          autoCapitalize="none"
          errorText={formState.inputValidities["lastName"]}
          icon="user-o"
          initialValue={userData.lastName}
        />
        <Input
          id="email"
          onInputChanged={inputChangedHandler}
          label="Email"
          iconPack={Feather}
          autoCapitalize="none"
          errorText={formState.inputValidities["email"]}
          icon="mail"
          keyboardType="email-address"
          initialValue={userData.email}
        />
        <Input
          id="about"
          onInputChanged={inputChangedHandler}
          label="About"
          iconPack={FontAwesome}
          autoCapitalize="none"
          errorText={formState.inputValidities["about"]}
          icon="user-o"
          initialValue={userData.about}
        />
        <View style={{ marginTop: 20 }}>
          {showSuccessMessage && <Text>Saved</Text>}
          {isLoading ? (
            <ActivityIndicator
              style={{ marginTop: 10 }}
              size={"small"}
              color={colors.primary}
            />
          ) : (
            hasChangess() && (
              <SubmitButton
                title="Save"
                onPress={saveHandler}
                style={{ marginTop: 20 }}
                disabled={!formState.formIsValid}
              />
            )
          )}
        </View>
        <SubmitButton
          title="Logout"
          onPress={() => dispatch(userLogout())}
          style={{ marginTop: 20 }}
          color={colors.red}
        />
      </ScrollView>
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formContainer: {
    alignItems: "center",
  },
});

export default SettingsScreen;
