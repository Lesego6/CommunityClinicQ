import React from "react";
import { View, Text } from "react-native";
import Svg, { Path, Circle, Rect, G } from "react-native-svg";
import { Colors } from "../../constants/colors";

function CrossIcon({ size = 28 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      {/* Green cross background */}
      <Rect x={0} y={0} width={32} height={32} rx={8} fill={Colors.primary} />
      {/* White cross */}
      <Rect x={13} y={5} width={6} height={22} rx={2} fill="white" />
      <Rect x={5} y={13} width={22} height={6} rx={2} fill="white" />
      {/* Orange accent dot */}
      <Circle cx={24} cy={8} r={4} fill={Colors.secondary} />
    </Svg>
  );
}

export function ClinicQLogo({ size = 28 }: { size?: number }) {
  const fontSize = size * 0.75;
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
      <CrossIcon size={size} />
      <View style={{ flexDirection: "row", alignItems: "baseline" }}>
        <Text
          style={{
            fontSize: fontSize,
            fontWeight: "800",
            color: Colors.primary,
            letterSpacing: -0.5,
          }}
        >
          Clinic
        </Text>
        <Text
          style={{
            fontSize: fontSize,
            fontWeight: "800",
            color: Colors.secondary,
            letterSpacing: -0.5,
          }}
        >
          Q
        </Text>
        {/* Clock icon inside Q */}
        <View style={{ marginLeft: -2, marginBottom: 2 }}>
          <Svg width={fontSize * 0.55} height={fontSize * 0.55} viewBox="0 0 16 16" fill="none">
            <Circle cx={8} cy={8} r={7} stroke={Colors.secondary} strokeWidth={1.5} fill="white" />
            <Path d="M8 4.5V8L10.5 9.5" stroke={Colors.secondary} strokeWidth={1.5} strokeLinecap="round" />
          </Svg>
        </View>
      </View>
    </View>
  );
}
