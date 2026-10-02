export const API_BASE_URL = __DEV__
  ? 'http://10.0.2.2:8000/api' // Android emulator
  : 'http://localhost:8000/api';

export const MAX_FILE_SIZE_MB = 10;
export const SUPPORTED_FILE_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
];
