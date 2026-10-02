import React from 'react';
import { View, TouchableOpacity, ViewStyle, StyleProp } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onPress,
  style,
}) => {
  const baseClassName = `bg-white rounded-2xl p-4 border border-[#E5EEFF] shadow-sm ${className}`;

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        style={style}
        className={baseClassName}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={style} className={baseClassName}>
      {children}
    </View>
  );
};

export default Card;
