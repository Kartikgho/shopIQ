import { useWindowDimensions } from 'react-native';

export function useResponsive() {
  const { width } = useWindowDimensions();
  const isWebWide = width >= 768;

  return { width, isWebWide };
}
