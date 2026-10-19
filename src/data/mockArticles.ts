import { HealthArticle } from '../types';

export const mockArticles: HealthArticle[] = [
  {
    id: 'pcos-guide',
    category: 'pcos',
    isPcosFeatured: true,
    titleEn: 'Understanding PCOS: Symptoms, Hormones, and Lifestyle Support',
    titleBn: 'পিসিওএস (PCOS) কী? লক্ষণ, হরমোনের প্রভাব ও জীবনযাত্রার যত্ন',
    summaryEn: 'A clear, compassionate guide to Polycystic Ovary Syndrome, metabolic factors, and evidence-based management.',
    summaryBn: 'পলিসিস্টিক ওভারি সিন্ড্রোম (PCOS) সম্পর্কে সহজ ভাষায় ধারণা, এর সাধারণ লক্ষণ ও জীবনযাত্রার ইতিবাচক পরিবর্তন।',
    readTime: '6 min',
    tags: ['PCOS', 'Hormones', 'Insulin', 'Irregular Periods'],
    reviewedDate: 'October 2026',
    reviewedBy: 'Curated from WHO & ACOG Guidelines (Reviewed by Dr. S. Rahman, Obs & Gynae)',
    contentEn: {
      introduction: 'Polycystic Ovary Syndrome (PCOS) is a common endocrine and metabolic condition affecting approximately 8–13% of reproductive-aged women globally. It is characterized by hormonal imbalances—particularly elevated androgens (male-type hormones)—and insulin resistance.',
      commonSymptoms: [
        'Irregular, infrequent, or absent menstrual periods (oligomenorrhea/amenorrhea)',
        'Excess facial or body hair growth (hirsutism)',
        'Persistent adult acne or oily skin, particularly along the jawline',
        'Thinning scalp hair (androgenic alopecia)',
        'Difficulty managing body weight despite balanced nutrition',
        'Darkened patches of velvety skin (acanthosis nigricans), often on neck folds'
      ],
      possibleCauses: [
        'Insulin resistance: The body produces higher insulin levels, stimulating ovaries to produce excess androgens.',
        'Low-grade chronic inflammation: Associated with cellular stress and metabolic strain.',
        'Genetic predisposition: Having a biological mother or sister with PCOS increases probability.',
        'Hormonal feedback disruption between the pituitary gland and ovaries.'
      ],
      whenToSeeDoctor: [
        'If your period is consistently delayed by more than 35 days, or you have fewer than 8 periods a year.',
        'If you experience sudden, rapid hair growth on chin, chest, or abdomen.',
        'If you have been trying to conceive for 12 months (or 6 months if over 35) without success.',
        'If you experience sudden pelvic pain or extreme mood changes.'
      ],
      selfCareAndManagement: [
        'Prioritize low-glycemic, fiber-rich meals with lean protein to stabilize blood glucose.',
        'Incorporate regular moderate resistance training and brisk walking to improve insulin sensitivity.',
        'Support consistent circadian rhythm with 7–9 hours of restful sleep.',
        'Track cycle regularity and symptoms to provide your gynecologist with accurate personal trends.'
      ],
      reliableSources: [
        {
          name: 'Polycystic Ovary Syndrome Fact Sheet',
          organization: 'World Health Organization (WHO)',
          url: 'https://www.who.int/news-room/fact-sheets/detail/polycystic-ovary-syndrome'
        },
        {
          name: 'ACOG Practice Bulletin #218: Polycystic Ovary Syndrome',
          organization: 'American College of Obstetricians and Gynecologists',
          url: 'https://www.acog.org'
        }
      ]
    },
    contentBn: {
      introduction: 'পলিসিস্টিক ওভারি সিন্ড্রোম (PCOS) নারীদের অন্যতম সাধারণ একটি হরমোনজনিত অবস্থা। বিশ্বব্যাপী প্রায় ৮-১৩% প্রজননক্ষম নারী এই অভিজ্ঞতার মধ্য দিয়ে যান। এতে শরীরে অ্যান্ড্রোজেন বা পুরুষ হরমোন কিছুটা বেড়ে যায় এবং ইনসুলিন রেজিস্ট্যান্সের কারণে ডিম্বাশয় থেকে ডিম্বাণু নিয়মিত মুক্ত হতে পারে না।',
      commonSymptoms: [
        'অনিয়মিত বা দেরিতে মাসিক হওয়া (৩৫ দিনের বেশি পর পর বা বছরে ৮ বারের কম)',
        'চিবুক, পেট বা বুকে অনাকাঙ্ক্ষিত অতিরিক্ত লোম গজানো (হিরসুটিজম)',
        'ত্বকে অতিরিক্ত তেল ও নাছোড়বান্দা ব্রণ (বিশেষ করে চোয়ালের অংশে)',
        'মাথার চুল পাতলা হয়ে যাওয়া বা চুল পড়া বৃদ্ধি',
        'ওজন দ্রুত বেড়ে যাওয়া বা কমানোতে অতিরিক্ত কষ্ট হওয়া',
        'ঘাড় বা বগলের ভাঁজে ত্বকের রঙ কালচে হয়ে যাওয়া'
      ],
      possibleCauses: [
        'ইনসুলিন রেজিস্ট্যান্স: শরীর যখন ইনসুলিনের প্রতি কম সাড়া দেয়, তখন ডিম্বাশয় অতিরিক্ত অ্যান্ড্রোজেন হরমোন তৈরি করে।',
        'বংশগত প্রভাব: পরিবারে মা বা বোনের পিসিওএস থাকলে সম্ভাবনা বাড়ে।',
        'শারীরিক প্রদাহ (Chronic inflammation): যা হরমোনের স্বাভাবিক ভারসাম্যে ব্যাঘাত ঘটায়।'
      ],
      whenToSeeDoctor: [
        'যদি আপনার মাসিক একটানা ২-৩ মাস বন্ধ থাকে বা বছরে ৮ বারের কম হয়।',
        'যদি হঠাৎ করে মুখে বা শরীরে অতিরিক্ত লোম বৃদ্ধি পায়।',
        'যদি দীর্ঘ সময় গর্ভধারণের চেষ্টা করেও সমস্যা হয়।',
        'যেকোনো অতিরিক্ত তলপেটের ব্যথায় কালক্ষেপণ না করে ডাক্তারের পরামর্শ নিন।'
      ],
      selfCareAndManagement: [
        'অতিরিক্ত চিনি, মিষ্টি ও প্রক্রিয়াজাত খাবার কমিয়ে শাকসবজি ও প্রোটিনযুক্ত সুষম খাবার খান।',
        'প্রতিদিন অন্তত ২৫-৩০ মিনিট হাঁটা বা হালকা ব্যায়াম শরীরকে ইনসুলিন ব্যবহারে সাহায্য করে।',
        'মানসিক চাপ কমানো এবং রাতে ৭-৮ ঘণ্টা গভীর ঘুম নিশ্চিত করুন।',
        'নিয়মিত লক্ষণ ও পিরিয়ডের তারিখ ডায়েরিতে লিখে রাখুন।'
      ],
      reliableSources: [
        {
          name: 'পিসিওএস সম্পর্কিত বিশ্ব স্বাস্থ্য সংস্থার তথ্য',
          organization: 'World Health Organization (WHO)',
          url: 'https://www.who.int/news-room/fact-sheets/detail/polycystic-ovary-syndrome'
        }
      ]
    }
  },
  {
    id: 'irregular-periods',
    category: 'irregular_periods',
    titleEn: 'Why Is My Period Late or Irregular? Common Explanations',
    titleBn: 'পিরিয়ড দেরিতে বা অনিয়মিত হওয়ার সাধারণ কারণগুলো কী?',
    summaryEn: 'Explore natural variations, stress impacts, metabolic shifts, and when an irregular cycle needs attention.',
    summaryBn: 'মানসিক চাপ, খাদ্যাভ্যাস, ওজন পরিবর্তন ও হরমোনের তারতম্যের কারণে পিরিয়ড কেন অনিয়মিত হতে পারে তার বিশদ।',
    readTime: '5 min',
    tags: ['Irregular Cycles', 'Stress', 'Hormones', 'Ovulation'],
    reviewedDate: 'September 2026',
    reviewedBy: 'Curated from NHS & ACOG Clinical Guidance',
    contentEn: {
      introduction: 'A menstrual cycle is generally counted from the first day of one period to the first day of the next. While textbooks quote 28 days, a normal adult cycle ranges from 21 to 35 days, with 2 to 7 days of bleeding.',
      commonSymptoms: [
        'Cycles shorter than 21 days or longer than 35 days',
        'Cycle length varying by more than 7–9 days from month to month',
        'Missing three or more consecutive cycles (amenorrhea)',
        'Unpredictable spotting between regular cycles'
      ],
      possibleCauses: [
        'Acute or chronic psychological stress elevating cortisol, which temporarily suppresses GnRH.',
        'Significant rapid weight changes, strict calorie deprivation, or intense athletic overtraining.',
        'Polycystic Ovary Syndrome (PCOS) or thyroid imbalances.',
        'Perimenopause transition in women in their 40s.',
        'Recent discontinuation or initiation of hormonal contraceptives.'
      ],
      whenToSeeDoctor: [
        'If your periods were previously regular and suddenly become completely unpredictable for 3+ months.',
        'If your bleeding lasts longer than 7 full days continuously.',
        'If you experience bleeding after sexual intercourse or between periods.',
        'If you suspect possible pregnancy.'
      ],
      selfCareAndManagement: [
        'Maintain a consistent eating schedule with adequate complex carbohydrates and fats.',
        'Incorporate mindfulness, gentle walks, and stress decompression techniques.',
        'Keep an accurate cycle diary for 3 consecutive months to present to your clinician.'
      ],
      reliableSources: [
        {
          name: 'Irregular Periods Clinical Overview',
          organization: 'NHS UK Health Guidance',
          url: 'https://www.nhs.uk/conditions/irregular-periods/'
        }
      ]
    },
    contentBn: {
      introduction: 'সাধারণত একটি পিরিয়ডের প্রথম দিন থেকে পরবর্তী পিরিয়ডের প্রথম দিন পর্যন্ত সময়কে সাইকেল বলা হয়। সবার ক্ষেত্রে এটি ঠিক ২৮ দিন হয় না; ২১ থেকে ৩৫ দিনের মধ্যে যেকোনো সময়কাল স্বাভাবিক বলে গণ্য হয়।',
      commonSymptoms: [
        'সাইকেল ২১ দিনের কম বা ৩৫ দিনের বেশি হওয়া',
        'এক মাস থেকে অন্য মাসের ব্যবধানে ৭-৯ দিনের বেশি তারতম্য ঘটা',
        'টানা তিন মাস বা তার বেশি সময় পিরিয়ড সম্পূর্ণ বন্ধ থাকা',
        'মাঝেমধ্যে অনাকাঙ্ক্ষিত রক্ত বা স্পটিং দেখা দেওয়া'
      ],
      possibleCauses: [
        'তীব্র মানসিক চাপ ও অতিরিক্ত দুশ্চিন্তা যা মস্তিষ্কের হরমোন সংকেত বাধাগ্রস্ত করে।',
        'হঠাৎ দ্রুত ওজন হ্রাস বা অতিরিক্ত ওজন বৃদ্ধি পাওয়া।',
        'থাইরয়েডের সমস্যা বা পিসিওএস হরমোনজনিত ভারসাম্যহীনতা।',
        'অতিরিক্ত পুষ্টিহীনতা বা খুব ভারী ব্যায়াম করা।'
      ],
      whenToSeeDoctor: [
        'যদি আগে নিয়মিত পিরিয়ড থাকা সত্ত্বেও হঠাৎ টানা ৩ মাস অনিয়মিত হতে থাকে।',
        'টানা ৭ দিনের বেশি একটানা রক্তপাত হতে থাকলে।',
        'পিরিয়ডের মধ্যবর্তী সময়ে রক্তপাত হলে অবিলম্বে চিকিৎসকের কাছে যান।'
      ],
      selfCareAndManagement: [
        'নিয়মিত পুষ্টিকর খাবার গ্রহণ এবং পর্যাপ্ত বিশ্রাম নিশ্চিত করুন।',
        'মানসিক চাপ কমানোর জন্য মেডিটেশন বা পছন্দের কাজের অভ্যাস করুন।',
        'সাইকেলসেন্স অ্যাপে প্রতি মাসের শুরুর তারিখ লিখে রাখুন যাতে ডাক্তারের কাছে সঠিক তথ্য দিতে পারেন।'
      ],
      reliableSources: [
        {
          name: 'অনিয়মিত পিরিয়ড তথ্য নির্দেশিকা',
          organization: 'NHS UK',
          url: 'https://www.nhs.uk/conditions/irregular-periods/'
        }
      ]
    }
  },
  {
    id: 'painful-periods-dysmenorrhea',
    category: 'painful_periods',
    titleEn: 'Painful Periods (Dysmenorrhea): Primary Cramps vs Secondary Causes',
    titleBn: 'পিরিয়ডে অসহ্য তলপেট ব্যথা (Dysmenorrhea): কারণ ও ঘরোয়া উপশম',
    summaryEn: 'Differentiating normal prostaglandin cramping from deeper concerns like endometriosis or fibroids.',
    summaryBn: 'স্বাভাবিক পিরিয়ড ক্র্যাম্প এবং অতিরিক্ত তীব্র ব্যথার পার্থক্য জানুন এবং ব্যথানাশক নিরাপদ পদ্ধতি শিখুন।',
    readTime: '5 min',
    tags: ['Dysmenorrhea', 'Pelvic Pain', 'Cramps', 'Pain Relief'],
    reviewedDate: 'October 2026',
    reviewedBy: 'Curated from ACOG Guidelines on Dysmenorrhea',
    contentEn: {
      introduction: 'Dysmenorrhea is the medical term for menstrual cramps. Primary dysmenorrhea refers to recurrent cramping caused by natural uterine prostaglandins, while secondary dysmenorrhea is caused by a reproductive disorder.',
      commonSymptoms: [
        'Cramping or throbbing pain in the lower abdomen 1–2 days before or on day 1 of bleeding',
        'Radiation of ache to lower back and upper thighs',
        'Accompanying loose stools, nausea, or lightheadedness on peak flow days',
        'Relief after 48 to 72 hours of flow initiation'
      ],
      possibleCauses: [
        'Prostaglandins: Hormone-like lipids that make the uterine muscles contract to shed the lining.',
        'Secondary causes: Endometriosis, adenomyosis, uterine fibroids, or pelvic inflammatory disease (PID).'
      ],
      whenToSeeDoctor: [
        'If over-the-counter NSAIDs (like ibuprofen) provide zero relief.',
        'If pain prevents you from attending school, university, or work every month.',
        'If severe pelvic pain occurs outside of menstrual days or during intercourse.'
      ],
      selfCareAndManagement: [
        'Apply a warm heating pad (approx. 40°C) to the lower pelvis to improve local blood perfusion.',
        'Stay well hydrated and reduce high-sodium foods during the pre-menstrual week.',
        'Engage in gentle yoga stretches (child’s pose, cat-cow) to ease pelvic pelvic tension.'
      ],
      reliableSources: [
        {
          name: 'Dysmenorrhea: Painful Periods FAQ',
          organization: 'American College of Obstetricians and Gynecologists (ACOG)',
          url: 'https://www.acog.org/womens-health/faqs/dysmenorrhea-painful-periods'
        }
      ]
    },
    contentBn: {
      introduction: 'পিরিয়ডের সময় তলপেটে ব্যথা হওয়াকে ডাক্তারি ভাষায় ডিসমেনোরিয়া (Dysmenorrhea) বলে। সাধারণত জরায়ু সংকুচিত হয়ে রক্ত বের করার সময় প্রোস্টাগ্ল্যান্ডিন হরমোনের কারণে স্বাভাবিক ব্যথা অনুভূত হয়। তবে খুব তীব্র ব্যথা অন্য কোনো সমস্যার লক্ষণ হতে পারে।',
      commonSymptoms: [
        'পিরিয়ড শুরু হওয়ার ১-২ দিন আগে বা প্রথম দিনে তলপেটে টানটান বা কামড়ানো ব্যথা',
        'ব্যথা কোমর ও ঊরুর পেছনের দিকে ছড়িয়ে পড়া',
        'ব্যথার সাথে হালকা বমি বমি ভাব বা পাতলা পায়খানা হওয়া',
        'সাধারণত ২-৩ দিন পর রক্তপাত কমে এলে ব্যথা ধীরে ধীরে কমে যাওয়া'
      ],
      possibleCauses: [
        'স্বাভাবিক কারণ: জরায়ুর পেশির সংকোচন ও প্রোস্টাগ্ল্যান্ডিন ক্ষরণ।',
        'অন্যান্য কারণ: এন্ডোমেট্রিওসিস, জরায়ুর টিউমার বা ফাইব্রয়েড, পেলভিক ইনফেকশন।'
      ],
      whenToSeeDoctor: [
        'যদি ব্যথার কারণে প্রতি মাসে বিছানা ছেড়ে ওঠা বা স্বাভাবিক কাজ করা অসম্ভব হয়ে পড়ে।',
        'যদি সাধারণ গরম সেঁক বা ব্যথানাশকে কোনো উন্নতি না হয়।',
        'মাসিক শেষ হওয়ার পরও যদি তলপেটে স্থায়ী ব্যথা থাকে।'
      ],
      selfCareAndManagement: [
        'তলপেটে হট ওয়াটার ব্যাগ বা গরম কাপড়ের সেঁক দিন; এটি পেশির রক্ত চলাচল বাড়ায়।',
        'পিরিয়ডের সময় পর্যাপ্ত কুসুম গরম পানি ও আদা চা পান করুন।',
        'হালকা স্ট্রেচিং বা যোগব্যায়াম তলপেটের টান কমাতে দারুণ কার্যকর।'
      ],
      reliableSources: [
        {
          name: 'মাসিকের ব্যথা বিষয়ক দিকনির্দেশনা',
          organization: 'ACOG',
          url: 'https://www.acog.org'
        }
      ]
    }
  },
  {
    id: 'heavy-menstrual-bleeding',
    category: 'heavy_bleeding',
    titleEn: 'Heavy Menstrual Bleeding (Menorrhagia): Signs and Anemia Prevention',
    titleBn: 'অতিরিক্ত রক্তক্ষরণ (Menorrhagia): লক্ষণ ও রক্তস্বল্পতা প্রতিরোধ',
    summaryEn: 'Learn how to quantify bleeding flow, identify red flags, and protect iron levels.',
    summaryBn: 'পিরিয়ডে অতিরিক্ত রক্তক্ষরণ হচ্ছে কিনা তা বোঝার উপায় ও আয়রনের ঘাটতি পূরণের উপায়।',
    readTime: '4 min',
    tags: ['Heavy Flow', 'Menorrhagia', 'Iron Deficiency', 'Anemia'],
    reviewedDate: 'September 2026',
    reviewedBy: 'Curated from CDC & FIGO Menstrual Guidelines',
    contentEn: {
      introduction: 'Menorrhagia refers to abnormally heavy or prolonged menstrual bleeding. Losing more than 80 mL of blood per cycle or bleeding for longer than 7 days can lead to iron deficiency anemia.',
      commonSymptoms: [
        'Soaking through one or more sanitary pads or tampons every hour for consecutive hours',
        'Needing to wake up during the night to change menstrual protection',
        'Passing blood clots larger than a quarter (approx. 2.5 cm across)',
        'Feeling breathless, unusually pale, or chronically fatigued.'
      ],
      possibleCauses: [
        'Hormonal imbalances (anovulation, perimenopause, thyroid disorders)',
        'Uterine polyps or leiomyomas (fibroids)',
        'Intrauterine contraceptive devices (copper IUDs in initial months)',
        'Underlying bleeding disorders such as von Willebrand disease.'
      ],
      whenToSeeDoctor: [
        'Soaking through 2+ heavy-absorbency pads in an hour for 2 or more hours in a row.',
        'Experiencing dizziness, lightheadedness, or feeling faint when standing up.',
        'Continuous bleeding lasting beyond 8 days.'
      ],
      selfCareAndManagement: [
        'Include iron-rich foods in diet (spinach, lentils, dark leafy greens, poultry) alongside Vitamin C to maximize absorption.',
        'Log number of pad/tampon changes per day in your CycleSense tracker.',
        'Request a simple complete blood count (CBC) and serum ferritin test from your doctor.'
      ],
      reliableSources: [
        {
          name: 'Heavy Menstrual Bleeding Assessment',
          organization: 'Centers for Disease Control and Prevention (CDC)',
          url: 'https://www.cdc.gov/ncbddd/blooddisorders/women/menorrhagia.html'
        }
      ]
    },
    contentBn: {
      introduction: 'যদি পিরিয়ডে রক্তপাতের পরিমাণ বা স্থায়িত্ব স্বাভাবিকের চেয়ে অনেক বেশি হয়, তবে তাকে ডাক্তারি ভাষায় মেনোরেজিয়া বলা হয়। দীর্ঘদিন অতিরিক্ত রক্তক্ষরণ হলে রক্তস্বল্পতা বা অ্যানিমিয়া হতে পারে।',
      commonSymptoms: [
        'প্রতি ১-২ ঘণ্টায় ভারী প্যাড সম্পূর্ণ ভিজে যাওয়া',
        'রাতে ঘুম থেকে উঠে একাধিকবার প্যাড পরিবর্তন করতে বাধ্য হওয়া',
        'বড় সাইজের জমাট বাঁধা রক্তের চাকা (Clots) নির্গত হওয়া',
        'শারীরিক দুর্বলতা, মাথা ঘোরা ও চেহারা ফ্যাকাশে হয়ে যাওয়া'
      ],
      possibleCauses: [
        'হরমোনের ভারসাম্যহীনতা বা ডিম্বস্ফোটন না হওয়া।',
        'জরায়ুতে পলিপ বা ফাইব্রয়েডের (টিউমার) উপস্থিতি।',
        'থাইরয়েডের সমস্যা বা রক্ত জমাট বাঁধার কোনো সমস্যা।'
      ],
      whenToSeeDoctor: [
        'যদি একাধারে ২ ঘণ্টার বেশি প্রতি ঘণ্টায় প্যাড পরিবর্তন করতে হয়।',
        'যদি মাথা ঘোরে বা রক্তক্ষরণের কারণে অজ্ঞান হওয়ার মতো অবস্থা হয়।',
        'একটানা ৮ দিনের বেশি রক্তপাত হতে থাকলে দ্রুত ডাক্তারের কাছে যান।'
      ],
      selfCareAndManagement: [
        'আয়রনযুক্ত খাবার যেমন ডাল, কচুশাক, কলিজা, বেদানা খান এবং সাথে লেবুর রস খান (ভিটামিন সি আয়রন শোষণে সাহায্য করে)।',
        'দিনে কয়টি প্যাড লাগছে তা সাইকেলসেন্স ডায়েরিতে নোট রাখুন।'
      ],
      reliableSources: [
        {
          name: 'হেভি পিরিয়ড সংক্রান্ত তথ্য',
          organization: 'CDC USA',
          url: 'https://www.cdc.gov'
        }
      ]
    }
  },
  {
    id: 'pms-and-pmdd',
    category: 'pms_mood',
    titleEn: 'PMS vs PMDD: Managing Pre-Menstrual Mood Swings and Anxiety',
    titleBn: 'পিএমএস (PMS) ও মেজাজ পরিবর্তন: মানসিক অস্থিরতা সামলানোর উপায়',
    summaryEn: 'Understand the neurochemistry behind luteal phase mood shifts and effective coping strategies.',
    summaryBn: 'মাসিকের আগে খিটখিটে মেজাজ, বিষণ্ণতা বা কান্নার অনুভূতির বৈজ্ঞানিক কারণ ও যত্ন।',
    readTime: '5 min',
    tags: ['PMS', 'PMDD', 'Mental Health', 'Progesterone'],
    reviewedDate: 'August 2026',
    reviewedBy: 'Curated from International Association for Premenstrual Disorders (IAPMD)',
    contentEn: {
      introduction: 'Premenstrual Syndrome (PMS) affects up to 75% of menstruating individuals to some degree, characterized by emotional, physical, and behavioral shifts during the late luteal phase (the 7–10 days prior to menstruation). PMDD is a more severe, clinical manifestation.',
      commonSymptoms: [
        'Irritability, sudden sadness, or tearfulness without an obvious external trigger',
        'Heightened social anxiety or feeling overwhelmed by everyday demands',
        'Breast tenderness, water retention, and food cravings (often for carbohydrates)',
        'Insomnia or restless, broken sleep despite exhaustion'
      ],
      possibleCauses: [
        'Hypersensitivity of brain neurotransmitters (serotonin and GABA) to normal fluctuations in estrogen and allopregnanolone (progesterone metabolite).',
        'Stress amplifying biological reactivity during the luteal drop in estrogen.'
      ],
      whenToSeeDoctor: [
        'If premenstrual depressive feelings interfere with personal relationships, job, or education.',
        'If you experience thoughts of self-harm or profound hopelessness during the week before bleeding.',
        'If symptoms do not disappear within 2–3 days after your period starts.'
      ],
      selfCareAndManagement: [
        'Keep caffeine and alcohol low during the 7 days prior to menstruation.',
        'Include magnesium-rich foods (pumpkin seeds, almonds, dark chocolate) and complex carbohydrates.',
        'Schedule restorative breaks and communicate boundary needs with family or partners.'
      ],
      reliableSources: [
        {
          name: 'Premenstrual Dysphoric Disorder Resources',
          organization: 'IAPMD & Royal College of Obstetricians and Gynaecologists',
          url: 'https://iapmd.org'
        }
      ]
    },
    contentBn: {
      introduction: 'মাসিক শুরু হওয়ার কয়েক দিন আগে অনেকের মন খারাপ, খিটখিটে মেজাজ বা অতিরিক্ত ক্লান্তি লাগে। একে প্রি-মেনস্ট্রুয়াল সিন্ড্রোম (PMS) বলে। এটি কোনো মনের দুর্বলতা নয়, বরং হরমোন পরিবর্তনের স্বাভাবিক প্রতিক্রিয়া।',
      commonSymptoms: [
        'ছোটখাটো কারণে রাগ বা হঠাৎ মন খারাপ হয়ে কান্না আসা',
        'বুকে হালকা ব্যথা বা ফোলাভাব এবং পেটে গ্যাস ভাব',
        'মিষ্টি বা নোনতা খাবার খাওয়ার অতিরিক্ত ইচ্ছা',
        'ক্লান্তি সত্ত্বেও রাতে শান্তিমতো ঘুম না হওয়া'
      ],
      possibleCauses: [
        'ইস্ট্রোজেন ও প্রজেস্টেরন হরমোনের পরিবর্তনের কারণে মস্তিষ্কে সেরোটোনিন (সুখের অনুভূতি সৃষ্টিকারী হরমোন) কমে যাওয়া।',
        'মানসিক চাপ থাকলে এই লক্ষণগুলো আরও জোরালো হয়।'
      ],
      whenToSeeDoctor: [
        'যদি মন খারাপ এতটাই তীব্র হয় যে দৈনন্দিন কাজ বা সম্পর্কে মারাত্মক প্রভাব ফেলে।',
        'মাসিক শুরু হওয়ার পরও যদি এই বিষণ্ণতা কাটতে না চায়।'
      ],
      selfCareAndManagement: [
        'পিরিয়ডের আগের সপ্তাহে চা ও কফি কম পান করুন।',
        'বাদাম, কলা, সবুজ শাকসবজি এবং পুষ্টিকর খাবার বেশি খান।',
        'নিজের জন্য কিছুটা আলাদা সময় রাখুন এবং পর্যাপ্ত ঘুমান।'
      ],
      reliableSources: [
        {
          name: 'পিএমএস ও মানসিক স্বাস্থ্য গাইডলাইন',
          organization: 'IAPMD',
          url: 'https://iapmd.org'
        }
      ]
    }
  },
  {
    id: 'endometriosis-awareness',
    category: 'endometriosis',
    titleEn: 'Endometriosis Awareness: Recognizing Chronic Pelvic Pain Early',
    titleBn: 'এন্ডোমেট্রিওসিস (Endometriosis) সচেতনতা: দীর্ঘস্থায়ী তলপেট ব্যথা ও লক্ষণ',
    summaryEn: 'An empathetic overview of what endometriosis is, why diagnosis often takes time, and support pathways.',
    summaryBn: 'এন্ডোমেট্রিওসিস কী, কেন এটি সাধারণ মাসিকের ব্যথার চেয়ে আলাদা এবং কখন বিশেষজ্ঞ দেখানো জরুরি।',
    readTime: '6 min',
    tags: ['Endometriosis', 'Chronic Pain', 'Pelvic Health'],
    reviewedDate: 'October 2026',
    reviewedBy: 'Curated from World Endometriosis Society Guidelines',
    contentEn: {
      introduction: 'Endometriosis is a chronic inflammatory disorder where tissue resembling the lining of the uterus (endometrium) grows outside the uterine cavity—most commonly on ovaries, fallopian tubes, and pelvic peritoneum.',
      commonSymptoms: [
        'Severe, debilitating dysmenorrhea that worsens over months or years',
        'Deep pelvic pain during or following sexual intercourse (dyspareunia)',
        'Painful bowel movements or painful urination, especially during menstruation',
        'Chronic lower back pain independent of cycle day',
        'Subfertility or unexplained difficulty achieving pregnancy'
      ],
      possibleCauses: [
        'Retrograde menstruation: Menstrual debris flows back through fallopian tubes into pelvic cavity.',
        'Cellular metaplasia and stem cell differentiation.',
        'Altered immune response failing to clear ectopic endometrial tissue.'
      ],
      whenToSeeDoctor: [
        'If period cramps force you to stay in bed despite taking standard pain medication.',
        'If pelvic pain persists throughout the month, not just during periods.',
        'If you experience bowel or bladder pain synced with your cycle.'
      ],
      selfCareAndManagement: [
        'Consult an experienced gynecologist specializing in pelvic pain.',
        'Maintain a detailed daily symptom and pain journal.',
        'Explore pelvic floor physiotherapy and anti-inflammatory dietary strategies.'
      ],
      reliableSources: [
        {
          name: 'Endometriosis Fact Sheet',
          organization: 'World Health Organization (WHO)',
          url: 'https://www.who.int/news-room/fact-sheets/detail/endometriosis'
        }
      ]
    },
    contentBn: {
      introduction: 'এন্ডোমেট্রিওসিস একটি বিশেষ শারীরিক অবস্থা যেখানে জরায়ুর ভেতরের টিস্যুর মতো উপাদান জরায়ুর বাইরে (যেমন ডিম্বাশয় বা পেটের অন্যান্য অংশে) বৃদ্ধি পায়। এটি একটি দীর্ঘস্থায়ী প্রদাহজনিত সমস্যা।',
      commonSymptoms: [
        'তীব্র ও অসহ্য মাসিকের ব্যথা যা সাধারণ ব্যথানাশকে কমে না',
        'পিরিয়ড ছাড়াও মাসের অন্যান্য সময়ে তলপেট ও কোমরে সার্বক্ষণিক অস্বস্তি',
        'পিরিয়ডের সময় প্রস্রাব বা মলত্যাগের সময় তীব্র ব্যথা হওয়া',
        'গর্ভধারণে অযাচিত বিলম্ব বা জটিলতা'
      ],
      possibleCauses: [
        'জরায়ুর ভেতরের রক্ত বিপরীত দিকে ফ্যালোপিয়ান টিউব দিয়ে পেটের ভেতর প্রবাহিত হওয়া।',
        'শরীরের রোগ প্রতিরোধ ক্ষমতার ত্রুটি যা এই টিস্যু পরিষ্কার করতে পারে না।'
      ],
      whenToSeeDoctor: [
        'ব্যথা যদি স্বাভাবিক জীবনযাপন ব্যাহত করে এবং মাসের পর মাস বাড়তে থাকে।',
        'ডাক্তারকে স্পষ্ট করে জানান যে সাধারণ ওষুধে ব্যথা কমছে না।'
      ],
      selfCareAndManagement: [
        'প্রতিদিনের ব্যথার মাত্রা ডায়েরিতে লিখে রাখুন যাতে ডাক্তারকে সঠিক চিত্র দেখাতে পারেন।',
        'অভিজ্ঞ স্ত্রীরোগ বিশেষজ্ঞের পরামর্শ নিয়ে আল্ট্রাসনোগ্রাম বা প্রয়োজনীয় পরীক্ষা করান।'
      ],
      reliableSources: [
        {
          name: 'এন্ডোমেট্রিওসিস ফ্যাক্টশিট',
          organization: 'WHO',
          url: 'https://www.who.int/news-room/fact-sheets/detail/endometriosis'
        }
      ]
    }
  },
  {
    id: 'menstrual-hygiene-guide',
    category: 'hygiene',
    titleEn: 'Menstrual Hygiene & Health: Safe Products, Washing, and Infection Prevention',
    titleBn: 'মাসিককালীন ব্যক্তিগত পরিচ্ছন্নতা: সঠিক যত্ন ও ইনফেকশন প্রতিরোধ',
    summaryEn: 'Practical hygiene guidance: changing intervals, reusable vs disposable products, and maintaining vaginal flora.',
    summaryBn: 'প্যাড ব্যবহারের সঠিক নিয়ম, কতক্ষণ পর পর পরিবর্তন করতে হবে এবং চুলকানি ও ইনফেকশন থেকে বাঁচার উপায়।',
    readTime: '4 min',
    tags: ['Hygiene', 'Infection Prevention', 'Self Care', 'Pads & Cups'],
    reviewedDate: 'September 2026',
    reviewedBy: 'Curated from UNICEF & WHO Menstrual Health Hygiene Guidelines',
    contentEn: {
      introduction: 'Safe menstrual hygiene is fundamental to reproductive health and dignity. Proper habits reduce risks of bacterial vaginosis, candidiasis, and urinary tract infections (UTIs).',
      commonSymptoms: [
        'Foul-smelling discharge, burning sensation during urination, or persistent vulvar itchiness are signs of imbalance, not normal period signs.'
      ],
      possibleCauses: [
        'Keeping sanitary pads on for longer than 6 hours allows bacteria to proliferate in the warm, moist environment.',
        'Using scented soaps, vaginal douches, or harsh chemical washes which strip the natural protective lactic-acid producing lactobacilli.',
        'Using unwashed or damp cloth pads.'
      ],
      whenToSeeDoctor: [
        'Yellowish/greenish vaginal discharge with an unpleasant odor.',
        'Intense persistent vulvar itching or rash.',
        'Burning sensation during urination accompanied by fever.'
      ],
      selfCareAndManagement: [
        'Change sanitary pads every 4 to 6 hours regardless of flow level.',
        'Wash the external vulva with clean, plain water only. The vagina is naturally self-cleaning.',
        'Always wipe gently from front to back after using the toilet.',
        'If using reusable cloth pads, wash thoroughly with soap and dry in direct bright sunlight.'
      ],
      reliableSources: [
        {
          name: 'Guidance on Menstrual Health and Hygiene',
          organization: 'UNICEF Technical Guidelines',
          url: 'https://www.unicef.org/wash'
        }
      ]
    },
    contentBn: {
      introduction: 'মাসিকের সময় পরিষ্কার-পরিচ্ছন্ন থাকা সুস্বাস্থ্যের অন্যতম গুরুত্বপূর্ণ চাবিকাঠি। সঠিক নিয়ম না মানলে প্রস্রাবের ইনফেকশন বা জরায়ুর নানা জটিলতা হতে পারে।',
      commonSymptoms: [
        'প্রস্রাবে জ্বালাপোড়া, তীব্র চুলকানি বা দুর্গন্ধযুক্ত সাদা স্রাব হওয়া কোনো সাধারণ লক্ষণ নয়, বরং এটি ইনফেকশনের ইঙ্গিত।'
      ],
      possibleCauses: [
        'একই প্যাড ৪-৬ ঘণ্টার বেশি সময় ধরে পরে থাকা।',
        'সুগন্ধি সাবান বা কেমিক্যাল ওয়াশ ব্যবহার করা যা যৌনাঙ্গের উপকারী ব্যাকটেরিয়ার ভারসাম্য নষ্ট করে।',
        'স্যাঁতসেঁতে ভেজা কাপড় ব্যবহার করা।'
      ],
      whenToSeeDoctor: [
        'যদি প্রস্রাবের সময় জ্বালাপোড়ার সাথে তলপেটে ব্যথা বা জ্বর থাকে।',
        'যদি তীব্র চুলকানি বা অস্বাভাবিক রঙের স্রাব দেখা দেয়।'
      ],
      selfCareAndManagement: [
        'রক্তপাত কম হলেও প্রতি ৪ থেকে ৬ ঘণ্টা পর পর প্যাড পরিবর্তন করুন।',
        'পরিষ্কারের জন্য শুধুমাত্র সাধারণ পরিষ্কার পানি ব্যবহার করুন; ক্ষতিকর সাবান ভেতরে দেবেন না।',
        'শৌচকর্মের সময় সবসময় সামনে থেকে পেছনের দিকে পানি ঢালুন ও মুছুন।',
        'কাপড় ব্যবহার করলে তা সাবান দিয়ে ভালো করে ধুয়ে কড়া রোদে শুকিয়ে নিন।'
      ],
      reliableSources: [
        {
          name: 'মাসিক স্বাস্থ্য ও পরিচ্ছন্নতা নির্দেশিকা',
          organization: 'UNICEF',
          url: 'https://www.unicef.org'
        }
      ]
    }
  },
  {
    id: 'when-to-see-a-doctor',
    category: 'medical_care',
    titleEn: 'When to Seek Medical Care: Red Flags & Urgent Care Guidance',
    titleBn: 'কখন জরুরি বা সাধারণ ডাক্তারের কাছে যাবেন: বিপদচিহ্ন ও করণীয়',
    summaryEn: 'Distinguish between symptoms that warrant a routine appointment vs emergency emergency care.',
    summaryBn: 'কোন লক্ষণগুলো সাধারণ আর কোন লক্ষণ দেখা দিলে কালক্ষেপণ না করে দ্রুত হাসপাতালে যেতে হবে।',
    readTime: '4 min',
    tags: ['Urgent Care', 'Red Flags', 'Doctor Visit', 'Safety'],
    reviewedDate: 'October 2026',
    reviewedBy: 'Curated from Emergency Medicine & FIGO Clinical Protocols',
    contentEn: {
      introduction: 'Most menstrual variations are manageable, but certain acute red-flag symptoms require prompt medical evaluation to prevent life-threatening complications like ectopic pregnancy or severe hemorrhage.',
      commonSymptoms: [
        'EMERGENCY: Soaking 2+ sanitary pads per hour for 2 consecutive hours.',
        'EMERGENCY: Sudden, sharp, one-sided pelvic pain with dizziness, shoulder-tip pain, or fainting.',
        'EMERGENCY: High fever (above 38.5°C / 101.3°F) following tampon use or intrauterine procedure.',
        'ROUTINE: Periods suddenly stopping for 90 days with negative pregnancy test.',
        'ROUTINE: Progressive worsening of menstrual cramps over 6 months.'
      ],
      possibleCauses: [
        'Ruptured ovarian cyst, ectopic pregnancy, pelvic inflammatory disease (PID), or severe uterine bleeding.'
      ],
      whenToSeeDoctor: [
        'Proceed to the nearest emergency department if you experience any of the emergency red flags listed above.',
        'Book an outpatient consultation with a board-certified gynecologist for routine concerns.'
      ],
      selfCareAndManagement: [
        'Do not drive yourself if feeling lightheaded or weak; seek transport assistance.',
        'Have your CycleSense logs and dates ready on your phone to show the triage doctor.'
      ],
      reliableSources: [
        {
          name: 'Emergency Gynecologic Conditions Overview',
          organization: 'American College of Emergency Physicians (ACEP)',
          url: 'https://www.emergencyphysicians.org'
        }
      ]
    },
    contentBn: {
      introduction: 'মাসিকের অধিকাংশ তারতম্যই জীবনযাত্রার পরিবর্তনে ঠিক হয়ে যায়। তবে কিছু বিশেষ জরুরি বিপদচিহ্ন রয়েছে যা দেখা দিলে ঘরে বসে না থেকে তাৎক্ষণিক হাসপাতালে যাওয়া প্রয়োজন।',
      commonSymptoms: [
        'জরুরি বিপদচিহ্ন: একাধারে দুই ঘণ্টা প্রতি ঘণ্টায় ২টি বা তার বেশি প্যাড ভিজে যাওয়া।',
        'জরুরি বিপদচিহ্ন: হঠাৎ তলপেটে তীব্র একপাশে প্রচণ্ড ব্যথা এবং সাথে মাথা ঘোরা বা অজ্ঞান হয়ে যাওয়া।',
        'জরুরি বিপদচিহ্ন: পিরিয়ডের সাথে তীব্র কাঁপুনি দিয়ে ১০১ ডিগ্রির বেশি জ্বর আসা।',
        'সাধারণ ডাক্তার দেখানো: টানা ৩ মাস পিরিয়ড বন্ধ থাকা কিন্তু প্রেগন্যান্সি টেস্ট নেগেটিভ।'
      ],
      possibleCauses: [
        'একটোপিক প্রেগন্যান্সি (জরায়ুর বাইরে গর্ভধারণ), ওভারিয়ান সিস্ট ফেটে যাওয়া বা তীব্র ইনফেকশন।'
      ],
      whenToSeeDoctor: [
        'জরুরি লক্ষণ দেখা দিলে এক মুহূর্তও দেরি না করে নিকটস্থ জরুরি বিভাগে যোগাযোগ করুন।',
        'স্বাভাবিক অনিয়মের ক্ষেত্রে অভিজ্ঞ গাইনী ডাক্তারের চেম্বারে সিরিয়াল নিন।'
      ],
      selfCareAndManagement: [
        'মাথা ঘুরলে একা চলাফেরা করবেন না, পরিবারের সাহায্য নিন।',
        'ডাক্তারের কাছে যাওয়ার সময় আপনার সাইকেলসেন্স অ্যাপের তথ্য সঙ্গে রাখুন।'
      ],
      reliableSources: [
        {
          name: 'জরুরি গাইনিকোলজিক্যাল কেয়ার',
          organization: 'ACEP',
          url: 'https://www.emergencyphysicians.org'
        }
      ]
    }
  }
];
