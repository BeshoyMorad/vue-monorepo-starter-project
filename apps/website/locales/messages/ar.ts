import type { apiErrorsEn, validationEn } from './en';

const invalidCredentials = 'رقم الجوال أو الرقم السري غير صحيح.';
const invalidOtp = 'الرمز غير صحيح. تحقق منه وحاول مرة أخرى.';
const sessionExpired = 'انتهت جلستك. يرجى تسجيل الدخول مرة أخرى.';
const notVerified = 'لم يتم التحقق من حسابك بعد.';
const tooMany = 'محاولات كثيرة جداً. يرجى الانتظار قليلاً ثم المحاولة مرة أخرى.';
const required = 'هذا الحقل مطلوب';
const phone = 'أدخل رقم جوال سعودي صحيح، مثل 5XXXXXXXX';
const passwordMin = 'يجب ألا يقل الرقم السري عن 8 أحرف';
const passwordFormat = 'استخدم حروفاً كبيرة وصغيرة ورقماً ورمزاً';
const otp = 'أدخل الرمز المكوّن من 6 أرقام';
const phoneInUse = 'رقم الجوال هذا مرتبط بحساب مسبقاً. سجّل الدخول، أو استخدم رقماً آخر.';
const emailInUse = 'البريد الإلكتروني هذا مرتبط بحساب مسبقاً. سجّل الدخول، أو استخدم بريداً آخر.';
const nationalIdInUse = 'رقم الهوية هذا مرتبط بحساب مسبقاً. سجّل الدخول إلى ذلك الحساب.';

export const apiErrorsAr: typeof apiErrorsEn = {
  codes: {
    UPLOAD_FILE_REQUIRED: 'اختر صورة لرفعها.',
    UPLOAD_FILE_TYPE_UNSUPPORTED: 'نوع الملف غير مدعوم. استخدم صورة JPG أو PNG أو WebP.',
    UPLOAD_FILE_TOO_LARGE: 'الصورة كبيرة جداً. استخدم صورة أصغر من 5 ميغابايت.',
    VALIDATION_FAILED: 'يرجى مراجعة الحقول المحددة.',
    ValidationError: 'يرجى مراجعة الحقول المحددة.',
    BadRequest: 'يرجى مراجعة الحقول المحددة.',
    UNAUTHENTICATED: sessionExpired,
    Unauthorized: sessionExpired,
    FORBIDDEN: 'ليس لديك صلاحية للقيام بذلك.',
    Forbidden: 'ليس لديك صلاحية للقيام بذلك.',
    NOT_FOUND: 'لم نتمكن من العثور على ما تبحث عنه.',
    NotFound: 'لم نتمكن من العثور على ما تبحث عنه.',
    TOO_MANY_REQUESTS: tooMany,
    RATE_LIMITED: tooMany,
    OTP_RATE_LIMITED: tooMany,
    TooManyRequests: tooMany,
    INTERNAL_ERROR: 'حدث خطأ من جهتنا. يرجى المحاولة لاحقاً.',
    AUTH_INVALID_CREDENTIALS: invalidCredentials,
    InvalidCredentials: invalidCredentials,
    ACCOUNT_NOT_VERIFIED: notVerified,
    AUTH_ACCOUNT_NOT_VERIFIED: notVerified,
    AccountNotVerified: notVerified,
    ACCOUNT_DISABLED: 'هذا الحساب موقوف. يرجى التواصل مع الدعم.',
    OTP_EXPIRED: 'انتهت صلاحية الرمز. اطلب رمزاً جديداً.',
    OTP_INVALID: invalidOtp,
    INVALID_OTP: invalidOtp,
    InvalidOtp: invalidOtp,
    PASSWORD_RESET_TOKEN_INVALID: 'انتهت صلاحية جلسة إعادة التعيين. يرجى البدء من جديد.',
    PASSWORD_UNCHANGED: 'هذا هو رقمك السري الحالي. اختر رقماً سرياً مختلفاً.',
    PHONE_IN_USE: phoneInUse,
    PHONE_ALREADY_EXISTS: phoneInUse,
    EMAIL_IN_USE: emailInUse,
    EMAIL_ALREADY_EXISTS: emailInUse,
    NATIONAL_ID_IN_USE: nationalIdInUse,
    NATIONAL_ID_ALREADY_EXISTS: nationalIdInUse,
    INVALID_VALUE: 'قيمة غير صحيحة',
    INVALID_TYPE: required,
    REQUIRED: required,
    TypeMismatchError: required,
    TOO_SHORT: 'القيمة قصيرة جداً',
    TOO_LONG: 'القيمة طويلة جداً',
    LengthError: 'الطول غير صحيح',
    INVALID_FORMAT: 'الصيغة غير صحيحة',
    FormatError: 'الصيغة غير صحيحة',
    INVALID_PHONE: phone,
    INVALID_EMAIL: 'أدخل بريداً إلكترونياً صحيحاً',
    INVALID_ENUM: 'اختر أحد الخيارات المتاحة',
    ALREADY_EXISTS: 'هذه القيمة مسجلة مسبقاً.',
  },
  fields: {
    identifier: { INVALID_PHONE: phone, INVALID_FORMAT: phone, FormatError: phone },
    phone: { INVALID_PHONE: phone, INVALID_FORMAT: phone, FormatError: phone },
    password: { TOO_SHORT: passwordMin, LengthError: passwordMin, INVALID_FORMAT: passwordFormat },
    newPassword: {
      TOO_SHORT: passwordMin,
      LengthError: passwordMin,
      INVALID_FORMAT: passwordFormat,
    },
    fullName: {
      TOO_SHORT: 'أدخل اسمك الكامل (حرفان على الأقل)',
      TOO_LONG: 'الاسم الكامل طويل جداً',
    },
    nationalId: { INVALID_FORMAT: 'رقم الهوية الوطنية غير صحيح. تحقق من الأرقام وحاول مرة أخرى.' },
    otp: { TOO_SHORT: otp, TOO_LONG: otp, INVALID_FORMAT: otp },
  },
};

export const validationAr: typeof validationEn = {
  required,
  invalid: 'قيمة غير صحيحة',
  oneOf: 'اختر إحدى القيم المسموح بها',
  minLength: 'يجب ألا يقل عن {min} أحرف',
  maxLength: 'يجب ألا يزيد عن {max} حرفاً',
  length: 'يجب أن يكون {length} أحرف بالضبط',
  email: 'أدخل بريداً إلكترونياً صحيحاً',
  url: 'أدخل رابطاً صحيحاً',
  format: 'الصيغة غير صحيحة',
  minNumber: 'يجب أن يكون {min} أو أكثر',
  maxNumber: 'يجب أن يكون {max} أو أقل',
  integer: 'يجب أن يكون رقماً صحيحاً',
  positive: 'يجب أن يكون أكبر من 0',
  minItems: 'اختر {min} على الأقل',
  maxItems: 'اختر {max} كحد أقصى',
  minDate: 'يجب أن يكون في {min} أو بعده',
  maxDate: 'يجب أن يكون في {max} أو قبله',
};
