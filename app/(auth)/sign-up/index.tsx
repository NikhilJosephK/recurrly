import { useAuth, useSignUp } from "@clerk/expo";
import "../../../global.css";
import { AuthBrandHeader } from "@/components/auth/AuthBrandHeader";
import { AuthField } from "@/components/auth/AuthField";
import { AuthScreen } from "@/components/auth/AuthScreen";
import { finalizeAuthNavigation } from "@/lib/auth-navigation";
import {
  isValidEmail,
  meetsPasswordPolicy,
  MIN_PASSWORD_LENGTH,
} from "@/lib/auth-validation";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  View,
} from "react-native";
import { styled } from "nativewind";

const StyledPressable = styled(Pressable);

export default function SignUpScreen() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();
  const { signUp, errors, fetchStatus } = useSignUp();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");

  const [localEmailError, setLocalEmailError] = useState<string | undefined>();
  const [localPasswordError, setLocalPasswordError] = useState<
    string | undefined
  >();

  const busy = fetchStatus === "fetching";

  const passwordFormValid =
    isValidEmail(emailAddress) &&
    meetsPasswordPolicy(password) &&
    !localEmailError &&
    !localPasswordError;

  function validateFields(): boolean {
    let ok = true;
    if (!isValidEmail(emailAddress)) {
      setLocalEmailError("Enter a valid email address.");
      ok = false;
    } else {
      setLocalEmailError(undefined);
    }
    if (!meetsPasswordPolicy(password)) {
      setLocalPasswordError(
        `Use at least ${MIN_PASSWORD_LENGTH} characters.`
      );
      ok = false;
    } else {
      setLocalPasswordError(undefined);
    }
    return ok;
  }

  async function handleSubmit() {
    if (!signUp || !validateFields()) return;

    const { error } = await signUp.password({
      emailAddress: emailAddress.trim(),
      password,
    });

    if (error) {
      return;
    }

    await signUp.verifications.sendEmailCode();
  }

  async function handleVerify() {
    if (!signUp) return;

    await signUp.verifications.verifyEmailCode({
      code: code.trim(),
    });

    if (signUp.status === "complete") {
      await signUp.finalize({
        navigate: ({ session, decorateUrl }) => {
          finalizeAuthNavigation(decorateUrl, router, session);
        },
      });
    }
  }

  if (!isLoaded || !signUp) {
    return (
      <View className="auth-screen items-center justify-center bg-background">
        <ActivityIndicator color="#ea7a53" size="large" />
      </View>
    );
  }

  if (signUp.status === "complete" || isSignedIn) {
    return null;
  }

  if (
    signUp.status === "missing_requirements" &&
    signUp.unverifiedFields.includes("email_address") &&
    signUp.missingFields.length === 0
  ) {
    return (
      <AuthScreen>
        <AuthBrandHeader
          title="Confirm your email"
          subtitle="Enter the code we sent you so we know this inbox belongs to you."
        />
        <View className="auth-card">
          <AuthField
            label="Verification code"
            placeholder="Enter the code from your email"
            value={code}
            onChangeText={setCode}
            keyboardType="number-pad"
            autoCapitalize="none"
            error={errors.fields?.code?.message}
          />
          <StyledPressable
            className={`auth-button ${busy || !code.trim() ? "auth-button-disabled" : ""}`}
            disabled={busy || !code.trim()}
            onPress={() => void handleVerify()}
          >
            <Text className="auth-button-text">Continue</Text>
          </StyledPressable>
          <StyledPressable
            className="auth-secondary-button mt-2"
            disabled={busy}
            onPress={() => void signUp.verifications.sendEmailCode()}
          >
            <Text className="auth-secondary-button-text">
              Resend code
            </Text>
          </StyledPressable>
        </View>
      </AuthScreen>
    );
  }

  return (
    <AuthScreen>
      <AuthBrandHeader
        title="Create your account"
        subtitle="Join thousands of people who stay ahead of renewals with Recurly."
      />

      <View className="auth-card">
        <View className="auth-form">
          <AuthField
            label="Email"
            placeholder="Enter your email"
            value={emailAddress}
            onChangeText={(t) => {
              setEmailAddress(t);
              setLocalEmailError(undefined);
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            textContentType="emailAddress"
            error={localEmailError ?? errors.fields?.emailAddress?.message}
          />

          <AuthField
            label="Password"
            placeholder="Create a strong password"
            value={password}
            onChangeText={(t) => {
              setPassword(t);
              setLocalPasswordError(undefined);
            }}
            secureTextEntry
            autoComplete="new-password"
            textContentType="newPassword"
            error={localPasswordError ?? errors.fields?.password?.message}
          />

          <Text className="auth-helper text-center">
            By continuing you agree to keep your subscription data accurate.
            You can export or delete your account anytime from Settings.
          </Text>

          <StyledPressable
            className={`auth-button ${busy || !passwordFormValid ? "auth-button-disabled" : ""}`}
            disabled={busy || !passwordFormValid}
            onPress={() => void handleSubmit()}
          >
            <Text className="auth-button-text">Create account</Text>
          </StyledPressable>

          <View nativeID="clerk-captcha" />
        </View>
      </View>

      <View className="auth-link-row">
        <Text className="auth-link-copy">Already on Recurly?</Text>
        <StyledPressable hitSlop={8} onPress={() => router.push("/sign-in")}>
          <Text className="auth-link">Sign in</Text>
        </StyledPressable>
      </View>
    </AuthScreen>
  );
}
