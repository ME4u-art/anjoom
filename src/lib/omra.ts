import { IMG, monoT, monoTList } from "@/lib/tours";
import { addressFor, agency } from "@/config/agency";
import { pick, pickList } from "@/i18n";
import { DEFAULT_LOCALE, isLocale } from "@/i18n/types";
import type { Locale, Localized, LocalizedList } from "@/i18n/types";

/**
 * OMRA / HAJJ PROGRAMMES.
 *
 * Every piece of prose here is per-language. The section was Arabic-only in
 * the template this grew out of, and on a trilingual site that produced pages
 * with French headings wrapped around Arabic content — and Arabic sitting in
 * an LTR paragraph, which throws its punctuation to the wrong end.
 *
 * Prices are digits only: the currency word comes from the dictionary in the
 * reader's own language (see money() in @/i18n).
 */

export type PriceRow = {
  /** Hotel name — transliterated for the Latin languages. */
  label: Localized;
  sub?: Localized;
  quad: string;
  triple: string;
  double: string;
  /** Some programmes price a 5-share room too; omitted when they don't. */
  quint?: string;
};

export type PriceTable = {
  name: Localized;
  tag: Localized;
  rows: PriceRow[];
};

export type OmraProgram = {
  slug: string;
  category: "omra" | "hajj"; // chooser on the OMRA page: عمرة or حج
  title: Localized;
  shortTitle: Localized;
  image: string;
  /** Digits only, e.g. "20.500" — never a currency word. */
  priceFrom: string;
  flightRoute: Localized;
  description: LocalizedList;
  tables: PriceTable[];
  includes: LocalizedList;
  gallery: string[];
  /** Optional: the page hides what the agency never supplied. */
  dates?: LocalizedList;
  duration?: Localized;
  flight?: Localized;
  notes?: LocalizedList;
};

/** The same programme with one language chosen — what the pages render. */
export type LocalizedProgram = {
  slug: string;
  category: "omra" | "hajj";
  title: string;
  shortTitle: string;
  image: string;
  priceFrom: string;
  flightRoute: string;
  dates: string[];
  duration: string;
  flight: string;
  description: string[];
  tables: { name: string; tag: string; rows: LocalizedRow[] }[];
  includes: string[];
  notes: string[];
  gallery: string[];
};

export type LocalizedRow = {
  label: string;
  sub?: string;
  quad: string;
  triple: string;
  double: string;
  quint?: string;
};

/**
 * Resolve a whole programme into one language up front, so the pages go on
 * rendering plain strings instead of calling pick() at thirty render sites.
 */
export function localizeProgram(p: OmraProgram, locale: Locale): LocalizedProgram {
  const s = (v: Localized | undefined) => (v ? pick(locale, v) : "");
  const l = (v: LocalizedList | undefined) => (v ? pickList(locale, v) : []);
  return {
    slug: p.slug,
    category: p.category,
    image: p.image,
    priceFrom: p.priceFrom,
    gallery: p.gallery,
    title: s(p.title),
    shortTitle: s(p.shortTitle),
    flightRoute: s(p.flightRoute),
    dates: l(p.dates),
    duration: s(p.duration),
    flight: s(p.flight),
    description: l(p.description),
    includes: l(p.includes),
    notes: l(p.notes),
    tables: p.tables.map((table) => ({
      name: s(table.name),
      tag: s(table.tag),
      rows: table.rows.map((r) => ({
        quad: r.quad,
        triple: r.triple,
        double: r.double,
        quint: r.quint,
        label: s(r.label),
        sub: r.sub ? s(r.sub) : undefined,
      })),
    })),
  };
}


/**
 * Same, for head() and other places outside React, where the language is a
 * raw route param rather than a checked Locale.
 */
export function localizeProgramFor(p: OmraProgram, lang: unknown): LocalizedProgram {
  return localizeProgram(p, isLocale(lang) ? lang : DEFAULT_LOCALE);
}

// Every price, hotel and date below is transcribed from the agency's own
// flyers. Nothing here is invented — if a field is missing from a flyer it is
// left out rather than filled in.
// TODO: all five reuse the one bundled Medina photo. Ask the agency for
// programme images.

// The same four formulas run across autumn and early winter, so the includes
// list is shared rather than repeated five times.
const saudiaIncludes = monoTList([
  "تذكرة الطائرة ذهابا و إيابا",
  "الإقامة بالفنادق المحددة أعلاه",
  "التنقلات داخل المملكة العربية السعودية بحافلات مكيفة",
  "مزارات مكة و المدينة",
  "مرشد من الوكالة يؤطر كل المجموعة",
  "النقل من و إلى المطار من أمام الوكالة",
  "رسوم التأشيرة",
]);

const qatarIncludes = monoTList([
  "تذكرة الطائرة ذهاب و إياب (الخطوط القطرية)",
  "الإقامة بالفنادق المحددة أعلاه",
  "التنقلات داخل المملكة العربية السعودية بحافلات مكيفة",
  "زيارات مكة و المدينة",
  "مرشد مدرب ذو خبرة يرافق كل المجموعة",
  "النقل من و إلى المطار من أمام الوكالة",
  "رسوم التأشيرة",
]);

const autumnRows: PriceRow[] = [
  {
    label: monoT("الإقتصادي"),
    sub: monoT("أبراج طابة (المدينة) — سما المقام، أمام فندق فلسطين (مكة)"),
    double: "17 500",
    triple: "16 500",
    quad: "15 500",
  },
  {
    label: monoT("المتوسط — الإفطار بمكة فقط"),
    sub: monoT("أبراج طابة (المدينة) — اعمار جراند، 650 متر (مكة)"),
    double: "21 000",
    triple: "19 500",
    quad: "18 500",
  },
  {
    label: monoT("الممتاز 1 — بالإفطار"),
    sub: monoT("مادن طيبة (المدينة) — أنجم (مكة)"),
    double: "25 900",
    triple: "24 500",
    quad: "22 500",
  },
  {
    label: monoT("الممتاز 2 — بالإفطار"),
    sub: monoT("مادن طيبة (المدينة) — سويس أوتيل (مكة)"),
    double: "31 800",
    triple: "29 500",
    quad: "27 500",
  },
];

export const omraPrograms: OmraProgram[] = [
  {
    slug: "omra-septembre-octobre",
    category: "omra",
    title: monoT("عمرة شتنبر و أكتوبر"),
    shortTitle: monoT("عمرة شتنبر و أكتوبر"),
    image: IMG.hajj,
    priceFrom: "15 500",
    flightRoute: monoT("رحلة على متن الخطوط الجوية العربية السعودية"),
    dates: monoTList(["من 10 شتنبر إلى 24 شتنبر", "من 04 أكتوبر إلى 18 أكتوبر"]),
    duration: monoT("15 يومًا بين المدينة المنورة ومكة المكرمة"),
    flight: monoT("الخطوط الجوية العربية السعودية — ذهابا وإيابا"),
    description: monoTList([
      `تقترح عليكم ${agency.identity.name} أداء مناسك العمرة في أجواء روحانية، بتأطير كامل من الوكالة من المطار إلى المطار.`,
      "أربع صيغ حسب مستوى الفنادق وقربها من الحرمين، من الصيغة الاقتصادية إلى الصيغة الممتازة.",
      "تاريخان للاختيار في شتنبر وأكتوبر، بنفس الفنادق ونفس الأثمنة.",
    ]),
    tables: [{ name: monoT("سعر الفرد في الغرفة"), tag: monoT("عمرة"), rows: autumnRows }],
    includes: saudiaIncludes,
    notes: monoTList([]),
    gallery: [],
  },
  {
    slug: "omra-novembre",
    category: "omra",
    title: monoT("عمرة شهر نونبر"),
    shortTitle: monoT("عمرة نونبر"),
    image: IMG.hajj,
    priceFrom: "15 500",
    flightRoute: monoT("رحلة على متن الخطوط الجوية العربية السعودية"),
    dates: monoTList(["من 01 نونبر إلى 15 نونبر"]),
    duration: monoT("15 يومًا بين المدينة المنورة ومكة المكرمة"),
    flight: monoT("الخطوط الجوية العربية السعودية — ذهابا وإيابا"),
    description: monoTList([
      `عمرة شهر نونبر مع ${agency.identity.name}، في أجواء أقل ازدحامًا وطقس معتدل بالحرمين الشريفين.`,
      "نفس الصيغ الأربع: الإقتصادي، المتوسط، والممتاز بمستوييه، حسب الفندق المختار بمكة والمدينة.",
    ]),
    tables: [{ name: monoT("سعر الفرد في الغرفة"), tag: monoT("عمرة"), rows: autumnRows }],
    includes: saudiaIncludes,
    notes: monoTList([]),
    gallery: [],
  },
  {
    slug: "omra-janvier",
    category: "omra",
    title: monoT("عمرة شهر يناير"),
    shortTitle: monoT("عمرة يناير"),
    image: IMG.hajj,
    priceFrom: "16 500",
    flightRoute: monoT("رحلة على متن الخطوط الجوية العربية السعودية"),
    dates: monoTList(["من 11 يناير إلى 25 يناير"]),
    duration: monoT("15 يومًا بين المدينة المنورة ومكة المكرمة"),
    flight: monoT("الخطوط الجوية العربية السعودية — ذهابا وإيابا"),
    description: monoTList([
      `عمرة شهر يناير مع ${agency.identity.name}، بثلاث صيغ حسب مستوى الإقامة بمكة المكرمة والمدينة المنورة.`,
      "الصيغة المتوسطة بدون إفطار، والصيغتان الممتازتان بالإفطار.",
    ]),
    tables: [
      {
        name: monoT("سعر الفرد في الغرفة"),
        tag: monoT("عمرة"),
        rows: [
          {
            label: monoT("المتوسط — بدون إفطار"),
            sub: monoT("أبراج طابة (المدينة) — سما المقام، أمام فندق فلسطين (مكة)"),
            double: "18 900",
            triple: "17 800",
            quad: "16 500",
          },
          {
            label: monoT("الممتاز 1 — بالإفطار"),
            sub: monoT("مادن طيبة (المدينة) — أنجم (مكة)"),
            double: "26 500",
            triple: "25 400",
            quad: "24 000",
          },
          {
            label: monoT("الممتاز 2 — بالإفطار"),
            sub: monoT("مادن طيبة (المدينة) — سويس أوتيل (مكة)"),
            double: "32 800",
            triple: "29 800",
            quad: "27 800",
          },
        ],
      },
    ],
    includes: saudiaIncludes,
    notes: monoTList([]),
    gallery: [],
  },
  {
    slug: "omra-chaabane-ramadan",
    category: "omra",
    title: monoT("عمرة شعبان و رمضان"),
    shortTitle: monoT("شعبان و رمضان"),
    image: IMG.hajj,
    priceFrom: "16 500",
    flightRoute: monoT("رحلة على متن الخطوط الجوية القطرية"),
    dates: monoTList(["من 27 يناير إلى 11 فبراير"]),
    duration: monoT("16 يومًا تجمع بين أواخر شعبان وأوائل رمضان"),
    flight: monoT("الخطوط الجوية القطرية — ذهابا وإيابا"),
    description: monoTList([
      `عمرة تجمع بين شعبان وبداية رمضان مع ${agency.identity.name}، بمرافقة مرشد مدرب طيلة الرحلة.`,
      "صيغتان متوسطتان حسب الفندق بمكة المكرمة، مع الإقامة بمجموعة المدينة بالمدينة المنورة.",
      "تشمل الجداول الغرفة الخماسية إلى جانب الثنائية والثلاثية والرباعية.",
    ]),
    tables: [
      {
        name: monoT("سعر الفرد في الغرفة"),
        tag: monoT("عمرة"),
        rows: [
          {
            label: monoT("متوسط 1"),
            sub: monoT("مجموعة المدينة (المدينة) — اسكن التيسير، 850 متر (مكة)"),
            double: "19 800",
            triple: "18 500",
            quad: "17 500",
            quint: "16 500",
          },
          {
            label: monoT("متوسط 2"),
            sub: monoT("مجموعة المدينة (المدينة) — سما المقام، أمام فندق فلسطين (مكة)"),
            double: "22 000",
            triple: "20 500",
            quad: "19 000",
            quint: "18 000",
          },
        ],
      },
    ],
    includes: qatarIncludes,
    notes: monoTList([]),
    gallery: [],
  },
  {
    slug: "omra-ramadan",
    category: "omra",
    title: monoT("عمرة رمضان"),
    shortTitle: monoT("عمرة رمضان"),
    image: IMG.hajj,
    priceFrom: "25 900",
    flightRoute: monoT("رحلة على متن الخطوط الجوية القطرية"),
    dates: monoTList(["من 02 فبراير إلى 14 مارس", "من 04 فبراير إلى 16 مارس"]),
    duration: monoT("إقامة طويلة تغطي شهر رمضان بالحرمين الشريفين"),
    flight: monoT("الخطوط الجوية القطرية — ذهابا وإيابا"),
    description: monoTList([
      `إقامة رمضانية كاملة مع ${agency.identity.name}، لمن يرغب في قضاء الشهر الفضيل بجوار الحرمين.`,
      "صيغتان حسب الفندق بمكة المكرمة، مع الإقامة بمجموعة المدينة بالمدينة المنورة.",
      "تاريخان للاختيار، والغرف من ثنائية إلى خماسية.",
    ]),
    tables: [
      {
        name: monoT("سعر الفرد في الغرفة"),
        tag: monoT("رمضان"),
        rows: [
          {
            label: monoT("متوسط 1"),
            sub: monoT("مجموعة المدينة (المدينة) — اسكن التيسير، 850 متر (مكة)"),
            double: "37 900",
            triple: "31 900",
            quad: "27 900",
            quint: "25 900",
          },
          {
            label: monoT("متوسط 2"),
            sub: monoT("مجموعة المدينة (المدينة) — سما المقام، أمام فندق فلسطين (مكة)"),
            double: "42 500",
            triple: "34 500",
            quad: "30 900",
            quint: "29 900",
          },
        ],
      },
    ],
    includes: qatarIncludes,
    notes: monoTList([]),
    gallery: [],
  },
];

export const agencyPhones = agency.contact.phones;

export const whatsappNumber = agency.contact.whatsapp;

export const agencyAddresses = (locale: Locale) => [addressFor(locale)];
