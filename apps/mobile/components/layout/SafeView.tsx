import React from 'react';
import { ViewStyle, StyleProp } from 'react-native';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';

interface SafeViewProps {
  children: React.ReactNode;
  className?: string;
  style?: StyleProp<ViewStyle>;
  edges?: Edge[];
}

export const SafeView: React.FC<SafeViewProps> = ({
  children,
  className = '',
  style,
  edges = ['top', 'bottom', 'left', 'right'],
}) => {
  return (
    <SafeAreaView
      edges={edges}
      style={style}
      className={`flex-1 bg-[#F8F9FF] ${className}`}
    >
      {children}
    </SafeAreaView>
  );
};

export default SafeView;
