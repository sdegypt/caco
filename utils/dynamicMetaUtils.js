/**
 * نظام تحسين وصف الصفحات وعلامات العنوان بشكل ديناميكي
 * 
 * هذا الملف يحتوي على وظائف لتوليد عناوين وأوصاف ديناميكية للصفحات
 * بناءً على محتوى الصفحة والبيانات المتاحة
 */

// كائن يحتوي على بيانات الصفحات الافتراضية
const defaultPageData = {
  siteName: "اعملها براك",
  separator: " | ",
  defaultDescription: "منصة اعملها براك - مجتمع المبدعين العرب للتصميم والإبداع والتواصل",
  defaultKeywords: "تصميم, إبداع, مجتمع, عربي, مصممين, فنانين",
  defaultImage: "/uploads/images/logo.png",
  locale: "ar_AR"
};

/**
 * توليد عنوان ديناميكي للصفحة
 * @param {string} pageName - اسم الصفحة
 * @param {object} pageData - بيانات إضافية للصفحة
 * @returns {string} - عنوان الصفحة المولد
 */
function generateDynamicTitle(pageName, pageData = {}) {
  // دمج البيانات الافتراضية مع البيانات المخصصة
  const data = { ...defaultPageData, ...pageData };
  
  // تخصيص العنوان حسب نوع الصفحة
  switch (pageName) {
    case 'home':
      return `${data.siteName} - مجتمع المبدعين العرب`;
    case 'forum':
      return `المنتدى ${data.separator} ${data.siteName}`;
    case 'profile':
      return `${data.username || 'الملف الشخصي'} ${data.separator} ${data.siteName}`;
    case 'projects':
      return `المشاريع ${data.separator} ${data.siteName}`;
    case 'jobs':
      return `الوظائف ${data.separator} ${data.siteName}`;
    case 'about':
      return `حول ${data.siteName} ${data.separator} تعرف علينا`;
    case 'privacy':
      return `سياسة الخصوصية ${data.separator} ${data.siteName}`;
    case 'contact':
      return `اتصل بنا ${data.separator} ${data.siteName}`;
    case 'login':
      return `تسجيل الدخول ${data.separator} ${data.siteName}`;
    case 'signup':
      return `إنشاء حساب ${data.separator} ${data.siteName}`;
    case 'postDetails':
      return `${data.postTitle || 'تفاصيل المنشور'} ${data.separator} ${data.siteName}`;
    case 'jobDetail':
      return `${data.jobTitle || 'تفاصيل الوظيفة'} ${data.separator} ${data.siteName}`;
    case 'project-details':
      return `${data.projectTitle || 'تفاصيل المشروع'} ${data.separator} ${data.siteName}`;
    case 'messages':
      return `الرسائل ${data.separator} ${data.siteName}`;
    case 'notifications':
      return `الإشعارات ${data.separator} ${data.siteName}`;
    case 'admin':
      return `لوحة التحكم ${data.separator} ${data.siteName}`;
    default:
      return `${pageName} ${data.separator} ${data.siteName}`;
  }
}

/**
 * توليد وصف ديناميكي للصفحة
 * @param {string} pageName - اسم الصفحة
 * @param {object} pageData - بيانات إضافية للصفحة
 * @returns {string} - وصف الصفحة المولد
 */
function generateDynamicDescription(pageName, pageData = {}) {
  // دمج البيانات الافتراضية مع البيانات المخصصة
  const data = { ...defaultPageData, ...pageData };
  
  // تخصيص الوصف حسب نوع الصفحة
  switch (pageName) {
    case 'home':
      return `${data.siteName} - منصة إبداعية للمصممين والفنانين العرب. شارك إبداعاتك، تواصل مع المبدعين، واكتشف فرص عمل جديدة.`;
    case 'forum':
      return `المنتدى الإبداعي على ${data.siteName} - شارك منشوراتك، اعرض إعلاناتك، وتواصل مع المبدعين من مختلف المجالات.`;
    case 'profile':
      if (data.username) {
        return `الملف الشخصي لـ ${data.username} على ${data.siteName} - تعرف على أعماله وإبداعاته ومهاراته.`;
      }
      return `استعرض ملفك الشخصي على ${data.siteName} - أعمالك، مهاراتك، وتواصل مع المبدعين الآخرين.`;
    case 'projects':
      return `استكشف مشاريع إبداعية متنوعة على ${data.siteName} - فرص للتعاون والعمل مع مبدعين من مختلف المجالات.`;
    case 'jobs':
      return `فرص عمل للمبدعين على ${data.siteName} - وظائف في مجالات التصميم والفن والإبداع والتطوير.`;
    case 'about':
      return `تعرف على ${data.siteName} - منصة إبداعية مجانية تجمع المصممين والفنانين العرب في مكان واحد لمشاركة الإبداع والتعاون.`;
    case 'privacy':
      return `سياسة الخصوصية في ${data.siteName} - نلتزم بحماية خصوصية مستخدمينا وبياناتهم الشخصية.`;
    case 'contact':
      return `تواصل مع فريق ${data.siteName} - نحن هنا للإجابة على استفساراتك ومساعدتك في أي وقت.`;
    case 'login':
      return `تسجيل الدخول إلى ${data.siteName} - عد إلى مجتمعك الإبداعي واستمر في رحلة الإبداع.`;
    case 'signup':
      return `انضم إلى مجتمع ${data.siteName} - أنشئ حسابك المجاني وابدأ رحلتك الإبداعية اليوم.`;
    case 'postDetails':
      if (data.postTitle) {
        return `${data.postTitle} - منشور على ${data.siteName}. ${data.postExcerpt || 'اقرأ المزيد وشارك برأيك.'}`;
      }
      return `تفاصيل المنشور على ${data.siteName} - اقرأ المزيد وشارك برأيك في هذا المحتوى الإبداعي.`;
    case 'jobDetail':
      if (data.jobTitle) {
        return `${data.jobTitle} - فرصة عمل على ${data.siteName}. ${data.jobExcerpt || 'تقدم الآن واستعرض التفاصيل.'}`;
      }
      return `تفاصيل الوظيفة على ${data.siteName} - فرصة عمل جديدة في مجال الإبداع والتصميم.`;
    case 'project-details':
      if (data.projectTitle) {
        return `${data.projectTitle} - مشروع على ${data.siteName}. ${data.projectExcerpt || 'استعرض التفاصيل وفرص التعاون.'}`;
      }
      return `تفاصيل المشروع على ${data.siteName} - فرصة للتعاون والعمل مع مبدعين آخرين.`;
    case 'messages':
      return `الرسائل الخاصة على ${data.siteName} - تواصل مع المبدعين والمصممين بشكل مباشر.`;
    case 'notifications':
      return `إشعاراتك على ${data.siteName} - ابق على اطلاع بآخر التفاعلات والتحديثات.`;
    case 'admin':
      return `لوحة تحكم المشرفين على ${data.siteName} - إدارة المحتوى والمستخدمين والإعدادات.`;
    default:
      return data.defaultDescription;
  }
}

/**
 * توليد كلمات مفتاحية ديناميكية للصفحة
 * @param {string} pageName - اسم الصفحة
 * @param {object} pageData - بيانات إضافية للصفحة
 * @returns {string} - الكلمات المفتاحية المولدة
 */
function generateDynamicKeywords(pageName, pageData = {}) {
  // دمج البيانات الافتراضية مع البيانات المخصصة
  const data = { ...defaultPageData, ...pageData };
  
  // الكلمات المفتاحية الأساسية
  let baseKeywords = data.defaultKeywords;
  
  // إضافة كلمات مفتاحية حسب نوع الصفحة
  switch (pageName) {
    case 'home':
      return `${baseKeywords}, منصة إبداعية, مجتمع مصممين, فنانين عرب`;
    case 'forum':
      return `منتدى, مشاركات, إعلانات, ${baseKeywords}`;
    case 'profile':
      return `ملف شخصي, معرض أعمال, مهارات, ${data.username || ''}, ${baseKeywords}`;
    case 'projects':
      return `مشاريع, تعاون, فرص عمل, ${baseKeywords}`;
    case 'jobs':
      return `وظائف, فرص عمل, توظيف مصممين, ${baseKeywords}`;
    case 'about':
      return `عن المنصة, من نحن, ${data.siteName}, ${baseKeywords}`;
    case 'privacy':
      return `سياسة الخصوصية, حماية البيانات, خصوصية المستخدم, ${baseKeywords}`;
    case 'contact':
      return `اتصل بنا, تواصل معنا, دعم فني, ${baseKeywords}`;
    case 'login':
      return `تسجيل دخول, حساب مستخدم, ${baseKeywords}`;
    case 'signup':
      return `إنشاء حساب, تسجيل, عضوية جديدة, ${baseKeywords}`;
    default:
      return baseKeywords;
  }
}

/**
 * توليد بيانات Open Graph للمشاركة على الشبكات الاجتماعية
 * @param {string} pageName - اسم الصفحة
 * @param {object} pageData - بيانات إضافية للصفحة
 * @returns {object} - بيانات Open Graph
 */
function generateOpenGraphData(pageName, pageData = {}) {
  // دمج البيانات الافتراضية مع البيانات المخصصة
  const data = { ...defaultPageData, ...pageData };
  
  // توليد العنوان والوصف
  const title = generateDynamicTitle(pageName, data);
  const description = generateDynamicDescription(pageName, data);
  
  // تحديد الصورة المناسبة
  let image = data.image || data.defaultImage;
  
  // تحديد نوع المحتوى
  let type = "website";
  if (pageName === 'postDetails') type = "article";
  if (pageName === 'profile') type = "profile";
  
  // إنشاء كائن Open Graph
  return {
    title,
    description,
    type,
    url: data.url || `https://www.aemelhabarak.com/${pageName}`,
    image,
    siteName: data.siteName,
    locale: data.locale
  };
}

/**
 * توليد بيانات Twitter Card للمشاركة على تويتر
 * @param {string} pageName - اسم الصفحة
 * @param {object} pageData - بيانات إضافية للصفحة
 * @returns {object} - بيانات Twitter Card
 */
function generateTwitterCardData(pageName, pageData = {}) {
  // دمج البيانات الافتراضية مع البيانات المخصصة
  const data = { ...defaultPageData, ...pageData };
  
  // توليد العنوان والوصف
  const title = generateDynamicTitle(pageName, data);
  const description = generateDynamicDescription(pageName, data);
  
  // تحديد الصورة المناسبة
  let image = data.image || data.defaultImage;
  
  // تحديد نوع البطاقة
  let cardType = "summary_large_image";
  
  // إنشاء كائن Twitter Card
  return {
    card: cardType,
    title,
    description,
    image
  };
}

/**
 * توليد HTML لعلامات الميتا الديناميكية
 * @param {string} pageName - اسم الصفحة
 * @param {object} pageData - بيانات إضافية للصفحة
 * @returns {string} - HTML لعلامات الميتا
 */
function generateMetaTags(pageName, pageData = {}) {
  // دمج البيانات الافتراضية مع البيانات المخصصة
  const data = { ...defaultPageData, ...pageData };
  
  // توليد البيانات الأساسية
  const title = generateDynamicTitle(pageName, data);
  const description = generateDynamicDescription(pageName, data);
  const keywords = generateDynamicKeywords(pageName, data);
  
  // توليد بيانات Open Graph و Twitter Card
  const og = generateOpenGraphData(pageName, data);
  const twitter = generateTwitterCardData(pageName, data);
  
  // إنشاء HTML لعلامات الميتا
  let metaTags = `
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <meta name="keywords" content="${keywords}" />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="${og.type}" />
    <meta property="og:url" content="${og.url}" />
    <meta property="og:title" content="${og.title}" />
    <meta property="og:description" content="${og.description}" />
    <meta property="og:image" content="${og.image}" />
    <meta property="og:site_name" content="${og.siteName}" />
    <meta property="og:locale" content="${og.locale}" />
    
    <!-- Twitter -->
    <meta name="twitter:card" content="${twitter.card}" />
    <meta name="twitter:title" content="${twitter.title}" />
    <meta name="twitter:description" content="${twitter.description}" />
    <meta name="twitter:image" content="${twitter.image}" />
  `;
  
  return metaTags;
}

module.exports = {
  generateDynamicTitle,
  generateDynamicDescription,
  generateDynamicKeywords,
  generateOpenGraphData,
  generateTwitterCardData,
  generateMetaTags
};
