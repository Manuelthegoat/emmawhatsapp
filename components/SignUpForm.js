import React, { useCallback, useEffect, useReducer, useState } from "react";
import SubmitButton from "../components/SubmitButton";
import Input from "../components/input";
import { FontAwesome, Feather } from "@expo/vector-icons";

import { validateInput } from "../utils/actions/formActions";
import { reducer } from "../utils/reducers/formReducer";
import { signUp } from "../utils/actions/authActions";
import { Alert, ActivityIndicator } from "react-native";
import colors from "../constants/colors";
import { useDispatch, useSelector } from "react-redux";

const initialState = {
  inputValues: {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  },
  inputValidities: {
    firstName: false,
    lastName: false,
    email: false,
    password: false,
  },
  formIsValid: false,
};

const SignUpForm = (props) => {
  const dispatch = useDispatch();

  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [formState, dispatchFormState] = useReducer(reducer, initialState);

  const inputChangedHandler = useCallback(
    (inputId, inputValue) => {
      const result = validateInput(inputId, inputValue);
      dispatchFormState({ inputId, validationResult: result, inputValue });
    },
    [dispatchFormState]
  );

  useEffect(() => {
    if (error) {
      Alert.alert("An Error Occured", error, [{ text: "Okay" }]);
      console.log(error)
    }
  }, [error]);

  const authHandler = useCallback(async () => {
    try {
      setIsLoading(true);
      const action = signUp(
        formState.inputValues.firstName,
        formState.inputValues.lastName,
        formState.inputValues.email,
        formState.inputValues.password
      );
      setError(null);
      await dispatch(action);
    } catch (error) {
      console.log(error);
      setError(error.message);
      setIsLoading(false);
    }
  }, [dispatch, formState]);
  return (
    <>
      <Input
        id="firstName"
        onInputChanged={inputChangedHandler}
        label="First Name"
        iconPack={FontAwesome}
        autoCapitalize="none"
        errorText={formState.inputValidities["firstName"]}
        icon="user-o"
      />
      <Input
        id="lastName"
        onInputChanged={inputChangedHandler}
        label="Last Name"
        iconPack={FontAwesome}
        autoCapitalize="none"
        errorText={formState.inputValidities["lastName"]}
        icon="user-o"
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
      />
      <Input
        id="password"
        autoCapitalize="none"
        secureTextEntry
        onInputChanged={inputChangedHandler}
        errorText={formState.inputValidities["password"]}
        label="Password"
        iconPack={Feather}
        icon="lock"
      />
      {isLoading ? (
        <ActivityIndicator
          style={{ marginTop: 10 }}
          size={"small"}
          color={colors.primary}
        />
      ) : (
        <SubmitButton
          title="Sign Up"
          style={{ marginTop: 20 }}
          disabled={!formState.formIsValid}
          onPress={authHandler}
        />
      )}
    </>
  );
};

export default SignUpForm;
