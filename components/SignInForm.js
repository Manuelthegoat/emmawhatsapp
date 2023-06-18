import React, { useCallback, useEffect, useReducer, useState } from "react";
import SubmitButton from "../components/SubmitButton";
import Input from "../components/input";
import { Feather } from "@expo/vector-icons";
import { validateInput } from "../utils/actions/formActions";
import { reducer } from "../utils/reducers/formReducer";
import { signIn } from "../utils/actions/authActions";
import { Alert, ActivityIndicator } from "react-native";
import { useDispatch } from "react-redux";
import colors from "../constants/colors";

const isTestMode = true

const initialState = {
  inputValues: {
    email: isTestMode ? "ellalay2022@gmail.com" : "",
    password: isTestMode ? "password" : "",
  },
  inputValidities: {
    email: isTestMode,
    password: isTestMode,
  },
  formIsValid: isTestMode,
};

const SignInForm = (props) => {
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
    }
  }, [error]);
  const authHandler = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log(formState.inputValues);
      const action = signIn(
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
        id="email"
        label="Email"
        autoCapitalize="none"
        iconPack={Feather}
        keyboardType="email-address"
        initialValue={formState.inputValues.email}
        errorText={formState.inputValidities["email"]}
        onInputChanged={inputChangedHandler}
        icon="mail"
      />
      <Input
        id="password"
        autoCapitalize="none"
        onInputChanged={inputChangedHandler}
        errorText={formState.inputValidities["password"]}
        secureTextEntry
        label="Password"
        initialValue={formState.inputValues.password}
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
          title="Sign In"
          style={{ marginTop: 20 }}
          disabled={!formState.formIsValid}
          onPress={authHandler}
        />
      )}
    </>
  );
};

export default SignInForm;
