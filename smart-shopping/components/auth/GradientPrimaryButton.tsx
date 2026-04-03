import { LinearGradient } from 'expo-linear-gradient';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

type GradientPrimaryButtonProps = {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
};

export function GradientPrimaryButton({
  label,
  onPress,
  loading,
  disabled,
}: GradientPrimaryButtonProps) {
  const inactive = disabled || loading;

  return (
    <Pressable
      onPress={() => {
        if (!inactive) onPress();
      }}
      style={({ pressed }) => [
        styles.pressable,
        pressed && !inactive && { transform: [{ scale: 0.985 }], opacity: 0.94 },
        inactive && { opacity: 0.55 },
      ]}>
      <LinearGradient
        colors={['#3B82F6', '#6366F1']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}>
        <View style={styles.inner}>
          {loading ? (
            <ActivityIndicator color="#ffffff" size="small" />
          ) : (
            <Text style={styles.label}>{label}</Text>
          )}
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    marginTop: 22,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 8,
  },
  gradient: {
    borderRadius: 16,
  },
  inner: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 54,
  },
  label: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
