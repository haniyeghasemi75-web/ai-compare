export type PlanKey = string;

// اسکیما ۲۰ فاکتوره پلتفرم نامبرلند
export interface AIScores {
  coding: number;
  writing: number;
  research: number;
  files: number;
  image: number;
  video: number;
  voice: number;
  persian: number;
  speed: number;
  price: number;
  privacy: number;
  long_context: number;
  agent: number;
  data_analysis: number;
  tools: number;
  reasoning: number;
  accuracy: number;
  general: number;
  content_creation: number;
  execution: number;
}

export interface AIFactorMetadata {
  id: keyof AIScores;
  name: string;
  description: string;
}

export interface AIBrand {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  plans: AIPlan[];
  scores: AIScores;
  strengths: string[];
  weaknesses: string[];
  suitableFor: string[];
}

export interface AIPlan {
  id: PlanKey;
  planName: string;
  isFree: boolean;
  pricingText: string;
  numberlandProductUrl: string;
  numberlandProductName: string;
  duration: string;
  accountType: string;
  features: string[];
  pros: string[];
  weaknesses: string[];
  recommended?: boolean;
}

export interface Question {
  id: string;
  question: string;
  options: { label: string; weights: Partial<AIScores> }[];
}

// دیتابیس توصیفی فاکتورها
export const comparisonFactorsDatabase: AIFactorMetadata[] = [
  { id: "coding", name: "برنامه‌نویسی", description: "توانایی تولید، تحلیل و دیباگ کد و کمک در پروژه‌های نرم‌افزاری" },
  { id: "writing", name: "نویسندگی و تولید متن", description: "کیفیت تولید مقاله، ایمیل، متن تبلیغاتی و نوشته‌های خلاقانه" },
  { id: "research", name: "تحقیق و جستجو", description: "توانایی جمع‌آوری، تحلیل و خلاصه‌سازی اطلاعات" },
  { id: "files", name: "تحلیل فایل‌ها", description: "توانایی کار با PDF، Word، Excel و اسناد حجیم" },
  { id: "image", name: "تولید و تحلیل تصویر", description: "ساخت، ویرایش و درک تصاویر" },
  { id: "video", name: "ویدیو", description: "توانایی کار با محتوای ویدیویی و ابزارهای مرتبط" },
  { id: "voice", name: "صوت و مکالمه صوتی", description: "کیفیت تعامل صوتی و پردازش صدا" },
  { id: "persian", name: "زبان فارسی", description: "کیفیت پاسخ‌دهی، درک و تولید محتوای فارسی" },
  { id: "speed", name: "سرعت پاسخ‌گویی", description: "سرعت تولید پاسخ و تجربه کاربری" },
  { id: "price", name: "ارزش خرید", description: "نسبت امکانات به هزینه پرداختی" },
  { id: "privacy", name: "حریم خصوصی", description: "سطح حفاظت از داده‌ها و اطلاعات کاربر" },
  { id: "long_context", name: "درک متن‌های طولانی", description: "توانایی پردازش مکالمات و اسناد بسیار طولانی" },
  { id: "agent", name: "قابلیت‌های Agent", description: "توانایی انجام وظایف چندمرحله‌ای و خودکارسازی کارها" },
  { id: "data_analysis", name: "تحلیل داده", description: "توانایی تحلیل داده، جدول و اطلاعات عددی" },
  { id: "tools", name: "ابزارها و یکپارچگی‌ها", description: "تعداد و کیفیت ابزارها، افزونه‌ها و اتصال به سرویس‌ها" },
  { id: "reasoning", name: "استدلال", description: "توانایی حل مسائل پیچیده و تحلیل منطقی" },
  { id: "accuracy", name: "دقت پاسخ", description: "میزان صحت و قابل اعتماد بودن پاسخ‌ها" },
  { id: "general", name: "استفاده عمومی", description: "کیفیت کلی برای کاربران روزمره" },
  { id: "content_creation", name: "تولید محتوا", description: "کیفیت و توانایی تخصصی در فرآیندهای تولید محتوای متنی صنف محتوا" },
  { id: "execution", name: "اجرای مستقیم کد", description: "توانایی کامپایل، تست و اجرای زنده کدهای برنامه‌نویسی در محیط چت" }
];

// دیتابیس امتیازها، پلن‌ها و متون نهایی برندها
export const aiBrandsDatabase: AIBrand[] = [
  {
    id: "chatgpt",
    name: "ChatGPT",
    nameEn: "ChatGPT",
    description: "دستیار هوشمند هوش مصنوعی چندمنظوره برای تولید محتوا، برنامه‌نویسی، تحلیل فایل، تحقیق، تصویر، صوت و انجام کارهای روزمره.",
    plans: [
      { id: "chatgpt_go_1m", planName: "ChatGPT Go یک ماهه", isFree: false, pricingText: "پلن اقتصادی چت جی‌پی تی", numberlandProductUrl: "https://numberland.com", numberlandProductName: "ChatGPT Go", duration: "یک ماهه", accountType: "اشتراکی اقتصادی", features: [], pros: [], weaknesses: [], recommended: true },
      { id: "chatgpt_plus_1m_shared", planName: "ChatGPT Plus یک ماهه (اوپن اشتراک)", isFree: false, pricingText: "دسترسی اشتراکی به پلاس", numberlandProductUrl: "https://numberland.com", numberlandProductName: "ChatGPT Plus Shared", duration: "یک ماهه", accountType: "اشتراکی عمومی", features: [], pros: [], weaknesses: [] },
      { id: "chatgpt_plus_1m_dedicated", planName: "ChatGPT Plus یک ماهه (اکانت اختصاصی)", isFree: false, pricingText: "اکانت ۱۰۰٪ اختصاصی روی ایمیل شما", numberlandProductUrl: "https://numberland.com", numberlandProductName: "ChatGPT Plus Dedicated", duration: "یک ماهه", accountType: "اختصاصی مستقل", features: [], pros: [], weaknesses: [], recommended: true }
    ],
    scores: { coding: 92, writing: 91, research: 93, files: 90, image: 92, video: 70, voice: 96, persian: 92, speed: 90, price: 72, privacy: 75, long_context: 85, agent: 92, data_analysis: 92, tools: 94, reasoning: 91, accuracy: 89, general: 95, content_creation: 93, execution: 88 },
    strengths: ["اکوسیستم کامل ابزارها", "تولید تصویر با کیفیت", "قابلیت مکالمه صوتی طبیعی", "توانایی بالا در کار با فایل‌ها"],
    weaknesses: ["محدودیت ظرفیت در ساعات شلوغی برای پلن‌های اشتراکی"],
    suitableFor: []
  },
  {
    id: "claude",
    name: "Claude",
    nameEn: "Claude",
    description: "محصول شرکت Anthropic، یک دستیار هوش مصنوعی با تمرکز بر تحلیل متن‌های طولانی، نگارش طبیعی، استدلال، برنامه‌نویسی و بررسی اسناد پیچیده.",
    plans: [
      { id: "claude_pro", planName: "Claude Pro", isFree: false, pricingText: "اشتراک رسمی پرو کلاود اختصاصی", numberlandProductUrl: "https://numberland.com", numberlandProductName: "Claude Pro Dedicated", duration: "یک ماهه", accountType: "اختصاصی", features: [], pros: [], weaknesses: [], recommended: true },
      { id: "claude_max", planName: "Claude Max", isFree: false, pricingText: "دسترسی با بالاترین حد مجاز توکن", numberlandProductUrl: "https://numberland.com", numberlandProductName: "Claude Max Subscription", duration: "یک ماهه", accountType: "نیمه اختصاصی", features: [], pros: [], weaknesses: [], recommended: true }
    ],
    scores: { coding: 95, writing: 97, research: 82, files: 96, image: 45, video: 20, voice: 30, persian: 90, speed: 85, price: 60, privacy: 80, long_context: 97, agent: 84, data_analysis: 91, tools: 78, reasoning: 95, accuracy: 93, general: 88, content_creation: 96, execution: 65 },
    strengths: ["برترین ابزار در نگارش روان و ادبی فارسی", "تحلیل دقیق کدهای چندفایلی", "پشتیبانی از کانتکست بسیار طولانی"],
    weaknesses: ["عدم وجود ابزار بومی تولید تصویر"],
    suitableFor: []
  },
  {
    id: "gemini",
    name: "Gemini",
    nameEn: "Gemini",
    description: "محصول شرکت گوگل، یک دستیار هوش مصنوعی چندمنظوره با اتصال بومی به موتور جستجو و ابزارهای اکوسیستم گوگل، مناسب برای تحقیق، پردازش اطلاعات آنلاین و امور روزمره.",
    plans: [
      { id: "google_ai_pro_1y_family", planName: "Google AI Pro یکساله (فیمیلی)", isFree: false, pricingText: "اشتراک اقتصادی یکساله فیمیلی گوگل", numberlandProductUrl: "https://numberland.com", numberlandProductName: "Google AI Pro 1Y Family", duration: "یکساله", accountType: "فیمیلی اکانت", features: [], pros: [], weaknesses: [], recommended: true },
      { id: "google_ai_pro_1m_family", planName: "Google AI Pro یک ماهه (فیمیلی)", isFree: false, pricingText: "اشتراک یک ماهه فیمیلی گوگل", numberlandProductUrl: "https://numberland.com", numberlandProductName: "Google AI Pro 1M Family", duration: "یک ماهه", accountType: "فیمیلی اکانت", features: [], pros: [], weaknesses: [], recommended: true }
    ],
    scores: { coding: 87, writing: 88, research: 95, files: 92, image: 91, video: 85, voice: 88, persian: 89, speed: 92, price: 78, privacy: 72, long_context: 95, agent: 88, data_analysis: 89, tools: 96, reasoning: 88, accuracy: 88, general: 91, content_creation: 88, execution: 55 },
    strengths: ["اتصال بومی قدرتمند به وب زنده و گوگل", "یکپارچگی کامل با Google Workspace", "درک فوق‌العاده ویدیوهای طولانی"],
    weaknesses: ["لحن پاسخ‌های فارسی گاهی حالت ترجمه مکانیکی دارد"],
    suitableFor: []
  },
  {
    id: "grok",
    name: "Grok",
    nameEn: "Grok",
    description: "محصول شرکت xAI، یک دستیار هوش مصنوعی با تمرکز بر پاسخ‌گویی سریع، دسترسی به اطلاعات لحظه‌ای، تحلیل محتوا و تعامل با داده‌های پلتفرم X.",
    plans: [
      { id: "supergrok_1m", planName: "SuperGrok یک ماهه", isFree: false, pricingText: "اشتراک یک ماهه رسمی سوپرگراک اختصاصی", numberlandProductUrl: "https://numberland.com", numberlandProductName: "SuperGrok 1M", duration: "یک ماهه", accountType: "اختصاصی X", features: [], pros: [], weaknesses: [], recommended: true }
    ],
    scores: { coding: 83, writing: 82, research: 88, files: 78, image: 84, video: 60, voice: 75, persian: 82, speed: 95, price: 72, privacy: 70, long_context: 80, agent: 75, data_analysis: 76, tools: 74, reasoning: 84, accuracy: 82, general: 85, content_creation: 80, execution: 40 },
    strengths: ["دسترسی بی‌واسطه به اخبار و ترندهای پلتفرم X", "سرعت پاسخ‌گویی بسیار بالا", "لحن تعاملی صریح"],
    weaknesses: ["اکوسیستم افزونه‌ها و ابزارهای جانبی محدودتر است"],
    suitableFor: []
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    nameEn: "DeepSeek",
    description: "محصول شرکت DeepSeek، یک دستیار هوش مصنوعی با تمرکز بر استدلال، برنامه‌نویسی، حل مسئله و ارائه مدل‌های قدرتمند با هزینه کمتر نسبت به بسیاری از رقبا.",
    plans: [
      { id: "deepseek_r1", planName: "DeepSeek R1 چت", isFree: true, pricingText: "پلن پایه رایگان مدل R1", numberlandProductUrl: "https://numberland.com", numberlandProductName: "DeepSeek Free Chat", duration: "نامحدود", accountType: "رایگان", features: [], pros: [], weaknesses: [], recommended: true }
    ],
    scores: { coding: 90, writing: 76, research: 80, files: 82, image: 0, video: 0, voice: 10, persian: 82, speed: 84, price: 98, privacy: 72, long_context: 84, agent: 70, data_analysis: 84, tools: 45, reasoning: 94, accuracy: 88, general: 83, content_creation: 75, execution: 55 },
    strengths: ["قدرت استدلال ریاضی و منطقی فوق‌العاده در مدل R1", "هزینه بسیار پایین و مقرون به صرفه بودن عالی", "عملکرد عالی در برنامه‌نویسی فنی"],
    weaknesses: ["فقدان کامل قابلیت‌های صوتی و مالتی‌مدیا بومی"],
    suitableFor: []
  }
];

// لیست تخصص‌ها
export const useCasesList = [
  { id: "programmer", label: "💻 برنامه‌نویس و توسعه‌دهنده" },
  { id: "content", label: "✍️ تولیدکننده محتوا و نویسنده" },
  { id: "student", label: "🎓 دانشجو و یادگیری" },
  { id: "designer", label: "🎨 طراح و محتوای بصری" },
  { id: "digital_marketer", label: "📢 دیجیتال مارکتر" },
  { id: "seo", label: "🔍 متخصص سئو (SEO)" },
  { id: "business", label: "🚀 مدیر کسب‌وکار و کارآفرین" },
  { id: "data_analyst", label: "📊 تحلیلگر داده" },
  { id: "teacher", label: "👨‍🏫 مدرس و آموزش یار" },
  { id: "researcher", label: "🔬 پژوهشگر و محقق" },
  { id: "general", label: "👤 استفاده شخصی و روزمره" }
];

// بانک سوالات تخصصی
export const dynamicCategoryQuestions: Record<string, Question[]> = {
  programmer: [
    { id: "p1", question: "بیشتر برای چه تسکی از هوش مصنوعی استفاده می‌کنید؟", options: [{ label: "تولید کدهای تمیز جدید", weights: { coding: 5 } }, { label: "رفع باگ و نوشتن تست", weights: { coding: 5, accuracy: 4 } }] },
    { id: "p2", question: "اندازه پروژه‌های شما معمولاً در چه سطحی است؟", options: [{ label: "پروژه‌های بزرگ چندفایلی", weights: { long_context: 5, files: 4 } }, { label: "اسکریپت‌نویسی مستقل و کوچک", weights: { speed: 5, coding: 4 } }] },
    { id: "p3", question: "مهم‌ترین اولویت فنی شما چیست؟", options: [{ label: "دقت بالا و استدلال منطقی", weights: { accuracy: 5, reasoning: 5 } }, { label: "پشتیبانی از Agent و اتوماسیون", weights: { agent: 5 } }] },
    { id: "p4", question: "آیا نیاز به اجرای مستقیم و تست کدهای تولید شده دارید؟", options: [{ label: "بله، اجرای مستقیم کد در چت مهم است", weights: { execution: 5 } }, { label: "خیر، کپی کردن کد کافی است", weights: { speed: 3 } }] },
    { id: "p5", question: "میزان استفاده شما از معماری و طراحی سیستم چقدر است؟", options: [{ label: "زیاد، برای طراحی ساختار کلان پروژه", weights: { coding: 5, reasoning: 5 } }, { label: "کم، بیشتر در سطح فانکشن‌ها", weights: { coding: 4 } }] }
  ],
  content: [
    { id: "c1", question: "چه نوع محتوایی بیشتر تولید می‌کنید؟", options: [{ label: "مقاله سایت و کپی‌رایتینگ رسمی", weights: { content_creation: 5, persian: 5 } }, { label: "کپشن شبکه اجتماعی و بنر کوتاه", weights: { content_creation: 4, image: 3 } }] },
    { id: "c2", question: "مهم‌ترین نیاز شما در فرآیند نگارش چیست؟", options: [{ label: "متن طبیعی و حفظ روان بودن لحن", weights: { writing: 5 } }, { label: "ایده‌پردازی و تحقیق وب زنده", weights: { research: 5, speed: 4 } }] },
    { id: "c3", question: "زبان اصلی محتوای خروجی شما چیست؟", options: [{ label: "کاملاً زبان شیوای فارسی", weights: { persian: 5 } }, { label: "انگلیسی یا ترکیب هر دو زبان", weights: { general: 4 } }] },
    { id: "c4", question: "چقدر به ایده‌پردازی تصاویر متکی هستید؟", options: [{ label: "زیاد، تصاویر بنرها بخش ثابتی از کار من است", weights: { image: 5 } }, { label: "کم، کار من صرفاً بر پایه‌ی متن است", weights: { image: 1 } }] },
    { id: "c5", question: "سرعت پاسخ‌دهی در ددلاین‌های فشرده چقدر مهم است؟", options: [{ label: "بسیار زیاد، سرعت برایم کلیدی است", weights: { speed: 5 } }, { label: "کیفیت ادبی و عدم رباتیک بودن اولویت اول است", weights: { speed: 2, accuracy: 4 } }] }
  ],
  student: [
    { id: "s1", question: "بیشتر برای چه تسکی از هوش مصنوعی کمک می‌خواهید؟", options: [{ label: "خلاصه جزوه و فهم مفاهیم سخت", weights: { files: 5, reasoning: 4 } }, { label: "تحقیق دانشگاهی و ترجمه متون", weights: { research: 5, persian: 4 } }] },
    { id: "s2", question: "بیشتر با چه منابعی کار می‌کنید؟", options: [{ label: "کتاب‌ها و فایلهای PDF سنگین", weights: { files: 5, long_context: 4 } }, { label: "فایل‌های متنی معمولی Word", weights: { files: 3 } }] },
    { id: "s3", question: "سبک پاسخ مورد علاقه شما چیست؟", options: [{ label: "مرحله‌به‌مرحله همراه با مثال عملی", weights: { reasoning: 5 } }, { label: "تخصصی، فشرده و سریع", weights: { speed: 5 } }] },
    { id: "s4", question: "آیا نیاز به حل مسائل عددی و تحلیل نمودار دارید؟", options: [{ label: "بله، مسائل ریاضی و تحلیل نمودار دارم", weights: { data_analysis: 5, reasoning: 5 } }, { label: "خیر، رشته من تماماً متنی است", weights: { writing: 4 } }] },
    { id: "s5", question: "مسئله قیمت چقدر برای بودجه شما تعیین‌کننده است؟", options: [{ label: "بسیار زیاد، ترجیح می‌دهم از مدل‌های اقتصادی یا رایگان استفاده کنم", weights: { price: 5 } }, { label: "متوسط، در صورت کیفیت بالا اشتراک تهیه می‌کنم", weights: { price: 2 } }] }
  ],
  designer: [
    { id: "d1", question: "حوزه اصلی طراحی شما کدام است؟", options: [{ label: "تصاویر تبلیغاتی و پوستر سازی", weights: { image: 5, tools: 4 } }, { label: "کانسپت آرت و ایده‌پردازی بصری", weights: { image: 5, reasoning: 4 } }] },
    { id: "d2", question: "بیشتر چه خروجی از هوش مصنوعی می‌خواهید؟", options: [{ label: "طرح خام و ایده اولیه خلاقانه", weights: { image: 4, general: 4 } }, { label: "تصویر نهایی با کیفیت بالا", weights: { image: 5, accuracy: 4 } }] },
    { id: "d3", question: "وضعیت نیاز شما به ساخت ویدیو چیست؟", options: [{ label: "بله، به تولید ویدیو نیاز دارم", weights: { video: 5 } }, { label: "خیر، تمرکزم فقط روی عکس است", weights: { video: 0 } }] },
    { id: "d4", question: "سرعت رندر تصاویر چقدر برای تسک شما اهمیت دارد؟", options: [{ label: "بسیار زیاد، تولید تصویر باید آنی باشد", weights: { speed: 5 } }, { label: "کیفیت بافت و جزئیات اولویت است", weights: { accuracy: 4 } }] },
    { id: "d5", question: "آیا به قابلیت‌های چت صوتی جهت ایده‌پردازی نیاز دارید؟", options: [{ label: "بله، پردازش ایده صوتی برایم مهم است", weights: { voice: 4 } }, { label: "خیر، چت متنی کافی است", weights: { voice: 0 } }] }
  ],
  teacher: [
    { id: "t1", question: "چه نوع محتوای آموزشی تولید می‌کنید؟", options: [{ label: "طراحی درس، آزمون و جزوه‌های متنی", weights: { writing: 5, persian: 5 } }, { label: "اسلایدهای ارائه و تصاویر آموزشی", weights: { image: 4, content_creation: 4 } }] },
    { id: "t2", question: "سطح مخاطبان شما چقدر است؟", options: [{ label: "مدرسه و یادگیری عمومی", weights: { general: 5, persian: 4 } }, { label: "دانشگاه و دوره‌های تخصصی", weights: { reasoning: 5, coding: 3 } }] },
    { id: "t3", question: "بزرگ‌ترین کمک AI به شما چیست؟", options: [{ label: "تصحیح تمرین‌ها و روش تدریس", weights: { reasoning: 5, files: 4 } }, { label: "سرعت بالا در ساخت محتوای آزمون", weights: { speed: 5 } }] },
    { id: "t4", question: "چقدر نیاز به ردیابی مقالات جدید آموزشی دارید؟", options: [{ label: "زیاد، دائماً ترندهای جدید را سرچ می‌کنم", weights: { research: 5 } }, { label: "کم، منابع درسی من ثابت است", weights: { research: 1 } }] },
    { id: "t5", question: "آیا نیاز به ساخت فایل‌های راهنمای سنگین دارید؟", options: [{ label: "بله، فایل‌های PDF راهنمای طولانی تولید می‌کنم", weights: { files: 5, long_context: 4 } }, { label: "خیر، در حد آزمون‌های کوتاه است", weights: { files: 2 } }] }
  ],
  researcher: [
    { id: "r1", question: "حوزه اصلی پژوهش شما چیست؟", options: [{ label: "بررسی مقالات علمی و تحلیل منابع", weights: { research: 5, files: 5, long_context: 5 } }, { label: "تحلیل داده‌های آماری و محاسباتی", weights: { data_analysis: 5, reasoning: 5 } }] },
    { id: "r2", question: "مهم‌ترین دغدغه شما در پاسخ‌های علمی چیست؟", options: [{ label: "دقت اطلاعات، عدم خطا و ذکر منابع", weights: { accuracy: 5, research: 5 } }, { label: "توانایی مقایسه چند سند متناقض", weights: { reasoning: 5, files: 5 } }] },
    { id: "r3", question: "حجم ورودی اسناد شما چقدر است؟", options: [{ label: "کتاب‌ها و مقالات بسیار طولانی", weights: { long_context: 5, files: 5 } }, { label: "گزارش‌های فشرده و محدود", weights: { speed: 5 } }] },
    { id: "r4", question: "چقدر نیاز به کار فرمولی با کدهای آماری دارید؟", options: [{ label: "زیاد، محاسبات پژوهش با کدنویسی همراه است", weights: { coding: 5, execution: 5 } }, { label: "کم، پژوهش من کاملاً توصیفی است", weights: { coding: 1 } }] },
    { id: "r5", question: "آیا نیاز به بررسی آمارهای آنلاین روز دارید؟", options: [{ label: "بله، اتصال به وب برای دیتای زنده مهم است", weights: { research: 5 } }, { label: "خیر، کار من روی اسناد علمی ثابت است", weights: { research: 2 } }] }
  ],
  general: [
    { id: "gq1", question: "بیشترین استفاده روزمره شما چیست؟", options: [{ label: "سوالات عمومی، ترجمه و یادگیری مفاهیم", weights: { general: 5, persian: 4 } }, { label: "سرگرمی، ایده پردازی و تصویرسازی", weights: { image: 4, voice: 4 } }] },
    { id: "gq2", question: "کدام فاکتور برای شما اولویت دارد؟", options: [{ label: "قیمت اکانت و صرفه اقتصادی مفرط", weights: { price: 5 } }, { label: "امکانات زیاد، سرعت و کیفیت جواب", weights: { general: 5, speed: 4 } }] },
    { id: "gq3", question: "چقدر از ابزارهای هوش مصنوعی استفاده می‌کنید؟", options: [{ label: "تسک‌های تفننی و گاه‌به‌گاه", weights: { speed: 5 } }, { label: "استفاده مداوم و روزانه چند ساعته", weights: { general: 5 } }] },
    { id: "gq4", question: "چقدر مکالمه صوتی طبیعی برای شما جذاب است؟", options: [{ label: "زیاد، دوست دارم مکالمه صوتی زنده داشته باشم", weights: { voice: 5 } }, { label: "نیازی ندارم، چت متنی کافی است", weights: { voice: 1 } }] },
    { id: "gq5", question: "آیا نیاز به آپلود فایل‌های متنی یا تصویری معمولی دارید؟", options: [{ label: "بله، گاهی عکس یا فایل آپلود می‌کنم تا تفسیر کند", weights: { files: 4, image: 3 } }, { label: "خیر، فقط سوال متنی می‌پرسم", weights: { files: 1 } }] }
  ]
};

// سوالات عمومی
export const globalQuestionsList: Question[] = [
  { id: "g1", question: "📁 نیاز به پردازش فایل‌های سنگین (PDF/Excel) چقدر جدی است؟", options: [{ label: "بسیار زیاد و حیاتی است", weights: { files: 5 } }, { label: "کم یا متوسط", weights: { files: 2 } }] },
  { id: "g2", question: "🌐 آیا به اتصال آنلاین وب برای دریافت اخبار زنده نیاز دارید؟", options: [{ label: "بله، اطلاعات لحظه‌ای وب برایم کلیدی است", weights: { research: 5 } }, { label: "خیر، داده‌های عمومی آفلاین کافیست", weights: { research: 2 } }] },
  { id: "g3", question: "🤖 چقدر مایلید کارها به صورت خودکار توسط ایجنت‌ها انجام یا کدها مستقیم اجرا شوند؟", options: [{ label: "بله، قابلیت‌های Agent و اجرای کد مهم است", weights: { agent: 5, execution: 5 } }, { label: "خیر، در حد چت معمولی کافی است", weights: { agent: 1, execution: 1 } }] }
];