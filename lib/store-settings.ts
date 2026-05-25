import type { ApiSettings } from "@/lib/api";
import type { Lang } from "@/lib/i18n";

export interface HeroSlideSettings {
  id:       string;
  title:    string;
  subtitle: string;
  cta:      string;
  href:     string;
  bg:       string;
}

export interface ShippingCity {
  id:    string;
  label: { ar: string; en: string };
}

export interface ShippingOption {
  id:     string;
  label:  { ar: string; en: string };
  cities: ShippingCity[];
}

export const SHIPPING_ZONE_FEES: Record<"A" | "B" | "C", number> = {
  A: 70,
  B: 85,
  C: 110,
};

const SHIPPING_ZONE_BY_GOVERNORATE: Record<string, "A" | "B" | "C"> = {
  "القاهرة": "A",
  "الجيزة": "A",
  "الإسكندرية": "B",
  "القليوبية": "B",
  "الشرقية": "B",
  "المنوفية": "B",
  "الغربية": "B",
  "البحيرة": "B",
  "كفر الشيخ": "B",
  "الدقهلية": "B",
  "دمياط": "B",
  "بورسعيد": "B",
  "الإسماعيلية": "B",
  "السويس": "B",
  "مطروح": "C",
  "الفيوم": "C",
  "بني سويف": "C",
  "المنيا": "C",
  "اسيوط": "C",
  "سوهاج": "C",
  "قنا": "C",
  "الأقصر": "C",
  "اسوان": "C",
  "البحر الأحمر": "C",
  "الوادي الجديد": "C",
  "شمال سيناء": "C",
  "جنوب سيناء": "C",
};

export const EGYPT_GOVERNORATES: Array<{ id: string; label: { ar: string; en: string } }> = [
  { id: "القاهرة", label: { ar: "القاهرة", en: "Cairo" } },
  { id: "الجيزة", label: { ar: "الجيزة", en: "Giza" } },
  { id: "الإسكندرية", label: { ar: "الإسكندرية", en: "Alexandria" } },
  { id: "الدقهلية", label: { ar: "الدقهلية", en: "Dakahlia" } },
  { id: "البحر الأحمر", label: { ar: "البحر الأحمر", en: "Red Sea" } },
  { id: "البحيرة", label: { ar: "البحيرة", en: "Beheira" } },
  { id: "الفيوم", label: { ar: "الفيوم", en: "Faiyum" } },
  { id: "الغربية", label: { ar: "الغربية", en: "Gharbia" } },
  { id: "الإسماعيلية", label: { ar: "الإسماعيلية", en: "Ismailia" } },
  { id: "المنوفية", label: { ar: "المنوفية", en: "Monufia" } },
  { id: "المنيا", label: { ar: "المنيا", en: "Minya" } },
  { id: "القليوبية", label: { ar: "القليوبية", en: "Qalyubia" } },
  { id: "الوادي الجديد", label: { ar: "الوادي الجديد", en: "New Valley" } },
  { id: "السويس", label: { ar: "السويس", en: "Suez" } },
  { id: "اسوان", label: { ar: "أسوان", en: "Aswan" } },
  { id: "اسيوط", label: { ar: "أسيوط", en: "Assiut" } },
  { id: "بني سويف", label: { ar: "بني سويف", en: "Beni Suef" } },
  { id: "بورسعيد", label: { ar: "بورسعيد", en: "Port Said" } },
  { id: "دمياط", label: { ar: "دمياط", en: "Damietta" } },
  { id: "الشرقية", label: { ar: "الشرقية", en: "Sharqia" } },
  { id: "جنوب سيناء", label: { ar: "جنوب سيناء", en: "South Sinai" } },
  { id: "كفر الشيخ", label: { ar: "كفر الشيخ", en: "Kafr El Sheikh" } },
  { id: "مطروح", label: { ar: "مطروح", en: "Matrouh" } },
  { id: "الأقصر", label: { ar: "الأقصر", en: "Luxor" } },
  { id: "قنا", label: { ar: "قنا", en: "Qena" } },
  { id: "شمال سيناء", label: { ar: "شمال سيناء", en: "North Sinai" } },
  { id: "سوهاج", label: { ar: "سوهاج", en: "Sohag" } },
];

export function getShippingZone(governorate: string): "A" | "B" | "C" | null {
  return SHIPPING_ZONE_BY_GOVERNORATE[governorate.trim()] ?? null;
}

export function getShippingFeeForGovernorate(governorate: string): number {
  const zone = getShippingZone(governorate);
  return zone ? SHIPPING_ZONE_FEES[zone] : 0;
}

export function buildGovernorateFallbackOptions(): ShippingOption[] {
  return EGYPT_GOVERNORATES.map((gov) => ({
    id: gov.id,
    label: gov.label,
    cities: [{ id: `${gov.id}-default`, label: gov.label }],
  }));
}

export interface ParsedStoreSettings {
  storeName:      string;
  storeTagline?:  string;
  whatsapp:       string;
  announcement?:  string;
  shippingPolicy?: string;
  returnsPolicy?: string;
  privacyPolicy?: string;
  terms?:          string;
  heroSlides?:    HeroSlideSettings[];
  shippingOptions?: ShippingOption[];
}

function pick(raw: ApiSettings, ...keys: string[]): string {
  for (const key of keys) {
    const v = raw[key];
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return "";
}

function pickHeroValue(raw: ApiSettings, lang: Lang, keyBase: string, index: number): string {
  return pick(
    raw,
    `${keyBase}_${index}_${lang}`,
    `${keyBase}_${index}`,
    `${keyBase}${index}_${lang}`,
    `${keyBase}${index}`,
    `${keyBase}_${lang}`,
    `${keyBase}`
  );
}

function parseHeroSlides(raw: ApiSettings, lang: Lang): HeroSlideSettings[] {
  const slides: HeroSlideSettings[] = [];

  for (let i = 1; i <= 5; i += 1) {
    const title = pickHeroValue(raw, lang, "hero_title", i) || pickHeroValue(raw, lang, "slide_title", i);
    const subtitle = pickHeroValue(raw, lang, "hero_subtitle", i) || pickHeroValue(raw, lang, "slide_subtitle", i);
    const cta = pickHeroValue(raw, lang, "hero_cta", i) || pickHeroValue(raw, lang, "slide_cta", i) || pickHeroValue(raw, lang, "button_text", i);
    const href = pickHeroValue(raw, lang, "hero_url", i) || pickHeroValue(raw, lang, "hero_href", i) || pickHeroValue(raw, lang, "slide_url", i) || pickHeroValue(raw, lang, "button_url", i);
    const bg = pickHeroValue(raw, lang, "hero_image", i) || pickHeroValue(raw, lang, "slide_image", i) || pickHeroValue(raw, lang, "hero_bg", i);

    if (title && subtitle && bg) {
      slides.push({
        id:    `hero-${i}`,
        title,
        subtitle,
        cta:   cta || (lang === "ar" ? "تسوقي الآن" : "Shop now"),
        href:  href || "/",
        bg,
      });
    }
  }

  return slides;
}

export function parseStoreSettings(
  raw: ApiSettings,
  lang: Lang
): ParsedStoreSettings {
  const storeName =
    (lang === "ar"
      ? pick(raw, "store_name_ar", "name_ar")
      : pick(raw, "store_name_en", "name_en")) ||
    pick(raw, "store_name", "STORE_NAME", "storeName") ||
    (lang === "ar" ? "متجر" : "Store");

  const whatsapp =
    pick(raw, "whatsapp", "WHATSAPP", "store_whatsapp", "phone") ||
    "201000000000";

  return {
    storeName,
    storeTagline: pick(
      raw,
      lang === "ar"
        ? "store_tagline_ar"
        : "store_tagline_en",
      "store_tagline",
      "tagline",
      "STORE_TAGLINE"
    ),
    whatsapp:     whatsapp.replace(/\D/g, "").length > 0 ? whatsapp : "201000000000",
    announcement: lang === "ar"
      ? pick(raw, "announcement_ar", "announcement", "announcement_bar", "banner_text")
      : pick(raw, "announcement_en", "announcement", "announcement_bar", "banner_text"),
    shippingPolicy: pick(raw, "shipping_policy", "shipping", "policy_shipping", "SHIPPING_POLICY"),
    returnsPolicy:  pick(raw, "returns_policy", "return_policy", "exchange_policy", "refund_policy", "RETURNS_POLICY"),
    privacyPolicy:  pick(raw, "privacy_policy", "privacy", "PRIVACY_POLICY"),
    terms:          pick(raw, "terms", "terms_conditions", "terms_and_conditions", "TERMS"),
    heroSlides:    parseHeroSlides(raw, lang),
    shippingOptions: parseShippingOptions(raw, lang),
  };
}

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function parseNumber(value: unknown): number {
  if (typeof value === "number") return value;
  const text = asString(value);
  const parsed = Number(text.replace(/[^0-9.\-]+/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeLabel(value: string): { ar: string; en: string } {
  const normalized = value.trim();
  return { ar: normalized, en: normalized };
}

function normalizeId(value: string): string {
  return value.trim();
}

function parseShippingJson(raw: string): unknown {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function parseShippingRows(raw: string): ShippingOption[] {
  const lines = raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (!lines.length) return [];

  const splitRow = (line: string) =>
    line.includes("|")
      ? line.split("|").map((part) => part.trim())
      : line.split(",").map((part) => part.trim());

  const headerCells = splitRow(lines[0]).map((cell) =>
    cell.toLowerCase().replace(/\s+/g, "_")
  );
  const isHeader = headerCells.some((cell) =>
    ["governorate", "city", "zone", "region", "status", "shipping_fee", "cod_fee"].includes(cell)
  );

  const zones = new Map<string, ShippingOption>();

  for (const [index, line] of lines.entries()) {
    const parts = splitRow(line);
    if (index === 0 && isHeader) continue;

    const row: Record<string, string> = {
      governorate: parts[0] || "",
      city: parts[1] || "",
      status: parts[5] || "",
    };

    if (isHeader) {
      const rowMap: Record<string, string> = {};
      headerCells.forEach((cell, idx) => {
        rowMap[cell] = parts[idx] || "";
      });

      row.governorate = rowMap.governorate || rowMap.zone || rowMap.region || row.governorate;
      row.city = rowMap.city || rowMap.city_name || rowMap.name || row.city;
      row.status = rowMap.status || rowMap.active || row.status;
    }

    const status = row.status.trim().toLowerCase();
    if (status === "inactive") continue;

    const zoneLabel = row.governorate || parts[0] || "";
    const cityLabel = row.city || parts[1] || "";
    if (!zoneLabel || !cityLabel) continue;

    const zoneId = normalizeId(zoneLabel);
    const cityId = normalizeId(cityLabel);

    const existing = zones.get(zoneId);
    const option: ShippingOption = existing || {
      id: zoneId,
      label: normalizeLabel(zoneLabel),
      cities: [],
    };

    if (!option.cities.some((city) => city.id === cityId)) {
      option.cities.push({
        id: cityId,
        label: normalizeLabel(cityLabel),
      });
    }

    zones.set(zoneId, option);
  }

  return Array.from(zones.values());
}

function parseShippingRowsFromObjects(rows: Record<string, unknown>[]): ShippingOption[] {
  const zones = new Map<string, ShippingOption>();

  for (const rawRow of rows) {
    const status = asString(rawRow.status || rawRow.active || rawRow.state).trim().toLowerCase();
    if (status === "inactive") continue;

    const zoneLabel = asString(rawRow.governorate || rawRow.governorate_name || rawRow.zone || rawRow.region || rawRow.state || rawRow.province);
    const cityLabel = asString(rawRow.city || rawRow.city_name || rawRow.name || rawRow.area);
    if (!zoneLabel || !cityLabel) continue;

    const zoneId = normalizeId(asString(rawRow.governorate_id || rawRow.zone_id || rawRow.region_id) || zoneLabel);
    const cityId = normalizeId(asString(rawRow.city_id || rawRow.area_id) || cityLabel);

    const existing = zones.get(zoneId);
    const option: ShippingOption = existing || {
      id: zoneId,
      label: normalizeLabel(zoneLabel),
      cities: [],
    };

    if (!option.cities.some((city) => city.id === cityId)) {
      option.cities.push({
        id: cityId,
        label: normalizeLabel(cityLabel),
      });
    }

    zones.set(zoneId, option);
  }

  return Array.from(zones.values());
}

function parseShippingObject(rawValue: Record<string, unknown>): ShippingOption | null {
  const status = asString(rawValue.status || rawValue.active || rawValue.state).trim().toLowerCase();
  if (status === "inactive") return null;

  const id = asString(rawValue.id || rawValue.zone || rawValue.region || rawValue.governorate);
  const label = normalizeLabel(asString(rawValue.label || rawValue.name || rawValue.zone || rawValue.region || rawValue.governorate));
  const citiesRaw = rawValue.cities;
  if (!id || !label.ar || !Array.isArray(citiesRaw)) return null;

  const cities = citiesRaw
    .map((cityItem: unknown) => {
      if (!cityItem || typeof cityItem !== "object") return null;
      const cityObj = cityItem as Record<string, unknown>;
      const cityStatus = asString(cityObj.status || cityObj.active || cityObj.state).trim().toLowerCase();
      if (cityStatus === "inactive") return null;

      const cityId = asString(cityObj.id || cityObj.city || cityObj.name);
      const cityLabel = normalizeLabel(asString(cityObj.label || cityObj.name || cityObj.city));
      if (!cityId || !cityLabel.ar) return null;
      return { id: cityId, label: cityLabel };
    })
    .filter((city): city is ShippingCity => city !== null);

  return cities.length > 0 ? { id, label, cities } : null;
}

function parseShippingObjectMap(rawValue: Record<string, unknown>): ShippingOption[] {
  const options: ShippingOption[] = [];
  for (const [key, value] of Object.entries(rawValue)) {
    if (!value || typeof value !== "object" || Array.isArray(value)) continue;
    const option = parseShippingObject(value as Record<string, unknown>);
    if (option) {
      options.push(option);
      continue;
    }

    const rowLikeOptions = parseShippingRowsFromObjects([value as Record<string, unknown>]);
    if (rowLikeOptions.length > 0) {
      options.push(...rowLikeOptions);
      continue;
    }

    const zoneLabel = asString((value as Record<string, unknown>).zone || key || (value as Record<string, unknown>).governorate || (value as Record<string, unknown>).region || "");
    const cityEntries = Array.isArray((value as Record<string, unknown>).cities)
      ? (value as Record<string, unknown>).cities
      : (typeof value === "object" ? Object.keys(value) : []);
    if (!zoneLabel || !Array.isArray(cityEntries) || cityEntries.length === 0) continue;

    const zoneId = normalizeId(zoneLabel);
    const normalizedZoneLabel = normalizeLabel(zoneLabel);
    const cities = cityEntries
      .map((cityItem: unknown) => {
        if (typeof cityItem === "string") {
          const cityId = normalizeId(cityItem);
          const cityLabel = normalizeLabel(cityItem.trim());
          return cityId && cityLabel.ar ? { id: cityId, label: cityLabel } : null;
        }
        if (!cityItem || typeof cityItem !== "object") return null;
        const cityObj = cityItem as Record<string, unknown>;
        const cityId = asString(cityObj.id || cityObj.city || cityObj.name);
        const cityLabel = normalizeLabel(asString(cityObj.label || cityObj.name || cityObj.city));
        return cityId && cityLabel.ar ? { id: cityId, label: cityLabel } : null;
      })
      .filter((city): city is ShippingCity => city !== null);

    if (cities.length > 0) {
      options.push({ id: zoneId, label: normalizedZoneLabel, cities });
    }
  }
  return options;
}

export function parseShippingOptionsFromSource(raw: unknown): ShippingOption[] {
  if (!raw) return [];

  if (Array.isArray(raw)) {
    const rowLike = raw.every(
      (item) => item && typeof item === "object" && !Array.isArray(item) && !("cities" in item)
    );
    if (rowLike) return parseShippingRowsFromObjects(raw as Record<string, unknown>[]);

    const options = raw
      .map((item) => item && typeof item === "object" ? parseShippingObject(item as Record<string, unknown>) : null)
      .filter((option): option is ShippingOption => option !== null);
    return options;
  }

  if (typeof raw === "object") {
    const objectOptions = parseShippingObjectMap(raw as Record<string, unknown>);
    if (objectOptions.length > 0) return objectOptions;

    const obj = raw as Record<string, unknown>;
    for (const key of ["shipping_rates", "shippingRates", "rates", "data", "locations", "shipping_options"]) {
      const nested = obj[key];
      const nestedOptions = parseShippingOptionsFromSource(nested);
      if (nestedOptions.length > 0) return nestedOptions;
    }
  }

  const value = asString(raw);
  if (!value) return [];

  const json = parseShippingJson(value);
  const jsonOptions = parseShippingOptionsFromSource(json);
  if (jsonOptions.length > 0) return jsonOptions;

  return parseShippingRows(value);
}

function parseShippingOptions(raw: ApiSettings, lang: Lang): ShippingOption[] {
  const keys = [
    "shipping_options",
    "shipping_option",
    "shipping_data",
    "shipping_table",
    "shipping_map",
    "shipping_zones",
    "shipping_rates",
    "shipping_rate",
    "Shipping_Rates",
    "shipping",
  ];

  for (const key of keys) {
    const rawValue = raw[key];
    if (!rawValue) continue;

    if (typeof rawValue === "object" && !Array.isArray(rawValue)) {
      const objectOptions = parseShippingObjectMap(rawValue as Record<string, unknown>);
      if (objectOptions.length > 0) return objectOptions;
    }

    if (Array.isArray(rawValue) && rawValue.length > 0) {
      const rowLike = rawValue.every(
        (item) => item && typeof item === "object" && !Array.isArray(item) && !("cities" in item)
      );
      if (rowLike) {
        const options = parseShippingRowsFromObjects(rawValue as Record<string, unknown>[]);
        if (options.length > 0) return options;
      }

      const options: ShippingOption[] = [];
      for (const item of rawValue) {
        if (!item || typeof item !== "object") continue;
        const obj = item as Record<string, unknown>;
        const id = asString(obj.id || obj.zone || obj.region || obj.governorate);
        const label = normalizeLabel(asString(obj.label || obj.name || obj.zone || obj.region || obj.governorate));
        const citiesRaw = obj.cities;
        if (!id || !label.ar || !Array.isArray(citiesRaw)) continue;

        const statusValue = asString(obj.status || obj.active || obj.state);
        if (statusValue.toLowerCase() === "inactive") continue;

        const cities = citiesRaw
          .map((cityItem: unknown) => {
            if (!cityItem || typeof cityItem !== "object") return null;
            const cityObj = cityItem as Record<string, unknown>;
            const cityStatus = asString(cityObj.status || cityObj.active || cityObj.state);
            if (cityStatus.toLowerCase() === "inactive") return null;

            const cityId = asString(cityObj.id || cityObj.city || cityObj.name);
            const cityLabel = normalizeLabel(asString(cityObj.label || cityObj.name || cityObj.city));
            if (!cityId || !cityLabel.ar) return null;
            return { id: cityId, label: cityLabel };
          })
          .filter((city): city is ShippingCity => city !== null);

        if (cities.length > 0) {
          options.push({ id, label, cities });
        }
      }
      if (options.length > 0) return options;
    }

    const value = asString(rawValue);
    if (!value) continue;

    const json = parseShippingJson(value);
    if (Array.isArray(json) && json.length > 0) {
      const options: ShippingOption[] = [];
      for (const item of json) {
        if (item && typeof item === "object") {
          const obj = item as Record<string, unknown>;
          const id = asString(obj.id || obj.zone || obj.region || obj.governorate);
          const label = normalizeLabel(asString(obj.label || obj.name || obj.zone || obj.region || obj.governorate));
          const citiesRaw = obj.cities;
          if (!id || !label.ar || !Array.isArray(citiesRaw)) continue;

          const statusValue = asString(obj.status || obj.active || obj.state);
          if (statusValue.toLowerCase() === "inactive") continue;

          const cities = citiesRaw
            .map((cityItem: unknown) => {
              if (!cityItem || typeof cityItem !== "object") return null;
              const cityObj = cityItem as Record<string, unknown>;
              const cityStatus = asString(cityObj.status || cityObj.active || cityObj.state);
              if (cityStatus.toLowerCase() === "inactive") return null;

              const cityId = asString(cityObj.id || cityObj.city || cityObj.name);
              const cityLabel = normalizeLabel(asString(cityObj.label || cityObj.name || cityObj.city));
              if (!cityId || !cityLabel.ar) return null;
              return { id: cityId, label: cityLabel };
            })
            .filter((city): city is ShippingCity => city !== null);

          if (cities.length > 0) {
            options.push({ id, label, cities });
          }
        }
      }
      if (options.length > 0) return options;
    }

    const rows = parseShippingRows(value);
    if (rows.length > 0) return rows;
  }

  return [];
}
