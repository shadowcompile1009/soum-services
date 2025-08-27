export interface SortableObject {
  value: string;
  count?: number;
}

const conditionRankings: {
  english: { [key: string]: number };
  arabic: { [key: string]: number };
} = {
  english: {
    "Like New": 1,
    "Lightly Used": 2,
    "Noticeably Used": 3,
    "Extensively Used": 4,
  },
  arabic: {
    "أخو الجديد": 1,
    "اخو الجدىد": 1,
    "استخدام نظيف": 2,
    "استخدام نظىف": 2,
    "استخدام خفيف": 2,
    "استخدام ملحوظ": 3,
    "مستخدم بشدة": 4,
  },
};

export function sortArrayByValue(
  arr: SortableObject[],
  sortByCount: boolean = false
): SortableObject[] {
  const sorted = arr.sort((a, b) => {
    if (sortByCount && a.count !== undefined && b.count !== undefined) {
      return b.count - a.count;
    }

    const aValue = normalizeArabicText(a.value);
    const bValue = normalizeArabicText(b.value);

    const aRank = getConditionRank(aValue);
    const bRank = getConditionRank(bValue);

    if (aRank !== bRank) {
      return aRank - bRank;
    }

    const connectivityOrder: any = { "5G": 5, "4G": 4, "3G": 3, "2G": 2 };
    if (aValue in connectivityOrder && bValue in connectivityOrder) {
      return connectivityOrder[bValue] - connectivityOrder[aValue];
    }

    if (!isNaN(Number(aValue)) && !isNaN(Number(bValue))) {
      return Number(bValue) - Number(aValue);
    }

    const batteryRangeA = parseBatteryRange(aValue);
    const batteryRangeB = parseBatteryRange(bValue);
    if (batteryRangeA !== null && batteryRangeB !== null) {
      return batteryRangeB - batteryRangeA;
    }

    const capacityA = parseCapacity(aValue);
    const capacityB = parseCapacity(bValue);
    if (capacityA !== null && capacityB !== null) {
      return capacityB - capacityA;
    }

    const sizeA = parseSize(aValue);
    const sizeB = parseSize(bValue);
    if (sizeA !== null && sizeB !== null) {
      return sizeB - sizeA;
    }

    const resolutionA = parseResolution(aValue);
    const resolutionB = parseResolution(bValue);
    if (resolutionA !== null && resolutionB !== null) {
      return resolutionB - resolutionA;
    }

    const fpsA = parseFps(aValue);
    const fpsB = parseFps(bValue);
    if (fpsA !== null && fpsB !== null) {
      return fpsB - fpsA;
    }

    const comparisonResult = compareGenAndYear(aValue, bValue);
    if (comparisonResult !== 0) {
      return comparisonResult;
    }

    const [aText, aNum] = splitTextAndNumber(aValue);
    const [bText, bNum] = splitTextAndNumber(bValue);

    if (aText !== bText) {
      return aText.localeCompare(bText);
    }
    if (aNum !== null && bNum !== null) {
      return aNum - bNum;
    }

    return aValue.localeCompare(bValue);
  });
  return sorted;
}

function getConditionRank(value: string): number {
  const normalized = normalizeArabicText(value);
  return (
    conditionRankings.english[normalized] ??
    conditionRankings.arabic[normalized] ??
    Infinity
  );
}

function parseSize(value: string): number | null {
  const sizeMatch = value.match(/(\d+)\s*mm/i);
  return sizeMatch ? parseInt(sizeMatch[1], 10) : null;
}

function parseFps(value: string): number | null {
  const match = value.match(/(\d+(\.\d+)?)\s*fps/i);
  return match ? parseFloat(match[1]) : null;
}

function splitTextAndNumber(value: string): [string, number | null] {
  const match = value.match(/^([^\d]*)(\d*)/);
  const textPart = match ? match[1] : value;
  const numPart = match && match[2] ? parseInt(match[2], 10) : null;
  return [textPart, numPart];
}

const generationMap = {
  الاول: 1,
  الثانى: 2,
  الثالث: 3,
  الرابع: 4,
  الخامس: 5,
  السادس: 6,
  السابع: 7,
  الثامن: 8,
  التاسع: 9,
  العاشر: 10,
  "الحادى عشر": 11,
};

export const normalizeArabicText = (text: string) => {
  return text
    .replace(/\u0623|\u0625|\u0622/g, "\u0627")
    .replace(/\u0629/g, "\u0647")
    .replace(/\u064A/g, "\u0649")
    .replace(/\s+/g, " ")
    .trim();
};

function compareGenAndYear(aValue: string, bValue: string): number {
  const getGeneration = (value: string): number => {
    for (const [arabicGen, genNumber] of Object.entries(generationMap)) {
      if (
        value.includes("الجيل الثالث عشر") ||
        value.includes("الجىل الثالث عشر")
      ) {
        return 13;
      }
      if (
        value.includes("الجيل الثاني عشر") ||
        value.includes("الجىل الثانى عشر")
      ) {
        return 12;
      }
      if (value.includes(arabicGen)) {
        return genNumber;
      }
    }

    const englishGenMatch = value.match(/(\d+)(?:st|nd|rd|th)/i);
    return englishGenMatch ? parseInt(englishGenMatch[1], 10) : 0;
  };

  const getYear = (value: string): number => {
    const yearMatch = value.match(/\((\d{4})\)/);
    return yearMatch ? parseInt(yearMatch[1], 10) : 0;
  };

  const genA = getGeneration(aValue);
  const yearA = getYear(aValue);
  const genB = getGeneration(bValue);
  const yearB = getYear(bValue);

  if (genA !== genB) {
    return genB - genA;
  }
  if (yearA !== yearB) {
    return yearB - yearA;
  }

  return 0;
}

function parseResolution(value: string): number | null {
  const match = value.match(/(\d+(\.\d+)?)\s*MP/i);
  return match ? parseFloat(match[1]) : null;
}

function parseBatteryRange(value: string): number | null {
  if (value.includes("+")) {
    const match = value.match(/(\d+)%\+/);
    return 100000;
  }
  if (value.includes("Less than")) {
    const match = value.match(/Less than (\d+)%/);
    return match ? parseInt(match[1], 10) - 100 : null;
  }
  const rangeMatch = value.match(/(\d+)%\s*-\s*(\d+)%/);
  return rangeMatch ? parseInt(rangeMatch[2], 10) : null;
}

function parseCapacity(value: string): number | null {
  const capacityRegex =
    /(\d+(\.\d+)?)\s*(KB|MB|GB|TB|كيلوبايت|ميجابايت|جيجابايت|جىجاباىت|تيرابايت|تيراباىت|مىجاباىت|تىراباىت)?|\s*(KB|MB|GB|TB|كيلوبايت|ميجابايت|جيجابايت|جىجاباىت|تيرابايت|تيراباىت|مىجاباىت|تىراباىت)\s*(\d+(\.\d+)?)/gi;

  let totalSize = 0;
  let match;

  while ((match = capacityRegex.exec(value)) !== null) {
    const size = match[1] ? parseFloat(match[1]) : parseFloat(match[5]);
    const unit = match[3] ? match[3]?.toUpperCase() : match[4]?.toUpperCase();

    switch (unit) {
      case "KB":
      case "كيلوبايت":
        totalSize += size * 1024;
        break;
      case "MB":
      case "ميجابايت":
      case "مىجاباىت":
        totalSize += size * 1024 * 1024;
        break;
      case "GB":
      case "جيجابايت":
      case "جىجاباىت":
        totalSize += size * 1024 * 1024 * 1024;
        break;
      case "TB":
      case "تيرابايت":
      case "تىراباىت":
        totalSize += size * 1024 * 1024 * 1024 * 1024;
        break;
    }
  }

  return totalSize || null;
}
