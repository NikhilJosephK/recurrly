import { useAuth, useSignIn } from "@clerk/expo";
import "../../global.css";
import { finalizeAuthNavigation } from "@/lib/auth-navigation";
import {
  isValidEmail,
  meetsPasswordPolicy,
  MIN_PASSWORD_LENGTH,
} from "@/lib/auth-validation";
import { AuthBrandHeader } from "@/components/auth/AuthBrandHeader";
import { AuthField } from "@/components/auth/AuthField";
import { AuthScreen } from "@/components/auth/AuthScreen";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  View,
} from "react-native";
import { styled } from "nativewind";

const StyledPressable = styled(Pressable);

type MfaMode = "sms" | "totp" | "backup";

export default function SignInScreen() {
  const router = useRouter();
  const { isLoaded } = useAuth();
  const { signIn, errors, fetchStatus } = useSignIn();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [mfaCode, setMfaCode] = useState("");
  const [mfaMode, setMfaMode] = useState<MfaMode>("totp");

  const [localEmailError, setLocalEmailError] = useState<string | undefined>();
  const [localPasswordError, setLocalPasswordError] = useState<
    string | undefined
  >();

  const busy = fetchStatus === "fetching";

  const mfaOptions = useMemo(() => {
    const list = signIn?.supportedSecondFactors ?? [];
    return {
      hasTotp: list.some((f) => f.strategy === "totp"),
      hasPhone: list.some((f) => f.strategy === "phone_code"),
      hasBackup: list.some((f) => f.strategy === "backup_code"),
    };
  }, [signIn]);

  useEffect(() => {
    if (!signIn || signIn.status !== "needs_second_factor") return;
    if (mfaOptions.hasTotp) setMfaMode("totp");
    else if (mfaOptions.hasPhone) setMfaMode("sms");
    else if (mfaOptions.hasBackup) setMfaMode("backup");
  }, [
    signIn,
    mfaOptions.hasTotp,
    mfaOptions.hasPhone,
    mfaOptions.hasBackup,
  ]);

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

  async function handlePasswordSubmit() {
    if (!signIn || !validateFields()) return;

    const { error } = await signIn.password({
      emailAddress: emailAddress.trim(),
      password,
    });

    if (error) {
      return;
    }

    if (signIn.status === "complete") {
      await signIn.finalize({
        navigate: ({ session, decorateUrl }) => {
          finalizeAuthNavigation(decorateUrl, router, session);
        },
      });
      return;
    }

    if (signIn.status === "needs_second_factor") {
      const supported = signIn.supportedSecondFactors ?? [];
      const phoneFactor = supported.find((f) => f.strategy === "phone_code");
      if (phoneFactor) {
        await signIn.mfa.sendPhoneCode().catch(() => {});
      }
      setMfaCode("");
      return;
    }

    if (signIn.status === "needs_client_trust") {
      const emailCodeFactor = signIn.supportedSecondFactors?.find(
        (factor) => factor.strategy === "email_code"
      );
      if (emailCodeFactor) {
        await signIn.mfa.sendEmailCode().catch(() => {});
      }
      setVerificationCode("");
      return;
    }
  }

  async function handleClientTrustVerify() {
    if (!signIn) return;
    await signIn.mfa.verifyEmailCode({ code: verificationCode });
    if (signIn.status === "complete") {
      await signIn.finalize({
        navigate: ({ session, decorateUrl }) => {
          finalizeAuthNavigation(decorateUrl, router, session);
        },
      });
    }
  }

  async function handleMfaVerify() {
    if (!signIn) return;

    if (mfaMode === "backup") {
      await signIn.mfa.verifyBackupCode({ code: mfaCode.trim() });
    } else if (mfaMode === "totp") {
      await signIn.mfa.verifyTOTP({ code: mfaCode.trim() });
    } else {
      await signIn.mfa.verifyPhoneCode({ code: mfaCode.trim() });
    }

    if (signIn.status === "complete") {
      await signIn.finalize({
        navigate: ({ session, decorateUrl }) => {
          finalizeAuthNavigation(decorateUrl, router, session);
        },
      });
    }
  }

  if (!isLoaded || !signIn) {
    return (
      <View className="auth-screen items-center justify-center bg-background">
        <ActivityIndicator color="#ea7a53" size="large" />
      </View>
    );
  }

  if (signIn.status === "needs_client_trust") {
    return (
      <AuthScreen>
        <AuthBrandHeader
          title="Confirm it’s you"
          subtitle="We sent a one-time code to your email to protect your Recurly account."
        />
        <View className="auth-card">
          <AuthField
            label="Verification code"
            placeholder="Enter the code from your email"
            value={verificationCode}
            onChangeText={setVerificationCode}
            keyboardType="number-pad"
            autoCapitalize="none"
            error={errors.fields?.code?.message}
          />
          <StyledPressable
            className={`auth-button ${busy ? "auth-button-disabled" : ""}`}
            disabled={busy || !verificationCode.trim()}
            onPress={() => void handleClientTrustVerify()}
          >
            <Text className="auth-button-text">Continue</Text>
          </StyledPressable>
          <StyledPressable
            className="auth-secondary-button mt-2"
            disabled={busy}
            onPress={() => void signIn.mfa.sendEmailCode()}
          >
            <Text className="auth-secondary-button-text">
              Resend code
            </Text>
          </StyledPressable>
          <StyledPressable
            className="auth-secondary-button mt-2"
            disabled={busy}
            onPress={() => signIn.reset()}
          >
            <Text className="auth-secondary-button-text">Start over</Text>
          </StyledPressable>
        </View>
      </AuthScreen>
    );
  }

  if (signIn.status === "needs_second_factor") {
    return (
      <AuthScreen>
        <AuthBrandHeader
          title="Extra verification"
          subtitle="Your account requires a second step. Enter the code from your authenticator, SMS, or a backup code."
        />
        <View className="auth-card">
          <View className="flex-row flex-wrap gap-2">
            {mfaOptions.hasTotp ? (
              <StyledPressable
                className={`rounded-full border px-3 py-2 ${
                  mfaMode === "totp"
                    ? "border-accent bg-accent/15"
                    : "border-border bg-background"
                }`}
                onPress={() => {
                  setMfaMode("totp");
                  setMfaCode("");
                }}
              >
                <Text
                  className={`text-sm font-sans-semibold ${
                    mfaMode === "totp" ? "text-accent" : "text-muted-foreground"
                  }`}
                >
                  Authenticator
                </Text>
              </StyledPressable>
            ) : null}
            {mfaOptions.hasPhone ? (
              <StyledPressable
                className={`rounded-full border px-3 py-2 ${
                  mfaMode === "sms"
                    ? "border-accent bg-accent/15"
                    : "border-border bg-background"
                }`}
                onPress={() => {
                  setMfaMode("sms");
                  setMfaCode("");
                }}
              >
                <Text
                  className={`text-sm font-sans-semibold ${
                    mfaMode === "sms" ? "text-accent" : "text-muted-foreground"
                  }`}
                >
                  Text message
                </Text>
              </StyledPressable>
            ) : null}
            {mfaOptions.hasBackup ? (
              <StyledPressable
                className={`rounded-full border px-3 py-2 ${
                  mfaMode === "backup"
                    ? "border-accent bg-accent/15"
                    : "border-border bg-background"
                }`}
                onPress={() => {
                  setMfaMode("backup");
                  setMfaCode("");
                }}
              >
                <Text
                  className={`text-sm font-sans-semibold ${
                    mfaMode === "backup"
                      ? "text-accent"
                      : "text-muted-foreground"
                  }`}
                >
                  Backup code
                </Text>
              </StyledPressable>
            ) : null}
          </View>

          <AuthField
            label={
              mfaMode === "backup"
                ? "Backup code"
                : mfaMode === "totp"
                  ? "Authenticator code"
                  : "SMS code"
            }
            placeholder={
              mfaMode === "backup"
                ? "Enter a backup code"
                : "Enter your 6-digit code"
            }
            value={mfaCode}
            onChangeText={setMfaCode}
            keyboardType="number-pad"
            autoCapitalize="none"
            error={errors.fields?.code?.message}
          />

          <StyledPressable
            className={`auth-button ${busy || !mfaCode.trim() ? "auth-button-disabled" : ""}`}
            disabled={busy || !mfaCode.trim()}
            onPress={() => void handleMfaVerify()}
          >
            <Text className="auth-button-text">Verify and continue</Text>
          </StyledPressable>

          {mfaMode === "sms" ? (
            <StyledPressable
              className="auth-secondary-button mt-2"
              disabled={busy}
              onPress={() => void signIn.mfa.sendPhoneCode()}
            >
              <Text className="auth-secondary-button-text">
                Resend text message
              </Text>
            </StyledPressable>
          ) : null}

          <StyledPressable
            className="auth-secondary-button mt-2"
            disabled={busy}
            onPress={() => signIn.reset()}
          >
            <Text className="auth-secondary-button-text">Start over</Text>
          </StyledPressable>
        </View>
      </AuthScreen>
    );
  }

  return (
    <AuthScreen>
      <AuthBrandHeader
        title="Welcome back"
        subtitle="Sign in to keep every subscription renewal predictable — without surprises."
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
            error={
              localEmailError ?? errors.fields?.identifier?.message
            }
          />

          <AuthField
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={(t) => {
              setPassword(t);
              setLocalPasswordError(undefined);
            }}
            secureTextEntry
            autoComplete="password"
            textContentType="password"
            error={
              localPasswordError ?? errors.fields?.password?.message
            }
          />

          <Text className="auth-helper text-center">
            We never sell your data. Sign-in is encrypted end-to-end through
            your secure session.
          </Text>

          <StyledPressable
            className={`auth-button ${busy || !passwordFormValid ? "auth-button-disabled" : ""}`}
            disabled={busy || !passwordFormValid}
            onPress={() => void handlePasswordSubmit()}
          >
            <Text className="auth-button-text">Sign in</Text>
          </StyledPressable>
        </View>
      </View>

      <View className="auth-link-row">
        <Text className="auth-link-copy">New to Recurly?</Text>
        <StyledPressable hitSlop={8} onPress={() => router.push("/sign-up")}>
          <Text className="auth-link">Create an account</Text>
        </StyledPressable>
      </View>
    </AuthScreen>
  );
}
