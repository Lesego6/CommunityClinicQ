import React, { useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Svg, { Circle, G, Path, Rect, Text as SvgText } from "react-native-svg";
import { Colors } from "../../constants/colors";
import { ClinicQLogo } from "../../components/ui/ClinicQLogo";
import { useAuthStore } from "../../stores/authStore";
import { useAppStore } from "../../stores/appStore";
import { navigateWithBlur } from "../../utils/ui";

const COUNTRY_CODE = "+27";

function PersonIcon({ color = Colors.primary, size = 28 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={8} r={4} stroke={color} strokeWidth={2} />
      <Path
        d="M4 20C4 16.7 7.6 14.5 12 14.5C16.4 14.5 20 16.7 20 20"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );
}

function PhoneIcon({ color = Colors.mutedLight, size = 24 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M7 4L9.4 3.2L12 8L10.2 9.6C11.1 11.5 12.5 12.9 14.4 13.8L16 12L20.8 14.6L20 17C19.6 18.2 18.5 19 17.2 19C10.5 19 5 13.5 5 6.8C5 5.5 5.8 4.4 7 4Z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function ShieldIcon({ color = Colors.primary, size = 36 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 3L19 6V11C19 15.5 16.2 19.2 12 21C7.8 19.2 5 15.5 5 11V6L12 3Z"
        stroke={color}
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <Rect x={9} y={11} width={6} height={5} rx={1} stroke={color} strokeWidth={1.8} />
      <Path d="M10.5 11V9.8C10.5 8.9 11.2 8.2 12 8.2C12.8 8.2 13.5 8.9 13.5 9.8V11" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}

function UserFieldIcon() {
  return <PersonIcon color={Colors.mutedLight} size={25} />;
}

function ChevronDownIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Path d="M6 9L12 15L18 9" stroke={Colors.mutedLight} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function ArrowRightIcon() {
  return (
    <Svg width={31} height={31} viewBox="0 0 24 24" fill="none">
      <Path d="M5 12H19M13 6L19 12L13 18" stroke={Colors.white} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function SouthAfricaFlag() {
  return (
    <Svg width={31} height={21} viewBox="0 0 31 21">
      <Rect width={31} height={21} rx={3} fill="#DE3831" />
      <Rect y={10.5} width={31} height={10.5} rx={3} fill="#002395" />
      <Path d="M0 0L14 10.5L0 21V0Z" fill="#000" />
      <Path d="M0 0L15.5 10.5L0 21" stroke="#FFB612" strokeWidth={6} strokeLinejoin="round" />
      <Path d="M0 0L15.5 10.5L0 21" stroke="#007A4D" strokeWidth={4} strokeLinejoin="round" />
      <Path d="M13 0H31V6H18L10 10.5L18 15H31V21H13L0 13.2V7.8L13 0Z" fill="#fff" />
      <Path d="M13 0H31V4H18.8L8 10.5L18.8 17H31V21H13L0 13V8L13 0Z" fill="#007A4D" />
    </Svg>
  );
}

function ClinicIllustration() {
  return (
    <View style={styles.illustrationWrap}>
      <Svg width="100%" height="100%" viewBox="0 0 270 176" fill="none">
        <Circle cx={135} cy={78} r={68} fill={Colors.primaryLight} opacity={0.75} />
        <Circle cx={196} cy={101} r={27} fill="#D3EEE3" />
        <Path d="M20 154C60 119 104 117 136 138C174 105 214 113 252 154H20Z" fill="#BFE2D5" />
        <Path d="M86 82H214V154H86V82Z" fill="#E8F5EE" stroke="#7DBBA6" strokeWidth={3} />
        <Path d="M78 72H222L214 82H86L78 72Z" fill="#5CAD91" />
        <Path d="M103 103H196V154H103V103Z" fill="#F8FAF9" stroke="#A7D5C5" strokeWidth={3} />
        <Path d="M142 103H157V118H172V133H157V148H142V133H127V118H142V103Z" fill={Colors.primaryMid} />
        <Rect x={123} y={134} width={50} height={20} rx={2} fill="#8FCDB8" opacity={0.7} />
        <Path d="M123 134H173" stroke="#5CAD91" strokeWidth={3} />
        <SvgText x={127} y={126} fill={Colors.primary} fontSize={16} fontWeight="800">
          CLINIC
        </SvgText>
        <G opacity={0.55}>
          <Path d="M226 110C237 101 249 111 245 125C256 128 254 145 240 146H217C202 146 199 128 211 124C209 115 218 111 226 110Z" fill="#9ACDB9" />
          <Path d="M232 145V120" stroke="#65A98E" strokeWidth={3} strokeLinecap="round" />
          <Path d="M232 132L242 124" stroke="#65A98E" strokeWidth={3} strokeLinecap="round" />
        </G>
        <G opacity={0.7}>
          <Path d="M64 139C70 127 83 131 82 145H58C57 143 60 141 64 139Z" fill="#86C2AC" />
          <Path d="M68 141V121" stroke="#68A98E" strokeWidth={3} strokeLinecap="round" />
          <Path d="M68 131L59 126" stroke="#68A98E" strokeWidth={3} strokeLinecap="round" />
        </G>
      </Svg>
    </View>
  );
}

export default function PhoneScreen() {
  const router = useRouter();
  const setPhone = useAuthStore((s) => s.setPhone);
  const updateUser = useAppStore((s) => s.updateUser);
  const savedName = useAppStore((s) => s.user.name);

  const phoneRef = useRef<TextInput>(null);
  const [fullName, setFullName] = useState(savedName || "");
  const [number, setNumber] = useState("");
  const [error, setError] = useState("");

  const digits = number.replace(/\D/g, "");
  const nameIsValid = fullName.trim().length >= 2;
  const phoneIsValid = digits.length >= 9;
  const canContinue = nameIsValid && phoneIsValid;

  const handleContinue = () => {
    if (!nameIsValid) {
      setError("Please enter your full name.");
      return;
    }

    if (!phoneIsValid) {
      setError("Please enter a valid South African phone number.");
      phoneRef.current?.focus();
      return;
    }

    const cleanPhone = `${COUNTRY_CODE}${digits}`;
    setError("");
    setPhone(cleanPhone);
    updateUser({ name: fullName.trim(), phone: cleanPhone });
    navigateWithBlur(router, "/auth/otp");
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.hero}>
            <ClinicQLogo size={48} />
            <ClinicIllustration />

            <View style={styles.heroCopy}>
              <Text style={styles.heroTitle}>Welcome to ClinicQ</Text>
              <Text style={styles.heroSubtitle}>
                Join the smarter way to access healthcare in your community.
              </Text>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.headerIcon}>
                <PersonIcon />
              </View>
              <View style={styles.headerTextWrap}>
                <Text style={styles.cardTitle}>Let's get started</Text>
                <Text style={styles.cardSubtitle}>Enter your details to continue</Text>
              </View>
            </View>

            <Text style={styles.label}>Full Name</Text>
            <View style={[styles.inputShell, error && !nameIsValid ? styles.inputShellError : null]}>
              <View style={styles.inputIcon}>
                <UserFieldIcon />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Enter your full name"
                placeholderTextColor={Colors.mutedLight}
                value={fullName}
                onChangeText={(text) => {
                  setFullName(text);
                  if (error) setError("");
                }}
                autoCapitalize="words"
                returnKeyType="next"
                onSubmitEditing={() => phoneRef.current?.focus()}
                accessibilityLabel="Full name"
              />
            </View>

            <Text style={[styles.label, styles.phoneLabel]}>Phone Number</Text>
            <View style={[styles.phoneShell, error && nameIsValid && !phoneIsValid ? styles.inputShellError : null]}>
              <View style={styles.countryPicker}>
                <SouthAfricaFlag />
                <Text style={styles.countryCode}>{COUNTRY_CODE}</Text>
                <ChevronDownIcon />
              </View>
              <View style={styles.phoneDivider} />
              <View style={styles.phoneInputWrap}>
                <PhoneIcon />
                <TextInput
                  ref={phoneRef}
                  style={styles.input}
                  placeholder="Enter your phone number"
                  placeholderTextColor={Colors.mutedLight}
                  keyboardType="phone-pad"
                  value={number}
                  onChangeText={(text) => {
                    setNumber(text);
                    if (error) setError("");
                  }}
                  maxLength={12}
                  returnKeyType="done"
                  onSubmitEditing={handleContinue}
                  accessibilityLabel="Phone number"
                />
              </View>
            </View>

            {error ? (
              <Text style={styles.errorText}>{error}</Text>
            ) : (
              <Text style={styles.helpText}>We'll send you a verification code via SMS</Text>
            )}

            <View style={styles.safetyBox}>
              <ShieldIcon />
              <View style={styles.safetyCopy}>
                <Text style={styles.safetyTitle}>Your data is safe with us</Text>
                <Text style={styles.safetyBody}>We never share your information with anyone.</Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={handleContinue}
              activeOpacity={0.85}
              style={[styles.continueButton, !canContinue ? styles.continueButtonMuted : null]}
              accessibilityRole="button"
            >
              <Text style={styles.continueText}>Continue</Text>
              <ArrowRightIcon />
            </TouchableOpacity>
          </View>

          <View style={styles.loginRow}>
            <View style={styles.loginLine} />
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => phoneRef.current?.focus()}>
              <Text style={styles.loginLink}>Login</Text>
            </TouchableOpacity>
            <View style={styles.loginLine} />
          </View>

          <View style={styles.trustRow}>
            <ShieldIcon size={26} />
            <Text style={styles.trustText}>Trusted by clinics. Loved by communities.</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  keyboard: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 0,
    backgroundColor: Colors.white,
  },
  hero: {
    minHeight: 292,
    position: "relative",
    justifyContent: "flex-start",
  },
  illustrationWrap: {
    position: "absolute",
    right: -2,
    bottom: 12,
    width: "50%",
    height: 150,
    opacity: 0.92,
    pointerEvents: "none",
  },
  heroCopy: {
    marginTop: 72,
    width: "58%",
    zIndex: 1,
  },
  heroTitle: {
    color: Colors.primary,
    fontSize: 31,
    fontWeight: "900",
    lineHeight: 37,
  },
  heroSubtitle: {
    marginTop: 14,
    color: Colors.muted,
    fontSize: 20,
    lineHeight: 29,
    fontWeight: "500",
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.09,
    shadowRadius: 24,
    elevation: 6,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 26,
  },
  headerIcon: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: Colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  headerTextWrap: {
    flex: 1,
  },
  cardTitle: {
    color: Colors.dark,
    fontSize: 22,
    fontWeight: "900",
    lineHeight: 27,
  },
  cardSubtitle: {
    color: Colors.muted,
    fontSize: 15,
    lineHeight: 21,
    marginTop: 4,
  },
  label: {
    color: "#000",
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 10,
  },
  phoneLabel: {
    marginTop: 24,
  },
  inputShell: {
    minHeight: 64,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#D8DCE2",
    backgroundColor: Colors.white,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
  },
  inputShellError: {
    borderColor: Colors.danger,
  },
  inputIcon: {
    width: 54,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    flex: 1,
    color: Colors.dark,
    fontSize: 17,
    fontWeight: "500",
    paddingVertical: 14,
    paddingRight: 12,
    minWidth: 0,
  },
  phoneShell: {
    minHeight: 64,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#D8DCE2",
    backgroundColor: Colors.white,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
  },
  countryPicker: {
    width: 128,
    height: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  countryCode: {
    color: Colors.dark,
    fontSize: 17,
    fontWeight: "800",
  },
  phoneDivider: {
    width: 1.5,
    alignSelf: "stretch",
    backgroundColor: "#D8DCE2",
  },
  phoneInputWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingLeft: 14,
    minWidth: 0,
  },
  helpText: {
    color: Colors.muted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 12,
  },
  errorText: {
    color: Colors.danger,
    fontSize: 14,
    fontWeight: "700",
    marginTop: 12,
  },
  safetyBox: {
    marginTop: 28,
    marginBottom: 26,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#D6EADF",
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 18,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  safetyCopy: {
    flex: 1,
    marginLeft: 14,
  },
  safetyTitle: {
    color: Colors.primary,
    fontSize: 17,
    fontWeight: "900",
  },
  safetyBody: {
    color: Colors.darkMid,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
  },
  continueButton: {
    minHeight: 64,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 28,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 16,
    elevation: 5,
  },
  continueButtonMuted: {
    opacity: 0.82,
  },
  continueText: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: "900",
  },
  loginRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 28,
    marginBottom: 34,
  },
  loginLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  loginText: {
    color: Colors.muted,
    fontSize: 14,
    marginLeft: 12,
  },
  loginLink: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: "900",
    marginRight: 12,
  },
  trustRow: {
    marginHorizontal: -20,
    marginBottom: 0,
    backgroundColor: Colors.primaryLight,
    minHeight: 72,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  trustText: {
    color: Colors.darkMid,
    fontSize: 14,
    fontWeight: "500",
  },
});
