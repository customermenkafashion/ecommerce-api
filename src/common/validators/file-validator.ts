
export function validateFile(
  file: Express.Multer.File | undefined, // ✅ allow undefined
  options: {
    required?: boolean;
    maxSize?: number;
    allowedMimeTypes?: string[];
    fieldName?: string;
  },
): string[] {
  const errors: string[] = [];
  const field = options.fieldName ?? 'file';

  // Required check
  if (options.required && !file) {
    errors.push(`${field} is required`);
    return errors;
  }

  // If file is optional and not provided
  if (!file) {
    return errors;
  }

  // Mime type check
  if (
    options.allowedMimeTypes &&
    !options.allowedMimeTypes.includes(file.mimetype)
  ) {
    errors.push(
      `${field} must be ${options.allowedMimeTypes
        .map(t => t.split('/')[1])
        .join(', ')}`,
    );
  }

  // Size check
  if (options.maxSize && file.size > options.maxSize) {
    errors.push(
      `${field} size must be less than ${options.maxSize / 1024 / 1024}MB`,
    );
  }

  return errors;
}
