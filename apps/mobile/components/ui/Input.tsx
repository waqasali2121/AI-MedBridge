import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardTypeOptions,
  StyleProp,
  ViewStyle,
} from 'react-native';

interface InputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  error?: string | null;
  leftIcon?: React.ReactNode;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  className?: string;
  editable?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  style?: StyleProp<ViewStyle>;
}

export const Input: React.FC<InputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  error,
  leftIcon,
  keyboardType = 'default',
  autoCapitalize = 'none',
  className = '',
  editable = true,
  multiline = false,
  numberOfLines = 1,
  style,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  let borderColor = 'border-[#C3C6CE]';
  if (error) {
    borderColor = 'border-[#BA1A1A]';
  } else if (isFocused) {
    borderColor = 'border-[#0D9488]';
  }

  return (
    <View className={`w-full mb-4 ${className}`} style={style}>
      {label && (
        <Text className="text-sm font-medium text-[#0B1C30] mb-1.5">
          {label}
        </Text>
      )}
      <View
        className={`flex-row items-center bg-white border rounded-xl px-3.5 ${
          multiline ? 'py-2.5' : 'h-12'
        } ${borderColor} ${!editable ? 'bg-[#EFF4FF]' : ''}`}
      >
        {leftIcon && <View className="mr-2.5">{leftIcon}</View>}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#74777E"
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          editable={editable}
          multiline={multiline}
          numberOfLines={numberOfLines}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="flex-1 text-base text-[#0B1C30] p-0"
          style={multiline ? { textAlignVertical: 'top' } : undefined}
        />
      </View>
      {error && (
        <Text className="text-xs text-[#BA1A1A] mt-1.5 font-normal">
          {error}
        </Text>
      )}
    </View>
  );
};

export default Input;
