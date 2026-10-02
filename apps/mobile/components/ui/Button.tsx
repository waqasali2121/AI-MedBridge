import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  ViewStyle,
  StyleProp,
  TextStyle,
  View,
} from 'react-native';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'destructive';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  className?: string;
  textClassName?: string;
  style?: StyleProp<ViewStyle>;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  fullWidth = true,
  icon,
  className = '',
  textClassName = '',
  style,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          container: 'bg-[#0D9488] active:bg-[#0F766E]',
          text: 'text-white font-semibold',
          spinnerColor: '#FFFFFF',
        };
      case 'secondary':
        return {
          container: 'bg-[#0F2942] active:bg-[#001428]',
          text: 'text-white font-semibold',
          spinnerColor: '#FFFFFF',
        };
      case 'outline':
        return {
          container: 'bg-transparent border border-[#0D9488] active:bg-[#CCFBF1]',
          text: 'text-[#0D9488] font-semibold',
          spinnerColor: '#0D9488',
        };
      case 'destructive':
        return {
          container: 'bg-[#BA1A1A] active:bg-[#991B1B]',
          text: 'text-white font-semibold',
          spinnerColor: '#FFFFFF',
        };
      default:
        return {
          container: 'bg-[#0D9488]',
          text: 'text-white font-semibold',
          spinnerColor: '#FFFFFF',
        };
    }
  };

  const variantStyle = getVariantStyles();

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={style}
      className={`py-3.5 px-6 rounded-xl flex-row items-center justify-center ${
        fullWidth ? 'w-full' : ''
      } ${variantStyle.container} ${
        disabled ? 'opacity-50' : ''
      } ${className}`}
    >
      {loading ? (
        <ActivityIndicator size="small" color={variantStyle.spinnerColor} />
      ) : (
        <View className="flex-row items-center justify-center space-x-2">
          {icon && <View className="mr-2">{icon}</View>}
          <Text className={`text-base text-center ${variantStyle.text} ${textClassName}`}>
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default Button;
