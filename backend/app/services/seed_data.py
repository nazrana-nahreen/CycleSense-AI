import json
from sqlalchemy.orm import Session
from app.models.article import EducationalArticle

INITIAL_ARTICLES = [
    {
        "id": "pcos-guide",
        "title": "Understanding PCOS: Symptoms, Hormones, and Lifestyle Support",
        "title_bn": "পিসিওএস (PCOS) কী? লক্ষণ, হরমোনের প্রভাব ও জীবনযাত্রার যত্ন",
        "summary": "A clear, compassionate guide to Polycystic Ovary Syndrome, metabolic factors, and evidence-based management.",
        "summary_bn": "পলিসিস্টিক ওভারি সিন্ড্রোম (PCOS) সম্পর্কে সহজ ভাষায় ধারণা, এর সাধারণ লক্ষণ ও জীবনযাত্রার ইতিবাচক পরিবর্তন।",
        "category": "pcos",
        "read_time": "6 min",
        "verified": True,
        "reviewer": "Curated from WHO & ACOG Guidelines (Reviewed by Dr. S. Rahman, Obs & Gynae)",
        "content": "Polycystic Ovary Syndrome (PCOS) is a common endocrine and metabolic condition affecting approximately 8–13% of reproductive-aged women globally. It is characterized by hormonal imbalances—particularly elevated androgens (male-type hormones)—and insulin resistance. Prioritize low-glycemic, fiber-rich meals with lean protein to stabilize blood glucose and incorporate regular moderate exercise.",
        "content_bn": "পলিসিস্টিক ওভারি সিন্ড্রোম (PCOS) নারীদের অন্যতম সাধারণ একটি হরমোনজনিত অবস্থা। বিশ্বব্যাপী প্রায় ৮-১৩% প্রজননক্ষম নারী এই অভিজ্ঞতার মধ্য দিয়ে যান। এতে শরীরে অ্যান্ড্রোজেন বা পুরুষ হরমোন কিছুটা বেড়ে যায় এবং ইনসুলিন রেজিস্ট্যান্সের কারণে ডিম্বাশয় থেকে ডিম্বাণু নিয়মিত মুক্ত হতে পারে না। পুষ্টিকর খাবার গ্রহণ এবং শারীরিক সক্রিয়তা এই অবস্থা নিয়ন্ত্রণে বিশেষ ভূমিকা রাখে।",
        "symptoms": [
            "Irregular, infrequent, or absent menstrual periods",
            "Excess facial or body hair growth (hirsutism)",
            "Persistent adult acne along jawline",
            "Thinning scalp hair",
            "Difficulty managing body weight"
        ],
        "when_to_consult": [
            "If your period is delayed by more than 35 days consistently",
            "Fewer than 8 periods a year",
            "Sudden, rapid facial hair growth",
            "Severe pelvic pain"
        ],
        "sources": [
            {"title": "WHO Fact Sheet on Polycystic Ovary Syndrome", "url": "https://www.who.int/news-room/fact-sheets/detail/polycystic-ovary-syndrome"},
            {"title": "ACOG Practice Bulletin #218: PCOS", "url": "https://www.acog.org"}
        ]
    },
    {
        "id": "irregular-periods",
        "title": "Why Is My Period Late or Irregular? Common Explanations",
        "title_bn": "পিরিয়ড দেরিতে বা অনিয়মিত হওয়ার সাধারণ কারণগুলো কী?",
        "summary": "Explore natural variations, stress impacts, metabolic shifts, and when an irregular cycle needs attention.",
        "summary_bn": "মানসিক চাপ, খাদ্যাভ্যাস, ওজন পরিবর্তন ও হরমোনের তারতম্যের কারণে পিরিয়ড কেন অনিয়মিত হতে পারে তার বিশদ।",
        "category": "irregular_periods",
        "read_time": "5 min",
        "verified": True,
        "reviewer": "American College of Obstetricians and Gynecologists (ACOG)",
        "content": "A menstrual cycle is commonly 24 to 38 days long. Variation of a few days from month to month is completely standard. Factors like acute illness, substantial emotional stress, rapid weight fluctuations, thyroid disorders, and hyperprolactinemia can alter ovulation timing and delay menstruation.",
        "content_bn": "সাধারণত একটি স্বাভাবিক পিরিয়ড সাইকেল ২৪ থেকে ৩৮ দিনের মধ্যে হতে পারে। প্রতি মাসে কয়েক দিনের এদিক-ওদিক হওয়া স্বাভাবিক। তবে অতিরিক্ত মানসিক চাপ, দ্রুত ওজন হ্রাস বা বৃদ্ধি, থাইরয়েড সমস্যা এবং হরমোনের ওঠানামার কারণে ডিম্বস্ফোটন বিলম্বিত হতে পারে।",
        "symptoms": [
            "Cycle shorter than 21 days or longer than 38 days",
            "Periods varying by more than 7-9 days between cycles",
            "Bleeding between scheduled periods (spotting)"
        ],
        "when_to_consult": [
            "Periods stopping for more than 90 days without pregnancy",
            "Bleeding lasting longer than 7 consecutive days",
            "Severe abdominal cramping not relieved by rest"
        ],
        "sources": [
            {"title": "NHS UK: Irregular Periods Overview", "url": "https://www.nhs.uk/conditions/irregular-periods/"},
            {"title": "ACOG: Menstruation in Girls and Adolescents", "url": "https://www.acog.org/clinical/clinical-guidance/committee-opinion/articles/2015/12/menstruation-in-girls-and-adolescents"}
        ]
    },
    {
        "id": "painful-periods",
        "title": "Period Pain (Dysmenorrhea): What Is Typical vs. Concerning",
        "title_bn": "মাসিকের তীব্র ব্যথা (ডিসমেনোরিয়া): কোনটি স্বাভাবিক আর কোনটি উদ্বেগের?",
        "summary": "Understand primary vs. secondary dysmenorrhea, prostaglandins, and self-care methods.",
        "summary_bn": "প্রোস্টাগ্ল্যান্ডিন হরমোনের প্রভাব, প্রাথমিক ও জটিল ব্যথার পার্থক্য এবং উপশমের উপায়।",
        "category": "painful_periods",
        "read_time": "5 min",
        "verified": True,
        "reviewer": "National Health Service (NHS UK)",
        "content": "Mild-to-moderate cramps are driven by natural uterine contractions triggered by prostaglandins. When pain is debilitating, radiates down the thighs or into the lower back, or resists standard NSAID medication, secondary causes such as endometriosis, adenomyosis, or uterine fibroids should be evaluated.",
        "content_bn": "পিরিয়ডের শুরুতে জরায়ুর পেশী সংকুচিত হওয়ায় পেটে মৃদু থেকে মাঝারি ব্যথা হওয়া স্বাভাবিক। তবে যদি ব্যথা এত বেশি হয় যে দৈনন্দিন কাজ ব্যাহত হয়, বমি হয় বা সাধারণ ব্যথানাশকে কাজ না করে, তবে চিকিৎসকের শরণাপন্ন হওয়া জরুরি।",
        "symptoms": [
            "Throbbing or cramping pain in the lower abdomen",
            "Pain radiating to lower back and inner thighs",
            "Nausea, loose stools, or dizziness on day 1-2"
        ],
        "when_to_consult": [
            "Pain that prevents attending school, work, or daily life",
            "Cramps worsening progressively year after year",
            "Pain occurring outside the menstrual window"
        ],
        "sources": [
            {"title": "NHS Guidelines: Period Pain", "url": "https://www.nhs.uk/conditions/period-pain/"},
            {"title": "ACOG Patient FAQ: Dysmenorrhea", "url": "https://www.acog.org/womens-health/faqs/dysmenorrhea-painful-periods"}
        ]
    },
    {
        "id": "heavy-bleeding",
        "title": "Heavy Menstrual Bleeding (Menorrhagia): Signals & Treatment",
        "title_bn": "অতিরিক্ত রক্তক্ষরণ (মেনোরেজিয়া): লক্ষণ ও চিকিৎসার প্রয়োজনীয়তা",
        "summary": "How to recognize abnormal uterine bleeding, prevent iron deficiency anemia, and when to seek urgent care.",
        "summary_bn": "অতিরিক্ত রক্তপাতের সতর্কবার্তা, রক্তস্বল্পতা প্রতিরোধ ও ডাক্তারের পরামর্শ নেওয়ার নিয়ম।",
        "category": "heavy_bleeding",
        "read_time": "5 min",
        "verified": True,
        "reviewer": "ACOG Clinical Practice Guideline #14",
        "content": "Heavy menstrual bleeding is clinically characterized by soaking through one or more sanitary pads or tampons every hour for several consecutive hours, passing blood clots larger than a quarter, or bleeding lasting beyond seven days. Heavy loss can lead to fatigue, shortness of breath, and iron-deficiency anemia.",
        "content_bn": "যদি প্রতি ঘণ্টায় এক বা একাধিক প্যাড সম্পূর্ণ ভিজে যায়, কয়েনের চেয়ে বড় রক্তের চাকা বের হয়, বা রক্তপাত একটানা ৭ দিনের বেশি স্থায়ী হয়, তবে তাকে অতিরিক্ত রক্তক্ষরণ হিসেবে গণ্য করা হয়। এর ফলে শরীর দুর্বল হতে পারে এবং রক্তস্বল্পতা দেখা দিতে পারে।",
        "symptoms": [
            "Soaking through a pad every 1-2 hours",
            "Needing double protection (pad + tampon simultaneously)",
            "Passing large blood clots",
            "Extreme fatigue or pale skin during bleeding days"
        ],
        "when_to_consult": [
            "Dizziness, faintness, or rapid heart rate during period",
            "Bleeding continuously for more than 7 days",
            "Post-menopausal bleeding of any volume"
        ],
        "sources": [
            {"title": "CDC: Heavy Menstrual Bleeding", "url": "https://www.cdc.gov/ncbddd/blooddisorders/women/menorrhagia.html"},
            {"title": "WHO: Iron Deficiency Anaemia Guidance", "url": "https://www.who.int/publications/i/item/9789241549448"}
        ]
    },
    {
        "id": "endometriosis-awareness",
        "title": "Endometriosis: Symptoms Beyond Ordinary Period Cramps",
        "title_bn": "এন্ডোমেট্রিওসিস: সাধারণ ব্যথার বাইরের জটিল লক্ষণগুলো",
        "summary": "A deep dive into endometrial-like tissue growth outside the uterus and chronic pelvic pain.",
        "summary_bn": "জরায়ুর বাইরে টিস্যু বৃদ্ধির লক্ষণ, দীর্ঘমেয়াদী পেলভিক ব্যথা ও সচেতনতা।",
        "category": "endometriosis",
        "read_time": "6 min",
        "verified": True,
        "reviewer": "World Endometriosis Society",
        "content": "Endometriosis occurs when tissue similar to the lining of the uterus grows outside the uterine cavity, commonly on the ovaries, fallopian tubes, and outer surfaces of other pelvic organs. It causes chronic inflammation, scarring (adhesions), deep pelvic pain, and can affect fertility if left unmanaged.",
        "content_bn": "এন্ডোমেট্রিওসিস একটি দীর্ঘমেয়াদী শারীরিক অবস্থা যেখানে জরায়ুর ভেতরের স্তরের মতো টিস্যু জরায়ুর বাইরে ডিম্বাশয় বা পেটের অন্যান্য অংশে জন্মায়। এটি অতিরিক্ত ব্যথা, প্রদাহ এবং প্রজনন ক্ষমতার উপর প্রভাব ফেলতে পারে। সময়মতো রোগ নির্ণয় অত্যন্ত গুরুত্বপূর্ণ।",
        "symptoms": [
            "Chronic pelvic pain throughout the month, not just during periods",
            "Painful bowel movements or urination during menstruation",
            "Pain during or after sexual intercourse",
            "Subfertility or repeated pregnancy loss"
        ],
        "when_to_consult": [
            "Severe pelvic pain not responding to standard painkillers",
            "Digestive symptoms synchronized with cycle phases",
            "Suspected difficulty conceiving"
        ],
        "sources": [
            {"title": "WHO: Endometriosis Fact Sheet", "url": "https://www.who.int/news-room/fact-sheets/detail/endometriosis"},
            {"title": "Endometriosis.org Global Consortium", "url": "https://endometriosis.org"}
        ]
    },
    {
        "id": "menstrual-hygiene",
        "title": "Safe Menstrual Hygiene & Infection Prevention",
        "title_bn": "মাসিক চলাকালীন সঠিক স্বাস্থ্যবিধি ও সংক্রমণ প্রতিরোধ",
        "summary": "Evidence-backed guidance on product selection, change intervals, and reproductive tract health.",
        "summary_bn": "প্যাড ও কাপ ব্যবহারের সঠিক নিয়ম, পরিচ্ছন্নতা এবং ইনফেকশন থেকে সুরক্ষার উপায়।",
        "category": "hygiene",
        "read_time": "4 min",
        "verified": True,
        "reviewer": "UNICEF & WHO Menstrual Health Group",
        "content": "Changing sanitary pads every 4 to 6 hours (or tampons every 4 to 8 hours) prevents bacterial proliferation and odor. Menstrual cups should be emptied every 8 to 12 hours and sterilized between cycles in boiling water. Avoid scented washes or douching, which disrupts protective vaginal lactobacilli.",
        "content_bn": "সুস্থ থাকতে প্রতি ৪ থেকে ৬ ঘণ্টা পরপর প্যাড পরিবর্তন করা উচিত। সুতি ও আরামদায়ক অন্তর্বাস পরিধান করা এবং সুগন্ধি সাবান বা রাসায়নিক ব্যবহার এড়িয়ে চলা উচিত, যা যোনিপথের স্বাভাবিক অম্লীয় ভারসাম্য নষ্ট করে।",
        "symptoms": [
            "Foul-smelling or discolored vaginal discharge",
            "Itching, burning, or redness in the vulvar area",
            "Painful urination"
        ],
        "when_to_consult": [
            "Fever with rash following tampon use (urgent: Toxic Shock Syndrome)",
            "Persistent abnormal discharge accompanied by pelvic discomfort"
        ],
        "sources": [
            {"title": "UNICEF: Guidance on Menstrual Health and Hygiene", "url": "https://www.unicef.org/wash/menstrual-hygiene"},
            {"title": "CDC: Hygiene Fast Facts", "url": "https://www.cdc.gov/hygiene/fast-facts/"}
        ]
    }
]


def seed_articles(db: Session):
    """Populates initial educational articles if the table is empty."""
    count = db.query(EducationalArticle).count()
    if count == 0:
        for item in INITIAL_ARTICLES:
            article = EducationalArticle(
                id=item["id"],
                title=item["title"],
                title_bn=item["title_bn"],
                summary=item["summary"],
                summary_bn=item["summary_bn"],
                category=item["category"],
                read_time=item["read_time"],
                verified=item["verified"],
                reviewer=item["reviewer"],
                content=item["content"],
                content_bn=item["content_bn"],
                symptoms_json=json.dumps(item["symptoms"]),
                when_to_consult_json=json.dumps(item["when_to_consult"]),
                sources_json=json.dumps(item["sources"]),
            )
            db.add(article)
        db.commit()
