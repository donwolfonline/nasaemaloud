export interface Product {
    id: string;
    category: string;
    name: string;
    price: number;
}

export const products: Product[] = [
    { id: "1", category: "العود", name: "دقة مروكي (أوقية)", price: 90 },
    { id: "2", category: "العود", name: "دقة مروكي (أوقيتين)", price: 150 },
    { id: "3", category: "العود", name: "تايقر (أوقية)", price: 90 },
    { id: "4", category: "العود", name: "تايقر (أوقيتين)", price: 150 },
    { id: "5", category: "العود", name: "الكلمنتان (أوقية)", price: 120 },
    { id: "6", category: "العود", name: "الكلمنتان (أوقيتين)", price: 190 },
    { id: "7", category: "العود", name: "زوايا الكمبودي (أوقية)", price: 140 },
    { id: "8", category: "العود", name: "زوايا الكمبودي (أوقيتين)", price: 250 },
    { id: "9", category: "بخور", name: "بخور ملكي (صغير)", price: 40 },
    { id: "10", category: "بخور", name: "بخور ملكي (كبير)", price: 70 },
    { id: "11", category: "بخور", name: "بخور الجوهرة (صغير)", price: 40 },
    { id: "12", category: "بخور", name: "بخور الجوهرة (كبير)", price: 70 },
    { id: "13", category: "بخور", name: "بخور قصة (صغير)", price: 40 },
    { id: "14", category: "بخور", name: "بخور قصة (كبير)", price: 70 },
    { id: "15", category: "بخور", name: "مرصع كلمات (صغير)", price: 45 },
    { id: "16", category: "بخور", name: "مرصع كلمات (كبير)", price: 90 },
    { id: "17", category: "بخور", name: "مرصع دلوني عليك (صغير)", price: 45 },
    { id: "18", category: "بخور", name: "مرصع دلوني عليك (كبير)", price: 90 },
    { id: "19", category: "أعواد كمبودي", name: "أعواد كمبودي (كبير)", price: 60 },
    { id: "20", category: "أعواد كمبودي", name: "أعواد كمبودي (وسط)", price: 50 },
    { id: "21", category: "أعواد كمبودي", name: "أعواد كمبودي (صغير)", price: 30 },
    { id: "22", category: "أعواد كمبودي", name: "أعواد كمبودي (صغير جداً)", price: 25 },
    { id: "23", category: "خمريات", name: "خمرية توت (صغير)", price: 15 },
    { id: "24", category: "خمريات", name: "خمرية توت (كبير)", price: 30 },
    { id: "25", category: "خمريات", name: "خمرية لطافة (صغير)", price: 15 },
    { id: "26", category: "خمريات", name: "خمرية لطافة (كبير)", price: 30 },
    { id: "27", category: "مسك", name: "مسك روز (صغير)", price: 15 },
    { id: "28", category: "مسك", name: "مسك روز (وسط)", price: 25 },
    { id: "29", category: "مسك", name: "مسك روز (كبير)", price: 30 },
    { id: "30", category: "مسك", name: "مسك توت (صغير)", price: 15 },
    { id: "31", category: "مسك", name: "مسك توت (وسط)", price: 25 },
    { id: "32", category: "مسك", name: "مسك توت (كبير)", price: 30 },
    { id: "33", category: "دهن عود", name: "دهن عود (صغيرة)", price: 40 },
    { id: "34", category: "دهن عود", name: "دهن عود (وسط)", price: 89 },
    { id: "35", category: "دهن عود", name: "دهن عود (كبير)", price: 120 },
    { id: "36", category: "مستلزمات", name: "فحم (صغير)", price: 20 },
    { id: "37", category: "مستلزمات", name: "فحم (كبير)", price: 40 },
    { id: "38", category: "مستلزمات", name: "ولاعة", price: 20 },
    { id: "39", category: "مستلزمات", name: "مبخرة إلكترونية", price: 45 },
    { id: "40", category: "مستلزمات", name: "مستكة", price: 20 },
];

export const categories = ["الكل", ...Array.from(new Set(products.map((p) => p.category)))];

export const categoryIcons: Record<string, string> = {
    "الكل": "🌟",
    "العود": "🪵",
    "بخور": "🌿",
    "أعواد كمبودي": "🎋",
    "خمريات": "🍇",
    "مسك": "🌸",
    "دهن عود": "💧",
    "مستلزمات": "🛒",
};
