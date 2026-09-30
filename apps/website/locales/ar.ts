import { commonAr, mergeLocaleMessages } from '@workspace/locales';

export default defineI18nLocale(async () => {
  const websiteAr = {
    website: {
      hero: {
        badge: 'Nuxt 3 + TanStack Query + Tailwind v4',
        title: 'موقع الويب الشامل للمشروع الموحد',
        subtitle:
          'إمكانيات فائقة لـ SSR و SSG و ISR مع مشاركة منطق العمل والصلاحيات ومكونات واجهة المستخدم عبر جميع التطبيقات.',
        ctaDocs: 'استعراض التوثيق',
        ctaDashboard: 'لوحة استعلام TanStack التفاعلية',
      },
      features: {
        title: 'أبرز مميزات المعمارية',
        ssr: {
          title: 'العرض الهجين',
          description: 'دعم العرض الحي SSR والتوليد المسبق SSG والتخزين المؤقت المستمر ISR.',
        },
        hydration: {
          title: 'تزامن بدون شلال طلبات',
          description: 'جلب مسبق على الخادم وتزامن فوري على المتصفح بدون أي طلبات مكررة.',
        },
        permissions: {
          title: 'محرك صلاحيات عام',
          description: 'محرك صلاحيات موحد يعمل مع وسيط توجيه Nuxt وحراس مسار Vue Router.',
        },
      },
    },
    nav: {
      home: 'الرئيسية',
      tanstackQuery: 'استعلام TanStack على الخادم',
      ssgExample: 'توليد مسبق SSG',
      isrExample: 'تخزين مؤقت ISR (60 ث)',
    },
  };

  return mergeLocaleMessages(commonAr, websiteAr);
});
