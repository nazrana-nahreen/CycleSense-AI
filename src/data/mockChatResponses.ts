import { ChatMessage, Language } from '../types';

export interface AssistantResponseRule {
  keywords: string[];
  responseEn: string;
  responseBn: string;
  citations: string[];
  isUrgent?: boolean;
}

export const mockAssistantKnowledge: AssistantResponseRule[] = [
  {
    keywords: ['emergency', 'faint', 'fainting', 'soak', 'soaking', 'bleed heavy', 'hemorrhage', 'unbearable', 'severe collapse', 'অজ্ঞান', 'অতিরিক্ত রক্ত', 'তীব্র ব্যথা'],
    isUrgent: true,
    responseEn: `⚠️ **CRITICAL HEALTH ADVISORY**: Your description indicates symptoms that may require immediate medical attention. 

If you are soaking through 2 or more heavy pads or tampons per hour for 2 or more hours in a row, feeling faint, dizzy when standing, or experiencing sudden, sharp, unbearable abdominal pain, please do not wait.

**Immediate Recommended Actions:**
1. Proceed immediately to the nearest hospital emergency room or urgent gynecology clinic.
2. Have a companion or family member accompany and transport you—do not attempt to drive.
3. Bring your CycleSense logs and a list of any medications you take.`,
    responseBn: `⚠️ **জরুরি স্বাস্থ্য সতর্কতা**: আপনার বিবরণে কিছু অত্যন্ত জটিল লক্ষণ প্রকাশ পাচ্ছে যা অবিলম্বে জরুরি চিকিৎসা দাবি করে।

যদি টানা ২ ঘণ্টা বা তার বেশি প্রতি ঘণ্টায় ২টি বা তার বেশি প্যাড ভিজে যায়, অতিরিক্ত মাথা ঘোরে, দাঁড়াতে গেলে অজ্ঞান হওয়ার উপক্রম হয়, অথবা হঠাৎ তলপেটে তীব্র অসহ্য ব্যথা শুরু হয়, দয়া করে এক মুহূর্তও অপেক্ষা করবেন না।

**জরুরি করণীয় পদক্ষেপ:**
১. অবিলম্বে নিকটস্থ হাসপাতালের জরুরি বিভাগ বা গাইনি বিভাগে যান।
২. একা চলাফেরা করবেন না, দ্রুত পরিবারের সদস্য বা সঙ্গীর সাহায্য নিন।
৩. সাইকেলসেন্স অ্যাপে সংরক্ষিত আপনার পিরিয়ডের তারিখ ও তথ্যের ফোনটি সাথে রাখুন।`,
    citations: [
      'ACOG Committee Opinion No. 557: Management of Acute Abnormal Uterine Bleeding',
      'ACEP Emergency Care Guidelines for Acute Gynecologic Emergencies'
    ]
  },
  {
    keywords: ['irregular', 'late', 'delay', 'অনিয়মিত', 'দেরিতে', 'দেরি'],
    responseEn: `A menstrual cycle is generally counted from Day 1 of bleeding to Day 1 of the next period. Normal cycle variation ranges from 21 to 35 days.

**Common reasons for menstrual irregularity include:**
1. **Stress & Cortisol**: High mental or physical stress can delay ovulation by suppressing GnRH hormones from the hypothalamus.
2. **Polycystic Ovary Syndrome (PCOS)**: Elevated androgens and insulin resistance can prevent predictable follicle maturation and ovulation.
3. **Weight Fluctuations**: Rapid weight loss, strict calorie restriction, or intense athletic exertion.
4. **Thyroid Imbalance**: Both hypothyroidism and hyperthyroidism significantly affect menstrual rhythms.

💡 *Helpful Tip:* Log your daily symptoms in CycleSense AI for 2–3 consecutive cycles. If your cycle is consistently >35 days or varies by more than 9 days, show these logs to your gynecologist for a targeted hormone panel (TSH, Prolactin, Free Testosterone).`,
    responseBn: `একটি স্বাভাবিক পিরিয়ড সাইকেল ২১ থেকে ৩৫ দিনের মধ্যে যেকোনো সময়ে হতে পারে। কয়েক দিনের তারতম্য হওয়া খুবই সাধারণ বিষয়।

**পিরিয়ড অনিয়মিত হওয়ার প্রধান কারণসমূহ:**
১. **মানসিক বা শারীরিক চাপ**: অতিরিক্ত মানসিক চাপ মস্তিষ্কের হরমোন সংকেতে ব্যাঘাত ঘটিয়ে ওভিউলেশন পিছিয়ে দিতে পারে।
২. **পিসিওএস (PCOS)**: হরমোনের ভারসাম্যহীনতা ও ইনসুলিন সমস্যার কারণে ডিম্বাণু নিয়মিত ফুটতে পারে না।
৩. **ওজনের দ্রুত পরিবর্তন**: হঠাৎ অতিরিক্ত ওজন কমে যাওয়া বা বেড়ে যাওয়া।
৪. **থাইরয়েডের সমস্যা**: হাইপোথাইরয়েডিজম মাসিকের স্বাভাবিক নিয়মে ব্যাপক প্রভাব ফেলে।

💡 *পরামর্শ:* সাইকেলসেন্স ডায়েরিতে নিয়মিত লক্ষণ লিখে রাখুন। যদি একটানা ৩৫ দিনের বেশি পিরিয়ড না হয় বা ঘন ঘন বিলম্ব হয়, তবে ডাক্তারের পরামর্শ নিয়ে একটি আল্ট্রাসনোগ্রাম ও হরমোন টেস্ট করিয়ে নেওয়া ভালো।`,
    citations: [
      'FIGO Menstrual Disorders Committee Classification System',
      'Endocrine Society Clinical Practice Guidelines on Amenorrhea'
    ]
  },
  {
    keywords: ['pcos', 'polycystic', 'হিরসুটিজম', 'পিসিওএস', 'ডিম্বাশয়'],
    responseEn: `**Polycystic Ovary Syndrome (PCOS)** is an endocrine and metabolic condition affecting approximately 1 in 10 women of reproductive age worldwide.

**Core Diagnostic Criteria (Rotterdam Consensus requires 2 of 3):**
1. **Irregular or absent ovulation**: Manifesting as irregular, infrequent, or missing periods.
2. **Elevated androgens**: Either clinical signs (adult acne, excess chin/facial hair, scalp hair loss) or elevated levels on blood tests.
3. **Polycystic appearance of ovaries**: Multiple small, immature follicles visible on pelvic ultrasound.

**Evidence-Based Management Approaches:**
- **Insulin & Nutrition**: Eating meals rich in fiber, lean proteins, and complex carbohydrates stabilizes insulin levels.
- **Physical Activity**: Consistent strength training and brisk walking enhance metabolic sensitivity.
- **Medical Consultation**: A doctor may prescribe cycle-regulating therapy, metformin for insulin sensitivity, or targeted anti-androgens depending on your personal health goals.`,
    responseBn: `**পলিসিস্টিক ওভারি সিন্ড্রোম (PCOS)** নারীদের হরমোন ও মেটাবলিজমজনিত একটি অতি সাধারণ অবস্থা। বিশ্বব্যাপী প্রতি ১০ জন নারীর মধ্যে অন্তত ১ জন এতে আক্রান্ত হন।

**ডাক্তারি মূল ৩টি লক্ষণের মধ্যে অন্তত ২টি থাকলে পিসিওএস বিবেচনা করা হয়:**
১. **অনিয়মিত বা দেরিতে পিরিয়ড**: ডিম্বাণু সময়মতো না ফোটার কারণে।
২. **অতিরিক্ত পুরুষ হরমোনের (Androgen) প্রভাব**: মুখে বা শরীরে অনাকাঙ্ক্ষিত লোম, ব্রণ, অথবা চুল পড়া।
৩. **আল্ট্রাসনোগ্রামে ডিম্বাশয়ে একাধিক ছোট ছোট ফলিকল বা সিস্ট দেখা যাওয়া।**

**নিয়ন্ত্রণের বৈজ্ঞানিক উপায়:**
- **খাদ্যাভ্যাস**: অতিরিক্ত মিষ্টি, চিনি ও ময়দা জাতীয় খাবার কমিয়ে শাকসবজি, ডাল ও প্রোটিন বেশি খাওয়া।
- **ব্যায়াম**: প্রতিদিন ২৫-৩০ মিনিট হাঁটা বা হালকা শরীরচর্চা।
- **চিকিৎসকের পরামর্শ**: বিশেষজ্ঞ ডাক্তারের নির্দেশনা অনুযায়ী চিকিৎসা নিলে পিসিওএস সম্পূর্ণ নিয়ন্ত্রণে রাখা সম্ভব।`,
    citations: [
      'International Evidence-based Guideline for the Assessment and Management of PCOS (2023 Update)',
      'WHO Fact Sheets: Polycystic Ovary Syndrome'
    ]
  },
  {
    keywords: ['pain', 'cramp', 'cramps', 'dysmenorrhea', 'ব্যথা', 'তলপেট ব্যথা', 'ক্র্যাম্প'],
    responseEn: `Menstrual cramping (dysmenorrhea) is triggered by hormone-like chemicals called **prostaglandins**, which stimulate uterine muscle contractions to shed the lining.

**Safe, Evidence-Based Ways to Track and Manage Pain:**
1. **0–10 Numeric Rating Scale**: Use CycleSense's daily slider to log your pain level every cycle day.
   - *0:* None
   - *1–3:* Mild (doesn't interfere with work/study)
   - *4–6:* Moderate (noticeable ache, responds to warmth)
   - *7–10:* Severe (restricts daily tasks, needs medical evaluation)
2. **Heat Therapy**: A heating pad or hot water bottle at 40°C on the lower abdomen is clinically shown to be as effective as standard ibuprofen.
3. **Hydration & Magnesium**: Staying hydrated and consuming magnesium-rich foods (almonds, spinach, bananas) helps relax smooth muscle fibers.

⚠️ *When to see a doctor:* If pain begins days before bleeding, radiates severely to the legs, doesn't respond to NSAIDs, or occurs during intimacy, consult a doctor to evaluate for conditions like endometriosis or adenomyosis.`,
    responseBn: `পিরিয়ডের সময় তলপেটে ব্যথা হওয়ার প্রধান কারণ হলো **প্রোস্টাগ্ল্যান্ডিন** হরমোন। এটি জরায়ুর পেশিকে সংকুচিত করে জমে থাকা রক্ত বের করে দিতে সাহায্য করে।

**ব্যথা পর্যবেক্ষণ ও ঘরোয়া উপশমের সহজ উপায়:**
১. **ব্যথার স্কেল ব্যবহার করুন**: সাইকেলসেন্স অ্যাপে ০ থেকে ১০ স্কেলে আপনার ব্যথার তীব্রতা লিখে রাখুন।
   - *১-৩:* মৃদু অস্বস্তি
   - *৪-৬:* মাঝারি ব্যথা (গরম সেঁকে উপশম হয়)
   - *৭-১০:* তীব্র অসহ্য ব্যথা (অবশ্যই ডাক্তারের পরামর্শ প্রয়োজন)
২. **গরম পানির সেঁক**: তলপেটে হট ওয়াটার ব্যাগ বা গরম তোয়ালে চেপে ধরলে পেশির টান কমে ও রক্ত সঞ্চালন বাড়ে।
৩. **পর্যাপ্ত তরল ও খাবার**: কুসুম গরম পানি, আদা চা এবং ম্যাগনেসিয়ামযুক্ত খাবার (যেমন কলা, বাদাম, সবুজ শাক) গ্রহণ করুন।

⚠️ *কখন ডাক্তার দেখাবেন:* যদি তীব্র ব্যথার কারণে বিছানা ছেড়ে উঠতেই না পারেন, ব্যথানাশক ওষুধেও কোনো কাজ না হয়, তবে এন্ডোমেট্রিওসিস বা অন্যান্য কারণ নির্ণয়ে অভিজ্ঞ ডাক্তারের পরামর্শ নিন।`,
    citations: [
      'ACOG Practice Bulletin No. 208: Dysmenorrhea and Pelvic Pain',
      'Cochrane Systematic Review: Transcutaneous electrical nerve stimulation and acupuncture for dysmenorrhea'
    ]
  },
  {
    keywords: ['doctor', 'when', 'consult', 'ডাক্তার', 'কখন ডাক্তার'],
    responseEn: `You should consult a qualified gynecologist or healthcare professional whenever you experience changes that deviate significantly from your baseline.

**Specific Clinical Benchmarks for Scheduling an Appointment:**
- **Persistent Amenorrhea**: No period for 90 days (and you are not pregnant).
- **Abnormal Cycle Length**: Consistently fewer than 21 days or more than 35 days apart.
- **Bleeding Duration**: Flow that continues for longer than 7 full days.
- **Severe Heavy Flow**: Needing to change pads every hour for 2+ consecutive hours or passing large blood clots.
- **Debilitating Pain**: Cramps that do not improve with warmth or over-the-counter pain medications and disrupt work or school.
- **Intermenstrual Bleeding**: Spotting or bleeding between cycles or after sexual intercourse.

💡 *Pro Tip:* Export your **CycleSense Summary Report** from the Health Reports tab before your visit—doctors greatly appreciate organized, chronological patient data!`,
    responseBn: `আপনার পিরিয়ডে যদি স্বাভাবিক নিয়মের বড় ধরনের ব্যতিক্রম দেখা দেয়, তবে অভিজ্ঞ গাইনি চিকিৎসকের সাথে পরামর্শ করা জরুরি।

**কখন চিকিৎসকের অ্যাপয়েন্টমেন্ট নেবেন:**
- **টানা ৩ মাস পিরিয়ড না হওয়া**: যদি গর্ভবতী না হওয়া সত্ত্বেও ৩ মাস পিরিয়ড বন্ধ থাকে।
- **সাইকেলের অনিয়ম**: পিরিয়ড ২১ দিনের কম বা ৩৫ দিনের বেশি পর পর হওয়া।
- **দীর্ঘস্থায়ী রক্তপাত**: রক্তপাত একটানা ৭ দিনের বেশি সময় ধরে চলা।
- **অতিরিক্ত রক্তপাত**: প্রতি ১-২ ঘণ্টায় ভারী প্যাড সম্পূর্ণ ভিজে যাওয়া বা বড় বড় রক্তের চাকা যাওয়া।
- **অসহনীয় ব্যথা**: ব্যথার ওষুধ খাওয়ার পরও কাজ না হওয়া এবং বিছানা থেকে উঠতে না পারা।
- **মাঝামাঝি সময়ে রক্তপাত**: পিরিয়ড শেষ হওয়ার পর আবার হঠাৎ রক্ত বা দাগ দেখা দেওয়া।

💡 *টিপ:* ডাক্তারের কাছে যাওয়ার আগে সাইকেলসেন্স অ্যাপের **Health Reports** অপশন থেকে আপনার রিপোর্টটি প্রিন্ট বা সংরক্ষণ করে নিয়ে যান।`,
    citations: [
      'American College of Obstetricians and Gynecologists: Your First Gynecologic Visit',
      'NHS UK: Menstrual Problems and When to Seek Help'
    ]
  },
  {
    keywords: ['history', 'bangla', 'summary', 'ইতিহাস', 'বাংলায়', 'আমার হিস্ট্রি'],
    responseEn: `Here is a clear summary of your recorded menstrual history in CycleSense AI:

- **Total Logged Cycles:** 5 complete cycles analyzed.
- **Average Cycle Length:** 28.6 days (consistent and healthy normal range of 21–35 days).
- **Average Bleeding Duration:** 5.2 days.
- **Cycle Variation:** ±0.5 days (exceptionally regular pattern).
- **Current Status:** Day 19 of current cycle (estimated Luteal Phase).
- **Next Predicted Period Window:** Approx. October 29 – November 2, 2026 (±2 days confidence window).

You can explore full interactive charts in the **Cycle Insights** page or generate a printable clinical export in **Health Reports**!`,
    responseBn: `সাইকেলসেন্স এআই-এ আপনার সংরক্ষিত তথ্যের বাংলা সারসংক্ষেপ নিচে দেওয়া হলো:

- **মোট সংরক্ষিত সাইকেল:** ৫টি সাইকেল সফলভাবে বিশ্লেষিত।
- **গড় সাইকেল দৈর্ঘ্য:** ২৮.৬ দিন (২১ থেকে ৩৫ দিনের স্বাভাবিক সীমার মধ্যে রয়েছে)।
- **গড় পিরিয়ডের স্থায়িত্ব:** ৫.২ দিন।
- **সাইকেলের তারতম্য:** মাত্র ±০.৫ দিন (আপনার পিরিয়ড অত্যন্ত নিয়মিত ও ধারাবাহিক)।
- **বর্তমান অবস্থা:** বর্তমান সাইকেলের ১৯তম দিন (আনুমানিক লুটিয়াল বা ওভিউলেশন-পরবর্তী পর্যায়)।
- **পরবর্তী সম্ভাব্য পিরিয়ড:** আনুমানিক ২৯ অক্টোবর থেকে ২ নভেম্বর, ২০২৬ (±২ দিন তারতম্য হতে পারে)।

বিস্তারিত গ্রাফ ও বিশ্লেষণ দেখতে **সাইকেল অ্যানালিটিক্স** পেজে যান অথবা ডাক্তারের জন্য প্রিন্ট করতে **হেলথ রিপোর্ট** অপশনে যান।`,
    citations: [
      'CycleSense AI Local Statistical Analyzer (Based on 5 Recorded Cycles)'
    ]
  }
];

export const defaultAssistantFallbackEn = `Thank you for your question. As your CycleSense health educator, I aim to provide evidence-backed information on menstrual wellness, hormonal phases, and cycle tracking.

Could you please clarify your question? For instance, you can ask about:
- Understanding menstrual phases (Follicular, Ovulation, Luteal)
- Managing cramps and bloating with lifestyle tips
- PCOS symptoms and hormone testing
- When heavy bleeding warrants medical evaluation

*Reminder: CycleSense AI provides educational guidance, not a medical diagnosis.*`;

export const defaultAssistantFallbackBn = `আপনার প্রশ্নের জন্য ধন্যবাদ। আপনার সাইকেলসেন্স স্বাস্থ্য শিক্ষিকা হিসেবে পিরিয়ড, হরমোন ও প্রজনন স্বাস্থ্য নিয়ে বৈজ্ঞানিক তথ্য দেওয়াই আমার লক্ষ্য।

আপনি যেকোনো বিষয়ে বিস্তারিত জানতে প্রশ্ন করতে পারেন, যেমন:
- সাইকেলের বিভিন্ন পর্যায় (ফলিকুলার, ওভিউলেশন, লুটিয়াল)
- পিরিয়ডের ব্যথা ও পেটের গ্যাস উপশমে করণীয়
- পিসিওএস (PCOS) এর লক্ষণ ও খাদ্যাভ্যাস
- অতিরিক্ত রক্তপাত হলে কখন ডাক্তারের কাছে যাওয়া প্রয়োজন

*মনে রাখবেন: সাইকেলসেন্স এআই শিক্ষামূলক তথ্য দেয়, এটি চিকিৎসকের প্রেসক্রিপশন বা রোগ নির্ণয় নয়।*`;
