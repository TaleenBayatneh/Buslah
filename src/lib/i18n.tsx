import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "ar" | "en";

const translations = {
  // Header
  "nav.home": { ar: "الرئيسية", en: "Home" },
  "nav.about": { ar: "من نحن", en: "About" },
  "nav.universities": { ar: "بوابة الجامعات", en: "Universities Portal" },
  "nav.chat": { ar: "الشات", en: "Chat" },
  "header.menu": { ar: "القائمة", en: "Menu" },
  "header.startChat": { ar: "ابدأ الشات", en: "Start Chat" },
  "header.brand": { ar: "بوصلة", en: "Boslah" },
  "header.brandSub": { ar: "BOSLAH · فلسطين", en: "BOSLAH · Palestine" },

  // Index hero
  "hero.tag": { ar: "لطلاب التوجيهي في فلسطين •", en: "For Tawjihi students in Palestine •" },
  "hero.title1": { ar: "حدّد", en: "Set" },
  "hero.title2": { ar: "اتجاهك", en: "your direction" },
  "hero.title3": { ar: "نحو التخصص الصح", en: "toward the right major" },
  "hero.desc": {
    ar: "بوصلة — أول مرشد ذكي يفهم واقع الطالب الفلسطيني. يحلّل معدلك، ميزانية عائلتك، وموقعك الجغرافي ليرسم لك أوضح طريق نحو جامعتك الأنسب.",
    en: "Boslah — the first smart guide that understands the Palestinian student's reality. It analyzes your grade, your family's budget, and your location to draw the clearest path toward your best-fit university.",
  },
  "hero.descBold": { ar: "بوصلة", en: "Boslah" },
  "hero.cta": { ar: "ابدأ رحلتك مع بوصلة", en: "Start your journey with Boslah" },
  "hero.howWorks": { ar: "كيف تعمل بوصلة؟", en: "How does Boslah work?" },
  "hero.scrollHint": { ar: "اسحب للأسفل لتكتشف المزيد", en: "Scroll down to discover more" },
  "hero.privacy": { ar: "بياناتك سرية تماماً.", en: "Your data is completely private." },
  "hero.compass.north": { ar: "شمال · علوم", en: "N · Science" },
  "hero.compass.east": { ar: "شرق · أدبي", en: "E · Arts" },
  "hero.compass.south": { ar: "جنوب · تجاري", en: "S · Commerce" },
  "hero.compass.west": { ar: "غرب · مهني", en: "W · Vocational" },
  "hero.suggestion": { ar: "اقتراح بوصلة", en: "Boslah suggestion" },
  "hero.match": { ar: "مطابقة", en: "match" },

  // Suggestions
  "sug.cs": { ar: "هندسة الحاسوب", en: "Computer Engineering" },
  "sug.cs.uni": { ar: "جامعة بيرزيت", en: "Birzeit University" },
  "sug.med": { ar: "الطب البشري", en: "Human Medicine" },
  "sug.med.uni": { ar: "جامعة النجاح", en: "An-Najah University" },
  "sug.biz": { ar: "إدارة الأعمال", en: "Business Administration" },
  "sug.biz.uni": { ar: "الجامعة العربية الأمريكية", en: "Arab American University" },
  "sug.pharm": { ar: "الصيدلة", en: "Pharmacy" },
  "sug.pharm.uni": { ar: "جامعة الأزهر", en: "Al-Azhar University" },
  "sug.design": { ar: "تصميم الجرافيك", en: "Graphic Design" },
  "sug.design.uni": { ar: "جامعة بيت لحم", en: "Bethlehem University" },
  "sug.civil": { ar: "هندسة مدنية", en: "Civil Engineering" },
  "sug.civil.uni": { ar: "جامعة بوليتكنك فلسطين", en: "Palestine Polytechnic University" },

  // Four directions
  "dirs.tag": { ar: "الجهات الأربع", en: "The Four Directions" },
  "dirs.title1": { ar: "بوصلة", en: "Boslah" },
  "dirs.title2": { ar: "ترشدك من أربع جهات", en: "guides you from four directions" },
  "dirs.subtitle": { ar: "نأخذ كل العوامل المؤثرة في قرارك ونجمعها لنمنحك رؤية واضحة لمستقبلك.", en: "We take every factor that affects your decision and combine them to give you a clear vision of your future." },
  "dirs.n.dir": { ar: "شمال", en: "North" },
  "dirs.n.t": { ar: "ميولك وقدراتك", en: "Your interests & abilities" },
  "dirs.n.x": { ar: "نحلل فرعك ومعدلك بالتوجيهي ونربطهم بالتخصصات الواقعية المتاحة لك.", en: "We analyze your stream and Tawjihi grade and link them to the realistic majors available to you." },
  "dirs.e.dir": { ar: "شرق", en: "East" },
  "dirs.e.t": { ar: "وضعك المادي", en: "Your financial situation" },
  "dirs.e.x": { ar: "ميزانية عائلتك، رسوم الجامعات، فرص المنح والتنافس.", en: "Your family budget, university fees, scholarship opportunities and competition." },
  "dirs.s.dir": { ar: "جنوب", en: "South" },
  "dirs.s.t": { ar: "موقعك الجغرافي", en: "Your geographic location" },
  "dirs.s.x": { ar: "من غزة للضفة — نحسب المواصلات والسكن ونرشّح الأقرب لمنطقتك.", en: "From Gaza to the West Bank — we factor transport and housing and recommend what's closest to your area." },
  "dirs.w.dir": { ar: "غرب", en: "West" },
  "dirs.w.t": { ar: "شغفك ومستقبلك", en: "Your passion & future" },
  "dirs.w.x": { ar: "نطابق طموحك مع التخصصات المطلوبة فعلياً في سوق العمل الفلسطيني والعربي.", en: "We match your ambition with majors actually in demand in the Palestinian and Arab job market." },

  // Journey
  "journey.title1": { ar: "رحلتك مع", en: "Your journey with" },
  "journey.title2": { ar: "بثلاث محطات", en: "in three stops" },
  "journey.subtitle": { ar: "من السؤال الأول حتى الإحداثيات النهائية لجامعتك.", en: "From the first question to the final coordinates of your university." },
  "journey.s1.t": { ar: "احكِ لبوصلة عن نفسك", en: "Tell Boslah about yourself" },
  "journey.s1.x": { ar: "فرعك، معدلك، أين تسكن، وميزانيتك. خذ راحتك وتحدث بالعامية.", en: "Your stream, grade, where you live, and your budget. Take your time and talk casually." },
  "journey.s2.t": { ar: "بوصلة تحلل وتقارن", en: "Boslah analyzes & compares" },
  "journey.s2.x": { ar: "نطابق بياناتك مع قاعدة معطيات الجامعات لحظياً.", en: "We match your data against the university database in real time." },
  "journey.s3.t": { ar: "احصل على إحداثياتك", en: "Get your coordinates" },
  "journey.s3.x": { ar: "قائمة مرتبة بالتخصصات الأنسب لك مع تفاصيل كل جامعة.", en: "A ranked list of the most suitable majors with details for each university." },

  // Live preview
  "preview.tag": { ar: "محادثة حقيقية", en: "Real conversation" },
  "preview.title": { ar: "كيف بوصلة بتحكي معك", en: "How Boslah talks with you" },
  "preview.desc": { ar: "محادثة طبيعية بالعربية. اسأل أي سؤال يخطر ببالك عن التخصصات، الجامعات، الرسوم، أو فرص العمل وبوصلة بتجاوبك بثقة وشفافية.", en: "Natural conversation. Ask any question about majors, universities, fees, or job opportunities, and Boslah answers with confidence and transparency." },
  "preview.try": { ar: "جرّب المحادثة الآن", en: "Try the chat now" },
  "preview.online": { ar: "متصل الآن", en: "Online now" },
  "preview.bot1": { ar: "أهلاً فيك! 🎉 مبروك نجاحك بالتوجيهي. خبّرني، شو فرعك ومعدلك؟", en: "Hi! 🎉 Congrats on passing Tawjihi. Tell me, what's your stream and grade?" },
  "preview.user1": { ar: "علمي، معدلي ٨٧.٤٪ وساكن برام الله.", en: "Scientific, my grade is 87.4% and I live in Ramallah." },
  "preview.bot2": { ar: "ممتاز! حسب إحداثياتك، أقرب وأنسب خيار:", en: "Excellent! Based on your coordinates, the closest and best fit:" },
  "preview.bot2.major": { ar: "هندسة البرمجيات", en: "Software Engineering" },
  "preview.bot2.uni": { ar: "جامعة بيرزيت · رام الله", en: "Birzeit University · Ramallah" },

  // Universities CTA
  "uniCta.tag": { ar: "للجامعات", en: "For Universities" },
  "uniCta.title": { ar: "هل تمثّل جامعة؟ ارفع بياناتك بسهولة", en: "Represent a university? Upload your data easily" },
  "uniCta.desc": { ar: "وفّرنا لك لوحة تحكم خاصة لرفع ملفات التخصصات، رسوم الساعة، ومعدلات القبول. بياناتك تصل مباشرة لقاعدة بيانات بوصلة ليستفيد منها كل طالب فلسطيني.", en: "We've prepared a dashboard to upload majors, hourly fees, and admission rates. Your data goes straight into Boslah's database to benefit every Palestinian student." },
  "uniCta.btn": { ar: "بوابة الجامعات", en: "Universities Portal" },
  "uniCta.b1": { ar: "رفع ملفات Excel/CSV بسهولة", en: "Easy Excel/CSV uploads" },
  "uniCta.b2": { ar: "معالجة تلقائية عبر workflow متكامل", en: "Automatic processing via integrated workflow" },
  "uniCta.b3": { ar: "متابعة حالة كل ملف", en: "Track each file's status" },
  "uniCta.b4": { ar: "رفع ملفات التخصصات (اذهب لصفحة الرفع)", en: "Upload majors files (go to upload page)" },

  // Final CTA
  "finalCta.title1": { ar: "بوصلتك جاهزة.", en: "Your compass is ready." },
  "finalCta.title2": { ar: "والاتجاه بيدك.", en: "The direction is in your hands." },
  "finalCta.desc": { ar: "لا تترك أهم قرار بحياتك للصدفة. ابدأ الآن مع بوصلة واحصل على إحداثيات دقيقة لتخصصك الجامعي.", en: "Don't leave the most important decision of your life to chance. Start now with Boslah and get precise coordinates for your university major." },
  "finalCta.btn": { ar: "ابدأ مع بوصلة مجاناً", en: "Start with Boslah for free" },

  // Footer
  "footer.tagline": { ar: "بوصلتك نحو التخصص الجامعي المناسب لطلاب التوجيهي في فلسطين.", en: "Your compass toward the right university major for Tawjihi students in Palestine." },
  "footer.links": { ar: "روابط", en: "Links" },
  "footer.forUnis": { ar: "للجامعات", en: "For Universities" },
  "footer.forUnisDesc": { ar: "هل أنت ممثل جامعة؟ اطّلع على بوابة الجامعات أو ارفع بيانات التخصصات بسهولة.", en: "Represent a university? Visit the Universities Portal or upload your majors data easily." },
  "footer.portalLink": { ar: "بوابة الجامعات ←", en: "Universities Portal →" },
  "footer.copy": { ar: "صُنع بـ ♥ لطلاب فلسطين. جميع الحقوق محفوظة.", en: "Made with ♥ for Palestine's students. All rights reserved." },

  // Chat
  "chat.botName": { ar: "بوصلة", en: "Boslah" },
  "chat.role": { ar: "مرشدك الأكاديمي · متصل", en: "Your academic guide · Online" },
  "chat.init": { ar: "أهلاً وسهلاً فيك في بوصلة! 🧭 أنا مرشدك الذكي لاختيار تخصصك الجامعي. خبّرني عن حالك: شو فرعك في التوجيهي ومعدلك؟", en: "Welcome to Boslah! 🧭 I'm your smart guide for choosing your university major. Tell me about yourself: what's your Tawjihi stream and grade?" },
  "chat.uniPlaceholder": { ar: "اسم الجامعة (اختياري)...", en: "University name (optional)..." },
  "chat.askPlaceholder": { ar: "اكتب سؤالك...", en: "Type your question..." },
  "chat.thinking": { ar: "بوصلة بتفكر...", en: "Boslah is thinking..." },
  "chat.notLinked": { ar: "⚠️ لم يتم ربط الشات بـ n8n بعد. أضف عنوان الـ webhook في إعدادات المشروع لتفعيل الردود الذكية.", en: "⚠️ The chat is not linked to n8n yet. Add the webhook URL in project settings to enable smart replies." },
  "chat.received": { ar: "تم استلام رسالتك.", en: "Your message was received." },
  "chat.connectErr": { ar: "تعذّر الاتصال بالمساعد", en: "Could not reach the assistant" },

  // About
  "about.title": { ar: "من نحن ·", en: "About ·" },
  "about.intro": { ar: "نحن فريق من طلبة هندسة الحاسوب في جامعة بيرزيت، قمنا بتطوير مشروع تخرج يتمثل في محادثة ذكية ومتقدمة موجهة لطلبة التوجيهي، بهدف تسهيل الوصول إلى تقنيات الذكاء الاصطناعي وجعلها أداة مفيدة ومتاحة للجميع.", en: "We are a team of Computer Engineering students at Birzeit University. We built a graduation project: an advanced smart chat aimed at Tawjihi students, making AI accessible and useful for everyone." },
  "about.mission": { ar: "رسالتنا", en: "Our Mission" },
  "about.missionX": { ar: "نؤمن بأن كل طالب يستحق إرشاداً مبنياً على بياناته الفعلية: معدله، إمكاناته المالية، وموقعه الجغرافي — بدلاً من النصائح العامة.", en: "We believe every student deserves guidance grounded in their actual data: grade, financial means, and location — instead of generic advice." },
  "about.how": { ar: "كيف نعمل؟", en: "How do we work?" },
  "about.howX": { ar: "بنينا بوصلة كشات بوت ذكي مدعوم بـ workflow متطور على n8n، يجمع بيانات حقيقية من مختلف الجامعات ويحلّلها فوراً ليقترح عليك الخيارات الأنسب لظروفك.", en: "We built Boslah as a smart chatbot powered by an advanced n8n workflow that gathers real data from various universities and analyzes it instantly to suggest the best options for your situation." },
  "about.unis": { ar: "للجامعات", en: "For Universities" },
  "about.unisX": { ar: "وفّرنا لوحة تحكم تتيح للجامعات رفع بياناتها (تخصصات، رسوم، معدلات قبول) لتصل لكل طالب يبحث عن مكانه الأمثل.", en: "We provide a dashboard for universities to upload their data (majors, fees, admission rates) so it reaches every student looking for the right fit." },

  // Universities upload
  "unis.title1": { ar: "رفع بيانات", en: "Upload" },
  "unis.title2": { ar: "الجامعة", en: "University Data" },
  "unis.subtitle": { ar: "هذه الصفحة موجّهة للجامعات الراغبة بإضافة تخصصاتها إلى قاعدة بيانات بوصلة. يرجى تجهيز ملف Excel أو CSV وفق التنسيق المبيّن أدناه ثم رفعه في النموذج بالأسفل.", en: "This page is for universities wishing to add their majors to Boslah's database. Please prepare an Excel or CSV file in the format below and upload it in the form." },
  "unis.cols": { ar: "الأعمدة المطلوبة في الملف", en: "Required columns in the file" },
  "unis.colsHint": { ar: "يجب أن يحتوي الملف على الأعمدة التالية بنفس الترتيب، مع صفّ عناوين في الأعلى:", en: "The file must contain the following columns in the same order, with a header row at the top:" },
  "unis.h.col": { ar: "اسم العمود", en: "Column name" },
  "unis.h.key": { ar: "المعرّف التقني", en: "Technical key" },
  "unis.h.ex": { ar: "مثال", en: "Example" },
  "unis.h.note": { ar: "ملاحظات", en: "Notes" },
  "unis.upload": { ar: "رفع الملف", en: "Upload file" },
  "unis.uniName": { ar: "اسم الجامعة", en: "University name" },
  "unis.uniNamePh": { ar: "مثال: جامعة بيرزيت", en: "Example: Birzeit University" },
  "unis.uniNameHint": { ar: "(اختياري) أدخل اسم الجامعة إذا لم يكن موجوداً في الملف", en: "(Optional) Enter the university name if it's not in the file" },
  "unis.pickFile": { ar: "اختر الملف", en: "Choose file" },
  "unis.sending": { ar: "جاري الإرسال...", en: "Sending..." },
  "unis.sendBtn": { ar: "إرسال الملف", en: "Send file" },
  "unis.disclaimer": { ar: "بإرسالك للملف فإنك توافق على دمج هذه البيانات في قاعدة بيانات بوصلة لخدمة طلاب التوجيهي.", en: "By submitting, you agree to merge this data into Boslah's database to serve Tawjihi students." },
  "unis.done.t": { ar: "تم استلام ملفك بنجاح", en: "Your file was received successfully" },
  "unis.done.x": { ar: "سنراجع البيانات وندمجها في قاعدة بيانات بوصلة قريباً.", en: "We'll review the data and merge it into Boslah's database soon." },
  "unis.done.again": { ar: "رفع ملف آخر", en: "Upload another file" },
  "unis.err.pick": { ar: "اختر ملفاً أولاً", en: "Pick a file first" },
  "unis.err.size": { ar: "الحد الأقصى ١٠ ميغابايت", en: "Max size 10 MB" },
  "unis.err.webhook": { ar: "رابط الويبهوك غير مهيأ بعد. يرجى التواصل مع فريق بوصلة.", en: "Webhook URL is not configured yet. Please contact the Boslah team." },
  "unis.err.fail": { ar: "فشل الإرسال", en: "Send failed" },
  "unis.err.unknown": { ar: "خطأ غير متوقع", en: "Unexpected error" },
  "unis.success": { ar: "تم إرسال الملف بنجاح! سنراجع البيانات قريباً.", en: "File sent successfully! We'll review soon." },

  // Language toggle
  "lang.toggle": { ar: "English", en: "العربية" },
} as const;

export type TKey = keyof typeof translations;

interface I18nCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
  t: (key: TKey) => string;
}

const Ctx = createContext<I18nCtx | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ar");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("boslah.lang");
      if (saved === "en" || saved === "ar") setLangState(saved);
    } catch {}
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
    }
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    try { localStorage.setItem("boslah.lang", l); } catch {}
  };

  const t = (key: TKey): string => {
    const entry = translations[key];
    if (!entry) return key;
    return entry[lang] ?? entry.ar;
  };

  return (
    <Ctx.Provider value={{ lang, setLang, toggle: () => setLang(lang === "ar" ? "en" : "ar"), t }}>
      {children}
    </Ctx.Provider>
  );
}

export function useI18n() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useI18n must be used inside I18nProvider");
  return c;
}
