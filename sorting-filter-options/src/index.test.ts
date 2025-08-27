import { SortableObject, sortArrayByValue } from "./index";

describe("sortArrayByValue", () => {
  it("should sort by capacity in descending order", () => {
    const data = [
      { value: "128 GB" },
      { value: "1.5 GB" },
      { value: "64 GB" },
      { value: "5 KB" },
      { value: "1 TB" },
    ];

    const sorted = sortArrayByValue(data);

    expect(sorted).toEqual([
      { value: "1 TB" },
      { value: "128 GB" },
      { value: "64 GB" },
      { value: "1.5 GB" },
      { value: "5 KB" },
    ]);
  });

  it("should sort by capacity in descending order for comma seperated text", () => {
    const data = [
      { value: "12 GB" },
      { value: "3 GB" },
      { value: "768 MB" },
      { value: "1.5 GB" },
      { value: "5 GB" },
      { value: "8 GB" },
    ];

    const sorted = sortArrayByValue(data);

    expect(sorted).toEqual([
      { value: "12 GB" },
      { value: "8 GB" },
      { value: "5 GB" },
      { value: "3 GB" },
      { value: "1.5 GB" },
      { value: "768 MB" },
    ]);
  });

  it("should sort different capacities in descending order", () => {
    const data = [
      { value: "128 GB" },
      { value: "825 GB" },
      { value: "512 GB" },
      { value: "512 GB SSD" },
      { value: "2 TB" },
      { value: "1 TB" },
      { value: "500 GB" },
      { value: "2 TB + 400GB" },
    ];

    const sorted = sortArrayByValue(data);

    expect(sorted).toEqual([
      { value: "2 TB + 400GB" },
      { value: "2 TB" },
      { value: "1 TB" },
      { value: "825 GB" },
      { value: "512 GB" },
      { value: "512 GB SSD" },
      { value: "500 GB" },
      { value: "128 GB" },
    ]);
  });

  it("should handle mixed input of numbers and text", () => {
    const data = [
      { value: "50" },
      { value: "100" },
      { value: "Yellow" },
      { value: "Red" },
    ];

    const sorted = sortArrayByValue(data);

    expect(sorted).toEqual([
      { value: "100" },
      { value: "50" },
      { value: "Red" },
      { value: "Yellow" },
    ]);
  });

  it("should handle the sorting of numbers in string format", () => {
    const data = [
      { value: "2016" },
      { value: "2014" },
      { value: "2024" },
      { value: "2011" },
    ];
    const sorted = sortArrayByValue(data);
    expect(sorted).toEqual([
      { value: "2024" },
      { value: "2016" },
      { value: "2014" },
      { value: "2011" },
    ]);
  });

  it("should sort by count when sortByCount is true", () => {
    const arr: SortableObject[] = [
      { value: "Blue", count: 295 },
      { value: "Black", count: 632 },
      { value: "Gold", count: 339 },
      { value: "Silver", count: 302 },
    ];

    const sorted = sortArrayByValue(arr, true);

    expect(sorted).toEqual([
      { value: "Black", count: 632 },
      { value: "Gold", count: 339 },
      { value: "Silver", count: 302 },
      { value: "Blue", count: 295 },
    ]);
  });

  it("should handle generation sorting", () => {
    const data = [
      { value: "6th gen. (2022)" },
      { value: "10th gen. (2022)" },
      { value: "3rd gen. (2022)" },
      { value: "2nd gen. (2022)" },
      { value: "9th gen. (2022)" },
      { value: "4th gen. (2022)" },
      { value: "4th gen. (2021)" },
      { value: "4th gen. (2023)" },
    ];

    const sorted = sortArrayByValue(data);

    expect(sorted).toEqual([
      { value: "10th gen. (2022)" },
      { value: "9th gen. (2022)" },
      { value: "6th gen. (2022)" },
      { value: "4th gen. (2023)" },
      { value: "4th gen. (2022)" },
      { value: "4th gen. (2021)" },
      { value: "3rd gen. (2022)" },
      { value: "2nd gen. (2022)" },
    ]);
  });

  it("should handle alphanumeric values by sorting text first then numbers", () => {
    const data = [
      { value: "MC8020 5G Modem CPE" },
      { value: "E6888-982 5G MOBILE WIFI" },
      { value: "E6988-982 5G MOBILE WIFI" },
      { value: "E6088-982 5G MOBILE WIFI" },
      { value: "DWR-3000M" },
      { value: "MU5001 5G" },
    ];

    const sorted = sortArrayByValue(data);

    expect(sorted).toEqual([
      { value: "DWR-3000M" },
      { value: "E6088-982 5G MOBILE WIFI" },
      { value: "E6888-982 5G MOBILE WIFI" },
      { value: "E6988-982 5G MOBILE WIFI" },
      { value: "MC8020 5G Modem CPE" },
      { value: "MU5001 5G" },
    ]);
  });

  it("should handle arrabic values by sorting text first then numbers", () => {
    const data = [
      { value: "الجيل التاسع (2021)" },
      { value: "الجيل الاول (2021)" },
      { value: "الجيل العاشر (2022)" },
      { value: "الجيل الاول (2019)" },
      { value: "الجيل الثالث (2021)" },
      { value: "الجيل الاول (2020)" },
      { value: "الجيل الثانى (2020)" },
    ];

    const sorted = sortArrayByValue(data);

    expect(sorted).toEqual([
      { value: "الجيل العاشر (2022)" },
      { value: "الجيل التاسع (2021)" },
      { value: "الجيل الثالث (2021)" },
      { value: "الجيل الثانى (2020)" },
      { value: "الجيل الاول (2021)" },
      { value: "الجيل الاول (2020)" },
      { value: "الجيل الاول (2019)" },
    ]);
  });

  it("should handle arabic text up to 13th generation", () => {
    const data = [
      { value: "الجيل الثامن" },
      { value: "الجيل الحادي عشر" },
      { value: "الجيل الثاني عشر" },
      { value: "الجيل العاشر" },
      { value: "الجيل السابع" },
      { value: "الجيل السادس" },
      { value: "الجيل الثالث عشر" },
      { value: "الجيل الرابع" },
      { value: "الجيل الخامس" },
      { value: "الجيل الثاني" },
      { value: "الجيل الثالث" },
      { value: "الجيل التاسع" },
    ];

    const sorted = sortArrayByValue(data);

    expect(sorted).toEqual([
      { value: "الجيل الثالث عشر" },
      { value: "الجيل الثاني عشر" },
      { value: "الجيل الحادي عشر" },
      { value: "الجيل العاشر" },
      { value: "الجيل التاسع" },
      { value: "الجيل الثامن" },
      { value: "الجيل السابع" },
      { value: "الجيل السادس" },
      { value: "الجيل الخامس" },
      { value: "الجيل الرابع" },
      { value: "الجيل الثالث" },
      { value: "الجيل الثاني" },
    ]);
  });

  it("should handle alphanumeric generation by sorting text first then numbers", () => {
    const data = [
      { value: "2nd Gen" },
      { value: "3rd Gen" },
      { value: "8th Gen" },
      { value: "4th Gen" },
      { value: "12th Gen" },
    ];

    const sorted = sortArrayByValue(data);

    expect(sorted).toEqual([
      { value: "12th Gen" },
      { value: "8th Gen" },
      { value: "4th Gen" },
      { value: "3rd Gen" },
      { value: "2nd Gen" },
    ]);
  });

  it("should sort by battery ranges in descending order", () => {
    const data = [
      { value: "80% - 85%" },
      { value: "85% - 90%" },
      { value: "90% - 95%" },
      { value: "95%+" },
      { value: "75% - 80%" },
      { value: "Less than 75%" },
    ];

    const sorted = sortArrayByValue(data);

    expect(sorted).toEqual([
      { value: "95%+" },
      { value: "90% - 95%" },
      { value: "85% - 90%" },
      { value: "80% - 85%" },
      { value: "75% - 80%" },
      { value: "Less than 75%" },
    ]);
  });

  it("should sort by Connectivity in descending order", () => {
    const data = [
      { value: "2G" },
      { value: "5G" },
      { value: "3G" },
      { value: "4G" },
    ];

    const sorted = sortArrayByValue(data);

    expect(sorted).toEqual([
      { value: "5G" },
      { value: "4G" },
      { value: "3G" },
      { value: "2G" },
    ]);
  });

  it("should sort arabic ram in descending order", () => {
    const arr: SortableObject[] = [
      { value: "1 تيرابايت" }, // TB
      { value: "128 جيجابايت" }, // GB
      { value: "256 جيجابايت" }, // GB
      { value: "1.5 جيجابايت" }, // GB
      { value: "100 ميجابايت" }, // MB
      { value: "10 ميجابايت" }, // MB
      { value: "تيرابايت 2" }, // TB
    ];

    const sorted = sortArrayByValue(arr, true);

    expect(sorted).toEqual([
      { value: "تيرابايت 2" }, // TB
      { value: "1 تيرابايت" }, // TB
      { value: "256 جيجابايت" }, // GB
      { value: "128 جيجابايت" }, // GB
      { value: "1.5 جيجابايت" }, // GB
      { value: "100 ميجابايت" }, // MB
      { value: "10 ميجابايت" }, // MB
    ]);
  });
  it("should handle alphanumeric values in screensize and sort in descending order", () => {
    const data = [
      { value: "30 mm" },
      { value: "25 mm" },
      { value: "12 mm" },
      { value: "50 mm" },
      { value: "41 mm" },
      { value: "33 mm" },
    ];

    const sorted = sortArrayByValue(data);

    expect(sorted).toEqual([
      { value: "50 mm" },
      { value: "41 mm" },
      { value: "33 mm" },
      { value: "30 mm" },
      { value: "25 mm" },
      { value: "12 mm" },
    ]);
  });

  it("should handle alphanumeric values in resolutions and sort in descending order", () => {
    const data = [
      { value: "12.0 MP" },
      { value: "46.0 MP" },
      { value: "15.0 MP" },
      { value: "50.0 MP" },
      { value: "41 MP" },
      { value: "61 MP" },
    ];

    const sorted = sortArrayByValue(data);

    expect(sorted).toEqual([
      { value: "61 MP" },
      { value: "50.0 MP" },
      { value: "46.0 MP" },
      { value: "41 MP" },
      { value: "15.0 MP" },
      { value: "12.0 MP" },
    ]);
  });

  it("should handle alphanumeric values in fps and sort in descending order", () => {
    const data = [
      { value: "1.0fps" },
      { value: "11.0fps" },
      { value: "15.0fps" },
      { value: "5.0fps" },
      { value: "10fps" },
      { value: "20fps" },
    ];

    const sorted = sortArrayByValue(data);

    expect(sorted).toEqual([
      { value: "20fps" },
      { value: "15.0fps" },
      { value: "11.0fps" },
      { value: "10fps" },
      { value: "5.0fps" },
      { value: "1.0fps" },
    ]);
  });

  it("should sort english conditions from best to worst", () => {
    const data = [
      { value: "Lightly Used" },
      { value: "Like New" },
      { value: "Extensively Used" },
      { value: "Noticeably Used" },
    ];

    const sorted = sortArrayByValue(data);

    expect(sorted).toEqual([
      { value: "Like New" },
      { value: "Lightly Used" },
      { value: "Noticeably Used" },
      { value: "Extensively Used" },
    ]);
  });

  it("should sort arabic conditions from best to worst", () => {
    const data = [
      { value: "استخدام ملحوظ" },
      { value: "استخدام نظيف" },
      { value: "أخو الجديد" },
      { value: "مستخدم بشدة" },
    ];

    const sorted = sortArrayByValue(data);

    expect(sorted).toEqual([
      { value: "أخو الجديد" },
      { value: "استخدام نظيف" },
      { value: "استخدام ملحوظ" },
      { value: "مستخدم بشدة" },
    ]);
  });
});
