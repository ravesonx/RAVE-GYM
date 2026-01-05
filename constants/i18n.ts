import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
    en: {
        translation: {
            login: {
                title: "MEMBER LOGIN",
                subtitle: "RAW POWER. PURE PASSION.",
                label: "Member Login",
                phonePlaceholder: "5XX XXX XX XX",
                button: "CONTINUE",
                validation: "Please enter a valid phone number."
            },
            register: {
                title: "REGISTER",
                subtitle: "Join the RAVE GYM Family",
                namePlaceholder: "Name",
                surnamePlaceholder: "Surname",
                emailPlaceholder: "Email Address",
                kvkkText: "I have read and approved the ",
                kvkkHighlight: "KVKK Text",
                button: "COMPLETE REGISTRATION",
                validationKVKK: "Please approve the KVKK text.",
                validationFields: "Please fill in all fields."
            },
            home: {
                welcome: "WELCOME",
                programTitle: "YOUR PERSONAL PROGRAM",
                programSubtitle: "Designed for Your Goals",
                viewProgram: "VIEW PROGRAM",
                targetZoneTitle: "WHAT ARE YOU TRAINING?",
                whereToTrain: "WHERE DO YOU WANT TO TRAIN?",
                gym: "GYM",
                home: "HOME",
                outdoor: "OUTDOOR",
                dailyQuote: "\"THE ONLY BAD WORKOUT IS THE ONE THAT DIDN'T HAPPEN.\"",
                workout1: "WORKOUT 1",
                workout2: "WORKOUT 2",
                workout3: "WORKOUT 3",
                zones: {
                    chest: "CHEST",
                    back: "BACK",
                    legs: "LEGS",
                    arms: "ARMS",
                    shoulders: "SHOULDERS",
                    fullbody: "FULL BODY",
                    abs: "ABS",
                    gym: "GYM",
                    home: "HOME",
                    outdoor: "OUTDOOR"
                },
                programs: {
                    chest: ["Beginner Chest", "Upper Chest Focus", "Advanced Volume"],
                    back: ["Overall Back Dev", "Lats & Width", "Power & Thickness"],
                    legs: ["Basic Leg Strength", "Squat Focus", "Full Legs & Calves"],
                    shoulders: ["Dumbbell Press", "3D Shoulders", "Side & Rear Delt"],
                    arms: ["Bi & Tri Superset", "Arm Mass", "Definition"],
                    abs: ["Abs Beginner", "Core Strength", "Six Pack Challenge"],
                    fullbody: ["Full Body Start", "Metabolic Conditioning", "Strength & Endurance"]
                }
            },
            profile: {
                tab: "PROFILE",
                title: "MY PROFILE",
                edit: "EDIT PROFILE",
                pointsParams: "TOTAL POINTS",
                leaderboardLabel: "LEADERBOARD",
                stats: {
                    workouts: "WORKOUTS",
                    kcal: "CALORIES (KCAL)",
                    time: "TIME (MIN)"
                },
                reports: {
                    title: "MY REPORTS",
                    weekly: "WEEKLY",
                    monthly: "MONTHLY",
                    stats: {
                        count: "Workout Count",
                        time: "Workout Duration",
                        kcal: "Calories Burned",
                        weight: "Total Weight",
                        regions: "Worked Regions"
                    }
                },
                measurements: {
                    title: "MEASUREMENTS",
                    empty: "You have no measurements yet.",
                    emptyCTA: "Click the button below to enter a manual measurement.",
                    new: "NEW MEASUREMENT",
                    manual: "ENTER MANUEL MEASUREMENT",
                    form: {
                        title: "PERSONAL INFORMATION",
                        save: "SAVE",
                        gender: "GENDER",
                        birthDate: "DATE OF BIRTH",
                        height: "HEIGHT (CM)",
                        weight: "WEIGHT (KG)",
                        neck: "NECK (CM)",
                        waist: "WAIST (CM)",
                        hip: "HIP (CM)"
                    }
                },
                menu: {
                    membership: "MEMBERSHIP INFO",
                    reports: "MY REPORTS",
                    measurements: "MEASUREMENTS",
                    preferences: "MY PREFERENCES"
                },
                preferences: {
                    title: "MY PREFERENCES",
                    target: {
                        title: "TARGET",
                        loseWeight: "Lose Weight",
                        gainMuscle: "Gain Muscle",
                        maintainForm: "Maintain Form",
                        reduceStress: "Reduce Stress"
                    },
                    experience: {
                        title: "FITNESS EXPERIENCE",
                        none: "No Experience",
                        lessThan1: "Less than 1 Year",
                        oneToTwo: "1-2 Years",
                        moreThan2: "+2 Years"
                    },
                    frequency: {
                        title: "TRAINING FREQUENCY (LAST 3 MONTHS)",
                        question: "How often have you trained?",
                        veryLittle: "Very Little",
                        oneTwo: "1-2/Week",
                        threePlus: "+3/Week"
                    },
                    formLevel: {
                        title: "FORM LEVEL",
                        question: "How many pushups in 1 min?",
                        lessThan10: "-10",
                        tenToThirty: "10-30",
                        dontKnow: "Don't Know"
                    },
                    weekly: {
                        title: "WEEKLY TIME",
                        question: "Days per week?",
                    },
                    daily: {
                        title: "DAILY TIME",
                        mins15: "15",
                        mins30: "30",
                        mins45: "45",
                        mins60Plus: "60+"
                    },
                    save: "SAVE"
                },
                settings: {
                    title: "SETTINGS",
                    privacy: "ACCOUNT PRIVACY",
                    contact: "CONTACT US",
                    terms: "TERMS OF USE",
                    privacyPage: {
                        label: "Private Account",
                        description: "Everyone can see your profile and rank."
                    },
                    termsContent: `RAVE GYM TERMS OF USE

1. GENERAL PROVISIONS
This agreement sets forth the rules and responsibilities for RAVE GYM members. Every member is deemed to have accepted these rules.

2. HEALTH AND SAFETY
- Members declare that they have no health problems preventing them from doing sports.
- Members are responsible for their own health problems that may occur during training.
- Use of a towel is mandatory during workouts.
- It is mandatory to wear clean sports shoes and appropriate sportswear tailored for indoor use.

3. USE OF EQUIPMENT
- Weights must be returned to their places after use.
- Equipment must be used gently and without causing damage.
- Members must respect others' rights to use equipment during crowded hours.

4. MEMBERSHIP RIGHTS
- Membership belongs to the person and cannot be transferred to others.
- The gym management reserves the right to terminate the membership of users who do not comply with the rules.`
                },
                workouts: {
                    tab: "WORKOUTS",
                    searchPlaceholder: "Search",
                    categories: {
                        created: "Created by Me",
                        trainer: "Home Page",
                        favorites: "Favorites",
                        recent: "Recently Done"
                    },
                    top10Title: "TOP 10 WORKOUT PROGRAMS",
                    suggestedTitle: "YOU MIGHT LIKE",
                    programCard: {
                        duration: "min",
                        level: "Level",
                        kcal: "kcal"
                    },
                    subCategories: {
                        workout: "Workout",
                        program: "Programs"
                    },
                    create: {
                        button: "Create Workout",
                        title: "New Workout",
                        name: "Workout Name",
                        description: "Description",
                        level: "Level",
                        focus: "Focus Area",
                        goal: "Goal",
                        category: "Category",
                        duration: "Duration (min)",
                        save: "SAVE"
                    },
                    favorites: {
                        getWorkouts: "Workouts",
                        getPrograms: "Programs",
                        emptyWorkouts: "Click button to find random workouts!",
                        emptyPrograms: "Click button to find random programs!"
                    }
                },
                editProfile: {
                    header: "ACCOUNT INFORMATION",
                    save: "SAVE CHANGES",
                    name: "NAME",
                    surname: "SURNAME",
                    memberProfile: "MEMBER PROFILE",
                    birthDate: "DATE OF BIRTH",
                    gender: {
                        label: "GENDER",
                        male: "MALE",
                        female: "FEMALE"
                    },
                    height: "HEIGHT (CM)",
                    weight: "WEIGHT (KG)"
                },
                leaderboardScreen: {
                    title: "LEADERBOARD",
                    rank: "RANK",
                    member: "MEMBER",
                    points: "POINTS",
                    you: "YOU"
                },
                membership: {
                    title: "MEMBERSHIP INFO",
                    currentPackage: "CURRENT PACKAGE",
                    memberId: "MEMBER ID",
                    status: "STATUS",
                    active: "ACTIVE",
                    renew: "RENEW / UPGRADE",
                    selectClubTitle: "SELECT CLUB",
                    selectCity: "SELECT CITY",
                    selectClub: "SELECT CLUB",
                    continue: "CONTINUE",
                    plansTitle: "MEMBERSHIP PLANS",
                    monthly: "MONTHLY",
                    monthlyDesc: "12 Months Commitment",
                    upfront: "UPFRONT",
                    upfrontDesc: "%20 DISCOUNT",
                    promoCode: "PROMO CODE",
                    apply: "APPLY",
                    buy: "SELECT PACKAGE",
                    packages: {
                        classic: { name: "CLASSIC", features: ["Unlimited Access", "Basic Equipment", "Locker Room"] },
                        gold: { name: "GOLD", features: ["All Branches", "Group Classes", "Guest Pass"] },
                        platinum: { name: "PLATINUM", features: ["Private Locker", "Spa & Pool", "Personal Trainer (2x/mo)"] }
                    },
                    form: {
                        personalInfo: "PERSONAL INFORMATION",
                        identityNo: "TC IDENTITY NO",
                        notCitizen: "I am not a Turkish Citizen",
                        birthDate: "DATE OF BIRTH",
                        under16: "Membership limit: 16+ years old",
                        gender: "GENDER",
                        male: "Male",
                        female: "Female",
                        contactInfo: "CONTACT INFORMATION",
                        phone: "PHONE NUMBER",
                        email: "E-MAIL ADDRESS",
                        confirm: "CONFIRM"
                    },
                    addons: {
                        title: "DISCOVER ADD-ONS",
                        subtitle: "Customize Your Experience",
                        pt: {
                            title: "PERSONAL TRAINER",
                            desc: "1-on-1 Coaching (10 Sessions)",
                            price: "5000 TL"
                        },
                        nutrition: {
                            title: "NUTRITION CONSULTING",
                            desc: "Personalized Diet Plan",
                            price: "1500 TL"
                        },
                        recovery: {
                            title: "RECOVERY PACK",
                            desc: "Spa, Massage & Pool Access",
                            price: "2000 TL"
                        },
                        locker: {
                            title: "PRIVATE LOCKER",
                            desc: "Your Own Locked Storage",
                            price: "500 TL/mo"
                        },
                        continue: "PROCEED TO PAYMENT"
                    }
                },
                calendar: {
                    showWeekly: "Show Weekly",
                    dailySteps: "Daily Steps",
                    calories: "Calories"
                },
                camera: {
                    permissionMessage: 'We need your permission to use the camera',
                    grantPermission: 'Grant Permission',
                    scannedTitle: 'QR Code Scanned',
                    scannedData: 'Data',
                    scanTitle: 'SCAN QR CODE',
                    instruction: 'Point the camera at the code',
                },
                ai: {
                    title: 'AI ASSISTANT',
                    welcome: 'Hello! I am your advanced AI Assistant. I can help you with workouts, nutrition, or answer any question you have!',
                    placeholder: 'Ask me anything...',
                }
            }
        }
    },
    tr: {
        translation: {
            login: {
                title: "ÜYE GİRİŞİ",
                subtitle: "RAW POWER. PURE PASSION.",
                label: "Üye Girişi",
                phonePlaceholder: "5XX XXX XX XX",
                button: "DEVAM ET",
                validation: "Lütfen geçerli bir telefon numarası giriniz."
            },
            register: {
                title: "KAYIT OL",
                subtitle: "RAVE GYM Ailesine Katıl",
                namePlaceholder: "İsim",
                surnamePlaceholder: "Soyisim",
                emailPlaceholder: "E-posta Adresi",
                kvkkText: "",
                kvkkHighlight: "KVKK Metnini",
                kvkkTextSuffix: " okudum ve onaylıyorum.",
                button: "KAYDI TAMAMLA",
                validationKVKK: "Lütfen KVKK metnini onaylayınız.",
                validationFields: "Lütfen tüm alanları doldurunuz."
            },
            citySelection: {
                title: "KONUM SEÇİN",
                subtitle: "Size en yakın RAVE GYM'i seçin",
                searchPlaceholder: "Şehir Ara...",
                continue: "DEVAM ET"
            },
            home: {
                welcome: "HOŞGELDİN",
                programTitle: "SANA ÖZEL PROGRAM",
                programSubtitle: "Hedefine Ulaşman İçin Hazırlandı",
                viewProgram: "PROGRAMI GÖRÜNTÜLE",
                targetZoneTitle: "HANGİ BÖLGEYİ ÇALIŞACAKSIN?",
                whereToTrain: "NEREDE SPOR YAPMAK İSTERSİN?",
                gym: "SPOR SALONU",
                home: "EV",
                outdoor: "DIŞARI",
                dailyQuote: "\"TEK KÖTÜ ANTRENMAN, HİÇ YAPILMAMIŞ OLANDIR.\"",
                workout1: "1. ANTRENMAN",
                workout2: "2. ANTRENMAN",
                workout3: "3. ANTRENMAN",
                zones: {
                    chest: "GÖĞÜS",
                    back: "SIRT",
                    legs: "BACAK",
                    arms: "KOLLAR",
                    shoulders: "OMUZ",
                    fullbody: "TÜM VÜCUT",
                    abs: "KARIN"
                },
                programs: {
                    chest: ["Başlangıç Göğüs", "Üst Göğüs Odaklı", "İleri Seviye Hacim"],
                    back: ["Genel Sırt Gelişimi", "Kanat & Genişlik", "Güç & Kalınlık"],
                    legs: ["Temel Bacak Kuvveti", "Squat Odaklı", "Tüm Bacak & Kalf"],
                    shoulders: ["Dambıl Omuz Pres", "3 Boyutlu Omuzlar", "Yan & Arka Omuz"],
                    arms: ["Biceps & Triceps Süperset", "Kol Hacim", "Parçalama"],
                    abs: ["Karın Kası Başlangıç", "Core Kuvvet", "Six Pack Zorlu"],
                    fullbody: ["Tüm Vücut Başlangıç", "Metabolik Kondisyon", "Güç & Dayanıklılık"]
                }
            },
            profile: {
                tab: "PROFİL",
                title: "PROFİLİM",
                edit: "PROFİLİ DÜZENLE",
                pointsParams: "TOPLAM PUAN",
                leaderboardLabel: "LİDERLİK TABLOSU",
                stats: {
                    workouts: "ANTRENMAN",
                    kcal: "KALORİ (KCAL)",
                    time: "SÜRE (DK)"
                },
                reports: {
                    title: "RAPORLARIM",
                    weekly: "HAFTALIK",
                    monthly: "AYLIK",
                    stats: {
                        count: "Antrenman Sayısı",
                        time: "Antrenman Süresi",
                        kcal: "Yakılan Kalori",
                        weight: "Kaldırılan Ağırlık",
                        regions: "Çalıştırılan Bölgeler"
                    }
                },
                measurements: {
                    title: "ÖLÇÜMLERİM",
                    empty: "Henüz bir ölçümünüz yok.",
                    emptyCTA: "Manuel ölçüm girmek için aşağıdaki butona tıklayınız.",
                    new: "YENİ ÖLÇÜM",
                    manual: "MANUEL ÖLÇÜM GİR",
                    form: {
                        title: "KİŞİSEL BİLGİLER",
                        save: "KAYDET",
                        gender: "CİNSİYET",
                        birthDate: "DOĞUM TARİHİ",
                        height: "BOY (CM)",
                        weight: "KİLO (KG)",
                        neck: "BOYUN ÇEVRESİ (CM)",
                        waist: "BEL ÇEVRESİ (CM)",
                        hip: "KALÇA ÇEVRESİ (CM)"
                    }
                },
                menu: {
                    membership: "ÜYELİK BİLGİLERİM",
                    reports: "RAPORLARIM",
                    measurements: "ÖLÇÜMLERİM",
                    preferences: "ANTRENMAN TERCİHLERİM"
                },
                preferences: {
                    title: "ANTRENMAN TERCİHLERİM",
                    target: {
                        title: "HEDEF",
                        question: "Hedefin nedir?",
                        loseWeight: "Kilo Vermek",
                        gainMuscle: "Kas Kazanmak",
                        maintainForm: "Formunu Korumak",
                        endurance: "Dayanıklılığı Artırmak",
                        reduceStress: "Stres Atmak"
                    },
                    experience: {
                        title: "FITNESS TECRÜBESİ",
                        none: "Tecrübem Yok",
                        lessThan1: "1 Yıldan Az",
                        oneToTwo: "1-2 Yıl",
                        moreThan2: "+2 Yıl"
                    },
                    frequency: {
                        title: "SON 3 AY ANTRENMAN SIKLIĞI",
                        question: "Son 3 aydır ne sıklıkla antrenman yapıyorsun?",
                        veryLittle: "Çok Az",
                        oneTwo: "Haftada 1-2",
                        threePlus: "Haftada +3"
                    },
                    formLevel: {
                        title: "FORM SEVİYESİ",
                        question: "1 dakikada kaç adet şınav çekebilirsin?",
                        lessThan10: "-10",
                        tenToThirty: "10-30",
                        dontKnow: "Bilmiyorum"
                    },
                    weekly: {
                        title: "HAFTADA AYIRILAN SÜRE",
                        question: "Haftada kaç gün spora gidiyorsun?",
                    },
                    daily: {
                        title: "GÜNLÜK AYIRILAN SÜRE",
                        mins15: "15",
                        mins30: "30",
                        mins45: "45",
                        mins60Plus: "60+"
                    },
                    save: "KAYDET"
                },
                settings: {
                    title: "AYARLAR",
                    privacy: "HESAP GİZLİLİĞİ",
                    contact: "BİZE ULAŞIN",
                    terms: "KULLANIM SÖZLEŞMESİ",
                    privacyPage: {
                        label: "Gizli Hesap",
                        description: "Profilini ve sıralamanı herkes görebilir"
                    },
                    termsContent: `RAVE GYM KULLANIM SÖZLEŞMESİ

1. GENEL HÜKÜMLER
Bu sözleşme, RAVE GYM üyelerinin uyması gereken kuralları ve sorumlulukları belirler. Her üye bu kuralları kabul etmiş sayılır.

2. SAĞLIK VE GÜVENLİK
- Üyeler, spor yapmaya engel bir sağlık sorunlarının bulunmadığını beyan eder.
- Antrenman sırasında oluşabilecek sağlık sorunlarından üyenin kendisi sorumludur.
- Antrenman esnasında havlu kullanımı zorunludur.
- Salon içerisinde temiz spor ayakkabısı ve uygun spor kıyafetleri giyilmesi zorunludur.

3. EKİPMAN KULLANIMI
- Kullanılan ağırlıklar ve ekipmanlar işlem bittikten sonra yerine bırakılmalıdır.
- Aletler özenle ve zarar vermeden kullanılmalıdır.
- Yoğun saatlerde diğer üyelerin kullanım hakkına saygı gösterilmelidir.

4. ÜYELİK HAKLARI
- Üyelik şahsa aittir, başkasına devredilemez veya kullandırılamaz.
- Salon yönetimi, kurallara uymayan üyelerin üyeliğini iptal etme hakkını saklı tutar.`
                },
                workouts: {
                    tab: "ANTRENMAN",
                    searchPlaceholder: "Ara",
                    categories: {
                        created: "Benim Oluşturduklarım",
                        trainer: "Ana Sayfa",
                        favorites: "Favorilerim",
                        recent: "En Son Yaptıklarım"
                    },
                    top10Title: "TOP 10 ANTRENMAN PROGRAMLARI",
                    suggestedTitle: "İLGİNİ ÇEKEBİLİR",
                    programCard: {
                        duration: "dk",
                        level: "Seviye",
                        kcal: "kcal"
                    },
                    subCategories: {
                        workout: "Antrenman",
                        program: "Programlar"
                    },
                    create: {
                        button: "Antrenman Oluştur",
                        title: "Yeni Antrenman",
                        name: "Antrenman İsmi",
                        description: "Açıklama",
                        level: "Seviye",
                        focus: "Odak Bölge",
                        goal: "Hedef",
                        category: "Kategori",
                        duration: "Süre (dk)",
                        save: "KAYDET"
                    },
                    favorites: {
                        getWorkouts: "Antrenmanlar",
                        getPrograms: "Programlar",
                        emptyWorkouts: "Rastgele antrenman bulmak için butona tıkla!",
                        emptyPrograms: "Rastgele program bulmak için butona tıkla!"
                    }
                },
                editProfile: {
                    header: "HESAP BİLGİLERİ",
                    save: "DEĞİŞİKLİKLERİ KAYDET",
                    name: "İSİM",
                    surname: "SOYİSİM",
                    memberProfile: "ÜYE PROFİLİ",
                    birthDate: "DOĞUM TARİHİ",
                    gender: {
                        label: "CİNSİYET",
                        male: "ERKEK",
                        female: "KADIN"
                    },
                    height: "BOY (CM)",
                    weight: "KİLO (KG)"
                },
                leaderboardScreen: {
                    title: "LİDERLİK TABLOSU",
                    rank: "SIRA",
                    member: "ÜYE",
                    points: "PUAN",
                    you: "SEN"
                },
                membership: {
                    title: "ÜYELİK BİLGİLERİM",
                    currentPackage: "MEVCUT PAKET",
                    memberId: "ÜYE NO",
                    status: "DURUM",
                    active: "AKTİF",
                    renew: "YENİLE / PAKET AL",
                    selectClubTitle: "KULÜP SEÇİMİ",
                    selectCity: "ŞEHİR SEÇİN",
                    selectClub: "KULÜP SEÇİN",
                    continue: "ONAYLA ve DEVAM ET",
                    plansTitle: "ÜYELİK TERCİHİ",
                    monthly: "AYLIK ÖDEME",
                    monthlyDesc: "Her Ay Aynı Fiyat (12 Ay)",
                    upfront: "PEŞİN ÖDEME",
                    upfrontDesc: "%20 İNDİRİM",
                    promoCode: "PROMOSYON KODU GİR",
                    apply: "UYGULA",
                    buy: "PAKETİ SEÇ",
                    packages: {
                        classic: { name: "CLASSIC", features: ["Sınırsız Giriş", "Temel Ekipmanlar", "Soyunma Odası"] },
                        gold: { name: "GOLD", features: ["Tüm Şubeler", "Grup Dersleri", "Misafir Hakkı"] },
                        platinum: { name: "PLATINUM", features: ["Özel Dolap", "Spa & Havuz", "Özel Eğitmen (2 Ders/Ay)"] }
                    },
                    form: {
                        personalInfo: "KİŞİSEL BİLGİLER",
                        identityNo: "TC KİMLİK NO",
                        notCitizen: "TC Vatandaşı Değilim",
                        birthDate: "DOĞUM TARİHİ",
                        under16: "16 yaş altı sınırı var",
                        gender: "CİNSİYET",
                        male: "Erkek",
                        female: "Kadın",
                        contactInfo: "İLETİŞİM BİLGİLERİ",
                        phone: "CEP TELEFONU",
                        email: "E-POSTA ADRESİ",
                        confirm: "ONAYLA"
                    },
                    addons: {
                        title: "EK HİZMETLERİ KEŞFET",
                        subtitle: "Deneyimini Özelleştir",
                        pt: {
                            title: "PERSONAL TRAINER",
                            desc: "Birebir Eğitmen Desteği (10 Ders)",
                            price: "5000 TL"
                        },
                        nutrition: {
                            title: "BESLENME DANIŞMANLIĞI",
                            desc: "Kişiye Özel Diyet Programı",
                            price: "1500 TL"
                        },
                        recovery: {
                            title: "RECOVERY PACK",
                            desc: "Spa, Masaj ve Havuz Erişimi",
                            price: "2000 TL"
                        },
                        locker: {
                            title: "ÖZEL DOLAP",
                            desc: "Size Özel Kilitli Dolap",
                            price: "500 TL/Ay"
                        },
                        continue: "ÖDEME EKRANINA GEÇ"
                    }
                },
                calendar: {
                    showWeekly: "Haftalık Göster",
                    dailySteps: "Günlük Adım",
                    calories: "Kalori"
                },
                camera: {
                    permissionMessage: 'Kamerayı kullanmak için izniniz gerekiyor.',
                    grantPermission: 'İzin Ver',
                    scannedTitle: 'Karakod Okundu',
                    scannedData: 'Veri',
                    scanTitle: 'KARAKOD TARA',
                    instruction: 'Kamerayı koda doğrultun',
                },
                ai: {
                    title: 'AI ASİSTAN',
                    welcome: 'Merhaba! Ben gelişmiş Yapay Zeka Asistanınım. Antrenman, beslenme veya aklına gelen herhangi bir konuda sana yardımcı olabilirim!',
                    placeholder: 'Bana her şeyi sorabilirsin...',
                }
            }
        }
    },

};

i18n
    .use(initReactI18next)
    .init({

        resources,
        lng: 'tr', // Default language
        fallbackLng: 'tr',
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
