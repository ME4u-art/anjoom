import { agency } from "@/config/agency";
import { IMG } from "@/lib/tours";

export type PriceRow = {
  label: string;
  sub?: string;
  quad: string;
  triple: string;
  double: string;
  /** Some programmes price a 5-share room too; omitted when they don't. */
  quint?: string;
};

export type OmraProgram = {
  slug: string;
  category: "omra" | "hajj"; // chooser on the OMRA page: عمرة or حج
  title: string;
  shortTitle: string;
  image: string;
  priceFrom: string;
  flightRoute: string;
  dates: string[];
  duration: string;
  flight: string;
  description: string[];
  tables: { name: string; tag: string; rows: PriceRow[] }[];
  includes: string[];
  notes: string[];
  gallery: string[];
};

// Every price, hotel and date below is transcribed from the agency's own
// flyers. Nothing here is invented — if a field is missing from a flyer it is
// left out rather than filled in.
// TODO: all five reuse the one bundled Medina photo. Ask the agency for
// programme images.

// The same four formulas run across autumn and early winter, so the includes
// list is shared rather than repeated five times.
const saudiaIncludes = [
  "تذكرة الطائرة ذهابا و إيابا",
  "الإقامة بالفنادق المحددة أعلاه",
  "التنقلات داخل المملكة العربية السعودية بحافلات مكيفة",
  "مزارات مكة و المدينة",
  "مرشد من الوكالة يؤطر كل المجموعة",
  "النقل من و إلى المطار من أمام الوكالة",
  "رسوم التأشيرة",
];

const qatarIncludes = [
  "تذكرة الطائرة ذهاب و إياب (الخطوط القطرية)",
  "الإقامة بالفنادق المحددة أعلاه",
  "التنقلات داخل المملكة العربية السعودية بحافلات مكيفة",
  "زيارات مكة و المدينة",
  "مرشد مدرب ذو خبرة يرافق كل المجموعة",
  "النقل من و إلى المطار من أمام الوكالة",
  "رسوم التأشيرة",
];

const autumnRows: PriceRow[] = [
  {
    label: "الإقتصادي",
    sub: "أبراج طابة (المدينة) — سما المقام، أمام فندق فلسطين (مكة)",
    double: "17 500",
    triple: "16 500",
    quad: "15 500",
  },
  {
    label: "المتوسط — الإفطار بمكة فقط",
    sub: "أبراج طابة (المدينة) — اعمار جراند، 650 متر (مكة)",
    double: "21 000",
    triple: "19 500",
    quad: "18 500",
  },
  {
    label: "الممتاز 1 — بالإفطار",
    sub: "مادن طيبة (المدينة) — أنجم (مكة)",
    double: "25 900",
    triple: "24 500",
    quad: "22 500",
  },
  {
    label: "الممتاز 2 — بالإفطار",
    sub: "مادن طيبة (المدينة) — سويس أوتيل (مكة)",
    double: "31 800",
    triple: "29 500",
    quad: "27 500",
  },
];

export const omraPrograms: OmraProgram[] = [
  {
    slug: "omra-septembre-octobre",
    category: "omra",
    title: "عمرة شتنبر و أكتوبر",
    shortTitle: "عمرة شتنبر و أكتوبر",
    image: IMG.hajj,
    priceFrom: "15 500 درهم",
    flightRoute: "رحلة على متن الخطوط الجوية العربية السعودية",
    dates: ["من 10 شتنبر إلى 24 شتنبر", "من 04 أكتوبر إلى 18 أكتوبر"],
    duration: "15 يومًا بين المدينة المنورة ومكة المكرمة",
    flight: "الخطوط الجوية العربية السعودية — ذهابا وإيابا",
    description: [
      `تقترح عليكم ${agency.identity.name} أداء مناسك العمرة في أجواء روحانية، بتأطير كامل من الوكالة من المطار إلى المطار.`,
      "أربع صيغ حسب مستوى الفنادق وقربها من الحرمين، من الصيغة الاقتصادية إلى الصيغة الممتازة.",
      "تاريخان للاختيار في شتنبر وأكتوبر، بنفس الفنادق ونفس الأثمنة.",
    ],
    tables: [{ name: "سعر الفرد في الغرفة", tag: "عمرة", rows: autumnRows }],
    includes: saudiaIncludes,
    notes: [],
    gallery: [],
  },
  {
    slug: "omra-novembre",
    category: "omra",
    title: "عمرة شهر نونبر",
    shortTitle: "عمرة نونبر",
    image: IMG.hajj,
    priceFrom: "15 500 درهم",
    flightRoute: "رحلة على متن الخطوط الجوية العربية السعودية",
    dates: ["من 01 نونبر إلى 15 نونبر"],
    duration: "15 يومًا بين المدينة المنورة ومكة المكرمة",
    flight: "الخطوط الجوية العربية السعودية — ذهابا وإيابا",
    description: [
      `عمرة شهر نونبر مع ${agency.identity.name}، في أجواء أقل ازدحامًا وطقس معتدل بالحرمين الشريفين.`,
      "نفس الصيغ الأربع: الإقتصادي، المتوسط، والممتاز بمستوييه، حسب الفندق المختار بمكة والمدينة.",
    ],
    tables: [{ name: "سعر الفرد في الغرفة", tag: "عمرة", rows: autumnRows }],
    includes: saudiaIncludes,
    notes: [],
    gallery: [],
  },
  {
    slug: "omra-janvier",
    category: "omra",
    title: "عمرة شهر يناير",
    shortTitle: "عمرة يناير",
    image: IMG.hajj,
    priceFrom: "16 500 درهم",
    flightRoute: "رحلة على متن الخطوط الجوية العربية السعودية",
    dates: ["من 11 يناير إلى 25 يناير"],
    duration: "15 يومًا بين المدينة المنورة ومكة المكرمة",
    flight: "الخطوط الجوية العربية السعودية — ذهابا وإيابا",
    description: [
      `عمرة شهر يناير مع ${agency.identity.name}، بثلاث صيغ حسب مستوى الإقامة بمكة المكرمة والمدينة المنورة.`,
      "الصيغة المتوسطة بدون إفطار، والصيغتان الممتازتان بالإفطار.",
    ],
    tables: [
      {
        name: "سعر الفرد في الغرفة",
        tag: "عمرة",
        rows: [
          {
            label: "المتوسط — بدون إفطار",
            sub: "أبراج طابة (المدينة) — سما المقام، أمام فندق فلسطين (مكة)",
            double: "18 900",
            triple: "17 800",
            quad: "16 500",
          },
          {
            label: "الممتاز 1 — بالإفطار",
            sub: "مادن طيبة (المدينة) — أنجم (مكة)",
            double: "26 500",
            triple: "25 400",
            quad: "24 000",
          },
          {
            label: "الممتاز 2 — بالإفطار",
            sub: "مادن طيبة (المدينة) — سويس أوتيل (مكة)",
            double: "32 800",
            triple: "29 800",
            quad: "27 800",
          },
        ],
      },
    ],
    includes: saudiaIncludes,
    notes: [],
    gallery: [],
  },
  {
    slug: "omra-chaabane-ramadan",
    category: "omra",
    title: "عمرة شعبان و رمضان",
    shortTitle: "شعبان و رمضان",
    image: IMG.hajj,
    priceFrom: "16 500 درهم",
    flightRoute: "رحلة على متن الخطوط الجوية القطرية",
    dates: ["من 27 يناير إلى 11 فبراير"],
    duration: "16 يومًا تجمع بين أواخر شعبان وأوائل رمضان",
    flight: "الخطوط الجوية القطرية — ذهابا وإيابا",
    description: [
      `عمرة تجمع بين شعبان وبداية رمضان مع ${agency.identity.name}، بمرافقة مرشد مدرب طيلة الرحلة.`,
      "صيغتان متوسطتان حسب الفندق بمكة المكرمة، مع الإقامة بمجموعة المدينة بالمدينة المنورة.",
      "تشمل الجداول الغرفة الخماسية إلى جانب الثنائية والثلاثية والرباعية.",
    ],
    tables: [
      {
        name: "سعر الفرد في الغرفة",
        tag: "عمرة",
        rows: [
          {
            label: "متوسط 1",
            sub: "مجموعة المدينة (المدينة) — اسكن التيسير، 850 متر (مكة)",
            double: "19 800",
            triple: "18 500",
            quad: "17 500",
            quint: "16 500",
          },
          {
            label: "متوسط 2",
            sub: "مجموعة المدينة (المدينة) — سما المقام، أمام فندق فلسطين (مكة)",
            double: "22 000",
            triple: "20 500",
            quad: "19 000",
            quint: "18 000",
          },
        ],
      },
    ],
    includes: qatarIncludes,
    notes: [],
    gallery: [],
  },
  {
    slug: "omra-ramadan",
    category: "omra",
    title: "عمرة رمضان",
    shortTitle: "عمرة رمضان",
    image: IMG.hajj,
    priceFrom: "25 900 درهم",
    flightRoute: "رحلة على متن الخطوط الجوية القطرية",
    dates: ["من 02 فبراير إلى 14 مارس", "من 04 فبراير إلى 16 مارس"],
    duration: "إقامة طويلة تغطي شهر رمضان بالحرمين الشريفين",
    flight: "الخطوط الجوية القطرية — ذهابا وإيابا",
    description: [
      `إقامة رمضانية كاملة مع ${agency.identity.name}، لمن يرغب في قضاء الشهر الفضيل بجوار الحرمين.`,
      "صيغتان حسب الفندق بمكة المكرمة، مع الإقامة بمجموعة المدينة بالمدينة المنورة.",
      "تاريخان للاختيار، والغرف من ثنائية إلى خماسية.",
    ],
    tables: [
      {
        name: "سعر الفرد في الغرفة",
        tag: "رمضان",
        rows: [
          {
            label: "متوسط 1",
            sub: "مجموعة المدينة (المدينة) — اسكن التيسير، 850 متر (مكة)",
            double: "37 900",
            triple: "31 900",
            quad: "27 900",
            quint: "25 900",
          },
          {
            label: "متوسط 2",
            sub: "مجموعة المدينة (المدينة) — سما المقام، أمام فندق فلسطين (مكة)",
            double: "42 500",
            triple: "34 500",
            quad: "30 900",
            quint: "29 900",
          },
        ],
      },
    ],
    includes: qatarIncludes,
    notes: [],
    gallery: [],
  },
];

export const agencyPhones = agency.contact.phones;

export const whatsappNumber = agency.contact.whatsapp;

export const agencyAddresses = [agency.contact.addresses.ar ?? agency.contact.addresses.fr];
