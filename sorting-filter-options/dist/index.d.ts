export interface SortableObject {
    value: string;
    count?: number;
}
export declare function sortArrayByValue(arr: SortableObject[], sortByCount?: boolean): SortableObject[];
export declare const normalizeArabicText: (text: string) => string;
