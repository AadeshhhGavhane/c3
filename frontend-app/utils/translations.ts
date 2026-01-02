import i18n from '@/i18n/config';

// Helper function to get translated menu item name
export function getTranslatedMenuItem(itemKey: string): string {
  return i18n.t(`menu.${itemKey}`, { defaultValue: itemKey });
}

// Helper function to get translated description
export function getTranslatedDescription(itemKey: string): string {
  return i18n.t(`descriptions.${itemKey}`, { defaultValue: itemKey });
}

// Map menu item keys from mock data to translation keys
const menuItemKeyMap: Record<string, string> = {
  'poha': 'poha',
  'veg thali': 'vegThali',
  'egg bhurji pav': 'eggBhurjiPav',
  'chicken curry with rice': 'chickenCurryRice',
  'medu wada': 'meduWada',
  'rajma chawal': 'rajmaChawal',
  'boiled egg plate': 'boiledEggPlate',
  'egg curry with roti': 'eggCurryRoti',
  'upma': 'upma',
  'chole bhature': 'choleBhature',
  'omelette sandwich': 'omeletteSandwich',
  'chicken biryani': 'chickenBiryani',
  'idli sambar': 'idliSambar',
  'dal khichdi': 'dalKhichdi',
  'egg omelette': 'eggOmelette',
  'fish curry with rice': 'fishCurryRice',
  'aloo paratha': 'alooParatha',
  'paneer butter masala with roti': 'paneerButterMasalaRoti',
  'egg bhurji sandwich': 'eggBhurjiSandwich',
  'chicken butter masala with roti': 'chickenButterMasalaRoti',
  'misal pav': 'misalPav',
  'veg biryani': 'vegBiryani',
  'cheese omelette': 'cheeseOmelette',
  'egg biryani': 'eggBiryani',
  'masala dosa': 'masalaDosa',
  'special veg sunday thali': 'specialVegSundayThali',
  'bread omelette': 'breadOmelette',
  'special chicken sunday thali': 'specialChickenSundayThali',
};

// Helper to normalize item name for lookup
function normalizeItemName(itemName: string): string {
  return itemName.toLowerCase().trim();
}

// Get translation key from menu item name
export function getMenuItemTranslationKey(itemName: string): string {
  const normalized = normalizeItemName(itemName);
  return menuItemKeyMap[normalized] || normalized.replace(/\s+/g, '');
}

// Get translated menu item with fallback
export function translateMenuItem(itemName: string): string {
  const key = getMenuItemTranslationKey(itemName);
  const translated = i18n.t(`menu.${key}`, { defaultValue: '' });
  return translated || itemName;
}

// Get translated description with fallback
export function translateDescription(itemName: string, originalDescription: string): string {
  const key = getMenuItemTranslationKey(itemName);
  const translated = i18n.t(`descriptions.${key}`, { defaultValue: '' });
  return translated || originalDescription;
}

