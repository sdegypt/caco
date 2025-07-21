// middleware/seoMiddleware.js
const path = require('path');

// بيانات SEO لكل صفحة
const seoData = {
  '/': {
    title: 'اعملها براك | مجتمع المبدعين العرب ومنصة الإبداع الشاملة',
    description: 'اكتشف منصة اعملها براك، مجتمع المبدعين العرب لبيع المنتجات اليدوية، تحميل الملفات، والمشاركة في مسابقات إبداعية. انضم الآن!',
    keywords: 'منصة للمبدعين العرب، مجتمع إبداعي عربي، بيع منتجات يدوية وفنية، تحميل ملفات مفتوحة المصدر، إنشاء معرض أعمال مجاني، مسابقات تصميم مجانية، مجتمع المصممين العرب، كوميكس عربية، متجر تصاميم رقمية، مشاريع جماعية إبداعية، منصة كتابة محتوى عربي',
    canonical: 'https://www.amlhabrak.online/',
    ogType: 'website',
    ogImage: 'https://www.amlhabrak.online/public/images/logo-og.png'
  },
  '/forum': {
    title: 'منتدى اعملها براك | نقاشات المبدعين العرب وأسئلتهم',
    description: 'انضم إلى منتدى اعملها براك وشارك في نقاشات حيوية حول التصميم، الفن، البرمجة، والكتابة. تبادل الخبرات واستفد من مجتمعنا الإبداعي.',
    keywords: 'منتدى المبدعين العرب، نقاشات إبداعية، أسئلة وأجوبة تصميم، مجتمع فني عربي، تبادل خبرات إبداعية',
    canonical: 'https://www.amlhabrak.online/forum',
    ogType: 'website',
    ogImage: 'https://www.amlhabrak.online/public/images/forum-og.png'
  },
  '/projects': {
    title: 'مشاريع اعملها براك | استكشف إبداعات المبدعين العرب',
    description: 'تصفح مشاريع المبدعين العرب المتنوعة في التصميم، الفن، البرمجة، والكتابة. شارك في مشاريع جماعية أو اعرض أعمالك الخاصة.',
    keywords: 'مشاريع إبداعية عربية، مشاريع جماعية إبداعية، عرض مشاريع فنية، منصة مشاريع للمبدعين، أفكار مشاريع تصميم',
    canonical: 'https://www.amlhabrak.online/projects',
    ogType: 'website',
    ogImage: 'https://www.amlhabrak.online/public/images/projects-og.png'
  },
  '/contests': {
    title: 'مسابقات اعملها براك | تحديات إبداعية وجوائز قيمة',
    description: 'شارك في مسابقات اعملها براك لتصميم، الفن، والكتابة. اختبر مهاراتك واربح جوائز قيمة. انضم الآن!',
    keywords: 'مسابقات تصميم مجانية، مسابقات فنية عربية، جوائز إبداعية، تحديات تصميم، انضمام لمسابقات',
    canonical: 'https://www.amlhabrak.online/contests',
    ogType: 'website',
    ogImage: 'https://www.amlhabrak.online/public/images/contests-og.png'
  },
  '/store': {
    title: 'متجر اعملها براك | تسوق منتجات يدوية وفنية فريدة',
    description: 'اكتشف متجر اعملها براك لبيع وشراء المنتجات اليدوية والفنية والتصاميم الرقمية. ادعم المبدعين العرب واقتنِ أعمالًا فريدة.',
    keywords: 'بيع منتجات يدوية وفنية، متجر تصاميم رقمية، شراء أعمال فنية عربية، سوق المنتجات الإبداعية، متجر إلكتروني للمبدعين',
    canonical: 'https://www.amlhabrak.online/store',
    ogType: 'website',
    ogImage: 'https://www.amlhabrak.online/public/images/store-og.png'
  },
  '/about': {
    title: 'من نحن | تعرف على منصة اعملها براك ومجتمع المبدعين',
    description: 'اكتشف قصة ورؤية اعملها براك، المنصة الرائدة للمبدعين العرب. تعرف على أهدافنا وكيف ندعم الإبداع في العالم العربي.',
    keywords: 'عن منصة اعملها براك، رؤية اعملها براك، قصة اعملها براك، أهداف اعملها براك، فريق اعملها براك',
    canonical: 'https://www.amlhabrak.online/about',
    ogType: 'website',
    ogImage: 'https://www.amlhabrak.online/public/images/about-og.png'
  },
  '/contact': {
    title: 'اتصل بنا | دعم اعملها براك للمبدعين العرب',
    description: 'تواصل مع فريق دعم اعملها براك لأي استفسارات، اقتراحات، أو مساعدة فنية. نحن هنا لخدمة مجتمع المبدعين العرب.',
    keywords: 'اتصل بنا اعملها براك، دعم فني للمبدعين، تواصل مع منصة إبداعية، استفسارات اعملها براك',
    canonical: 'https://www.amlhabrak.online/contact',
    ogType: 'website',
    ogImage: 'https://www.amlhabrak.online/public/images/contact-og.png'
  },
  '/profile': {
    title: 'ملفك الشخصي في اعملها براك | أدر إبداعاتك',
    description: 'قم بإدارة ملفك الشخصي، معرض أعمالك، وإعدادات حسابك في منصة اعملها براك. خصص تجربتك الإبداعية.',
    keywords: 'ملف شخصي للمبدع، بروفايل فنان عربي، صفحة مستخدم إبداعي، إدارة معرض الأعمال، إعدادات الحساب',
    canonical: 'https://www.amlhabrak.online/profile',
    ogType: 'profile',
    ogImage: 'https://www.amlhabrak.online/public/images/profile-og.png'
  },
  '/portfolio': {
    title: 'معرض أعمالك في اعملها براك | Portfolio احترافي مجاني',
    description: 'أنشئ معرض أعمالك الاحترافي مجانًا على اعملها براك. اعرض تصاميمك، رسوماتك، وكتاباتك للعالم واجذب العملاء.',
    keywords: 'إنشاء معرض أعمال مجاني، Portfolio للمصممين العرب، عرض أعمال فنية، معرض صور إبداعي، أفضل أعمال المبدعين',
    canonical: 'https://www.amlhabrak.online/portfolio',
    ogType: 'website',
    ogImage: 'https://www.amlhabrak.online/public/images/portfolio-og.png'
  }
};

// Middleware لإضافة بيانات SEO
const seoMiddleware = (req, res, next) => {
  const currentPath = req.path;
  const currentSeo = seoData[currentPath] || seoData['/'];
  
  // إضافة بيانات SEO إلى res.locals
  res.locals.seo = {
    title: currentSeo.title,
    description: currentSeo.description,
    keywords: currentSeo.keywords,
    canonical: currentSeo.canonical,
    ogTitle: currentSeo.title,
    ogDescription: currentSeo.description,
    ogType: currentSeo.ogType,
    ogImage: currentSeo.ogImage,
    ogUrl: `https://www.amlhabrak.online${currentPath}`,
    twitterCard: 'summary_large_image',
    twitterTitle: currentSeo.title,
    twitterDescription: currentSeo.description,
    twitterImage: currentSeo.ogImage
  };

  // إضافة structured data
  res.locals.structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "اعملها براك",
    "alternateName": "Amlhabrak",
    "url": "https://www.amlhabrak.online",
    "description": "منصة شاملة للمبدعين العرب في التصميم، الفن، البرمجة، والكتابة",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://www.amlhabrak.online/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "اعملها براك",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.amlhabrak.online/public/images/logo.png"
      }
    }
  };

  next();
};

module.exports = seoMiddleware;

