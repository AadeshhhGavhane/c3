// Menu data structure
export interface MenuItem {
  item: string;
  price: number;
  description: string;
  image: string;
}

export interface DayMenu {
  veg: {
    breakfast: MenuItem;
    lunch: MenuItem;
  };
  nonVeg: {
    breakfast: MenuItem;
    lunch: MenuItem;
  };
}

export interface WeeklyMenu {
  monday: DayMenu;
  tuesday: DayMenu;
  wednesday: DayMenu;
  thursday: DayMenu;
  friday: DayMenu;
  saturday: DayMenu;
  sunday: DayMenu;
}

// Using existing Google CDN images from the app
const IMAGES = {
  poha: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC_YlxlwgjYEus4TwN1E7BaaE2Cp-00DN2yvw5zY7an5ykU1fDOHSFqyfd93WxjMUH27INJGK_MO_Jbdi6bNVutM6LBCZlv43e4xjgQtf3WtMUJw4PDekdP3toyYiLD4bZR1b77SfmZX7YzmXwu2-tgLEF-0ImPs1o95HxSo6xFrv1qCHlE1HN_lAMhhmLRDpNFn2Yw4Da7Jdi-GDdXOSg3YS7Ds7EVzWPB2Tv64TEEjJvW5CAlQ4gB2f8jvx0280GKnHGiF-hLazLK',
  thali: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDfi3S-CBCr8OPumxRpKdEe3Xa_vJBFjdwnpO28Ht_wV3lmiS40_vXP0Q72daEzTxNM8BkFDolTTK5ERHeVi_iKv-H4mD7aOr1QN5Y4-nJmS4pnxVC6u111foD-yAv1FfQuOd6knRn9msxABfNOw0y9K_nGeUhw_u-Dbhr7DA09LI1yyPZIH20GLvDfMkG919pP9NZXsJmnapiRgz3csEBLy-I9QOgD73sjN1nvtUS9E4Wzt2KABvxuXmP_ASCII9MqzRyKeNGMOox-',
  egg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBNBX3XcoxSQbRrdZRFmtAYuiVfvUOXwnadb0enP9AcWglRgVGH3Kzw9424eS6y9xRWUkI4FWhJLljGXIJeMbZOWHecb3wp7RxwobDKlWsUIYTqeKl7jz8ETBsjBvr9IjhqsR8xHI06Cbf1hzXNE5RyzGrDomul6eX5p653WdRn0c1h-u2Vt8eOApoV0_RMZUG_Ut-z9yYVuxrPZ9CQ8oShgFiivRU4L2SzwE5eYn0xK0X5s4KGeMjBsC4yyPoKGlWlaKXYEINsTkA_',
  coffee: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAnGA6v5oLhx76ulHUwbs098LDo8FBDX5gtuTmfGbwYTFVjJddCNGV8BuCX87O1F2c84hWYSWx9Ayz40jaECKUOFh8_c4_dLp3ow6JuwAVj3P2cXE-Qwwxg789YYEd7yk6Z8YeulJMyVLd_hHc5Uw_gCugcW0zdJ0sooTVnoWd9MMXqmwEEknQmGiIk8oG2qvXAYXR1O_HVJ04GROYRYBxBRBmVnk5DrUA7b0_UqktBXt9XQgytvz-VHNqbQ3B7rXJZs7OpeEU6h0mx',
  chicken: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCF2mw7KTu4r1M3F9XbNtppP8LEL_cwcjXmuF8aKtbHzsRP92dsiz13a-TQ-5aCYl3NPkyG4YgVL485NPnUPvSQnZjm_QYHTafFdtsyV4aRNEY989tydr-jRfPLZBiYZd6Z6idUIWih3a_6LxyvLT-gAIyu6_LwhsRhZHjmAmpEyOu4r8ExEouprOnletDJF38_p69Ed0HfTl3q4KtTSfCOasfrTxnnEZl_JwqQ0uMCAJwxkYJpqg_x1s0oOtYh8VwojD9YNSvJ3NrL',
  biryani: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBgyczmirASmhOjGWCG2YZYfRsSVvE-gyze7SlSvl_unnWICqL9RndTKHBf7CV4Nq29DWabMGtcuobRRmZRuO8gq7LtAnL7IprKA0z-r4DFVDtC3NHlOkIEcPc3bZVoT2HUFzS_DmPhFxVqHS4Hcwt6myoPS2fjvZgsC5tWfs6fURmrWz10-MWL6yaV2NrR8gAHQX93xtIJDS3u23YT6Vvl1HyIYdkd-lqv-Xpz8MuvO2bX0UhBsCKh8UPqAcY6zKGJ2VdSgSPTWbtg',
  idli: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAuiW8yhkq0wYhYcg-4rEL_epqdIjMvkVz1_4RUSi243-X4cA3eczh9tNCOSFS-Q4OXGhLKM4IkJIw9eCcQo3G-HntLg_UOrLxqwhEpdyCrTZOh8-j3MWP7crpmrZ4PM7vLl2smI-D2n4G307nF3hEHJtj3wQr6dThcXBBgzIqVW1rpFMsZbsvoCrebLiOumEyypWy6fpsjCS5bjf4_dLlTMIguHo_dprkP0yD4aie6mDTz87oo_D_ngtWF_C5g7pX4MgJx9_qS2o2C',
  dosa: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB9DN0K9Vov9apSQh8g0DE4P-QHZOaHmzpeM1FexNJ34qQUKzQM1hC6CUbgpZYAIkbwpijHYH4jMzb7MaDSLxyTWO42fvOUyyRFOfdpi8omiVC6lqL3VIWYIaezqxoNf4a7XCYgNScx_qejM3AP2KcqFnQoiEqiPB7jeuS1r_6lR_nec5uOqiDppTAR3n4_5Imu9AevIkkp99fnBDS8U0RRoH0X-5uSUxBq-1VB0isJ1rZ5_0_sMbU7jO2DpVE0HQU2OGwJf6smjRUi',
  paneer: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB6GfWFJxz4hu7g0hKDA8yKEjwhNT8A-PYTT0CWL9fEKiwqcexv5LBfJnFHabSHQ__mld1lbbJKspPVmxGp-wuVX-KRfsSv_E4kiQ_QXhJnzeY7E7s2fMOv7og03WWaBXadR1AagFg1QNIXsbr7NAugoYE8yarCgNlUn4XMjuGvgGdBFT4J2hvoKF_GsL7BJDXATKtLUj-ehYTTJbigy3NphmDfW4UhTuU3ja0dfU7D-ooGPjHuCFSwPX1nSSoOprNpcamYWW2HHnh3',
  default: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCdvKGwN43GtldCW9JV_j_z0SS3l3qvqLT707u2TTGUaecoBo64l2K7Y02SvvNS2iRUF9sbAWtqa_dKafdzaQ6eSmMS7VTTxggl-ObWdVpiPCbTepn-EKrdaxgN7C4Tlc4ARkxaK1QuLB3WmiAcbjQguZCyT3O9KkQ6SLhlqfWV7pddJzd2idN7UYE3LJ7gytN8oQLd0CGqnEcQkXC84PMPO0pNonCm9XTuVKOLXbOJPWVs1Hig27rIXmpX45qZow0WVLqMWIMqhi5l',
};

// Helper function to get image based on item name
function getImage(itemName: string): string {
  const lowerName = itemName.toLowerCase();
  if (lowerName.includes('poha')) return IMAGES.poha;
  if (lowerName.includes('thali')) return IMAGES.thali;
  if (lowerName.includes('egg') || lowerName.includes('bhurji') || lowerName.includes('omelette')) return IMAGES.egg;
  if (lowerName.includes('coffee') || lowerName.includes('tea')) return IMAGES.coffee;
  if (lowerName.includes('chicken')) return IMAGES.chicken;
  if (lowerName.includes('biryani')) return IMAGES.biryani;
  if (lowerName.includes('idli') || lowerName.includes('wada') || lowerName.includes('sambar')) return IMAGES.idli;
  if (lowerName.includes('dosa') || lowerName.includes('paratha') || lowerName.includes('bhature')) return IMAGES.dosa;
  if (lowerName.includes('paneer')) return IMAGES.paneer;
  return IMAGES.default;
}

export const weeklyMenu: WeeklyMenu = {
  monday: {
    veg: {
      breakfast: {
        item: 'poha',
        price: 25,
        description: 'light and fluffy flattened rice cooked with onions, peanuts, mustard seeds, and lemon',
        image: getImage('poha'),
      },
      lunch: {
        item: 'veg thali',
        price: 60,
        description: 'balanced meal with roti, seasonal sabzi, dal, rice, salad, and pickle',
        image: getImage('veg thali'),
      },
    },
    nonVeg: {
      breakfast: {
        item: 'egg bhurji pav',
        price: 35,
        description: 'spicy scrambled eggs cooked with onions and masala served with pav',
        image: getImage('egg bhurji'),
      },
      lunch: {
        item: 'chicken curry with rice',
        price: 75,
        description: 'homestyle chicken curry slow cooked in spices served with steamed rice',
        image: getImage('chicken curry'),
      },
    },
  },
  tuesday: {
    veg: {
      breakfast: {
        item: 'medu wada',
        price: 30,
        description: 'crispy lentil fritters served with coconut chutney and sambar',
        image: getImage('medu wada'),
      },
      lunch: {
        item: 'rajma chawal',
        price: 55,
        description: 'red kidney beans cooked in thick gravy served with steamed rice',
        image: getImage('rajma'),
      },
    },
    nonVeg: {
      breakfast: {
        item: 'boiled egg plate',
        price: 25,
        description: 'protein-rich boiled eggs lightly seasoned with salt and pepper',
        image: getImage('boiled egg'),
      },
      lunch: {
        item: 'egg curry with roti',
        price: 65,
        description: 'boiled eggs simmered in spicy onion-tomato gravy served with rotis',
        image: getImage('egg curry'),
      },
    },
  },
  wednesday: {
    veg: {
      breakfast: {
        item: 'upma',
        price: 25,
        description: 'semolina cooked with vegetables, curry leaves, and mild spices',
        image: getImage('upma'),
      },
      lunch: {
        item: 'chole bhature',
        price: 65,
        description: 'spiced chickpea curry served with fluffy deep-fried bhature',
        image: getImage('chole bhature'),
      },
    },
    nonVeg: {
      breakfast: {
        item: 'omelette sandwich',
        price: 30,
        description: 'fluffy omelette layered between toasted bread with butter',
        image: getImage('omelette'),
      },
      lunch: {
        item: 'chicken biryani',
        price: 85,
        description: 'aromatic basmati rice cooked with tender chicken and whole spices',
        image: getImage('chicken biryani'),
      },
    },
  },
  thursday: {
    veg: {
      breakfast: {
        item: 'idli sambar',
        price: 30,
        description: 'soft steamed idlis served with sambar and coconut chutney',
        image: getImage('idli sambar'),
      },
      lunch: {
        item: 'dal khichdi',
        price: 50,
        description: 'comfort meal of rice and lentils cooked with ghee and mild spices',
        image: getImage('dal khichdi'),
      },
    },
    nonVeg: {
      breakfast: {
        item: 'egg omelette',
        price: 25,
        description: 'classic omelette cooked with onions and green chillies',
        image: getImage('egg omelette'),
      },
      lunch: {
        item: 'fish curry with rice',
        price: 80,
        description: 'coastal-style fish curry cooked in tangy coconut gravy',
        image: getImage('fish curry'),
      },
    },
  },
  friday: {
    veg: {
      breakfast: {
        item: 'aloo paratha',
        price: 35,
        description: 'stuffed wheat flatbread filled with spiced mashed potatoes served with butter',
        image: getImage('aloo paratha'),
      },
      lunch: {
        item: 'paneer butter masala with roti',
        price: 70,
        description: 'soft paneer cubes cooked in rich buttery tomato gravy served with rotis',
        image: getImage('paneer butter masala'),
      },
    },
    nonVeg: {
      breakfast: {
        item: 'egg bhurji sandwich',
        price: 35,
        description: 'spicy scrambled eggs layered between toasted bread slices',
        image: getImage('egg bhurji'),
      },
      lunch: {
        item: 'chicken butter masala with roti',
        price: 85,
        description: 'tender chicken pieces cooked in creamy tomato-based gravy served with rotis',
        image: getImage('chicken butter masala'),
      },
    },
  },
  saturday: {
    veg: {
      breakfast: {
        item: 'misal pav',
        price: 35,
        description: 'spicy sprout curry topped with farsan, onions, and lemon served with pav',
        image: getImage('misal pav'),
      },
      lunch: {
        item: 'veg biryani',
        price: 65,
        description: 'aromatic basmati rice cooked with vegetables and whole spices',
        image: getImage('veg biryani'),
      },
    },
    nonVeg: {
      breakfast: {
        item: 'cheese omelette',
        price: 35,
        description: 'fluffy omelette filled with melted cheese and mild spices',
        image: getImage('cheese omelette'),
      },
      lunch: {
        item: 'egg biryani',
        price: 75,
        description: 'fragrant basmati rice cooked with boiled eggs and aromatic spices',
        image: getImage('egg biryani'),
      },
    },
  },
  sunday: {
    veg: {
      breakfast: {
        item: 'masala dosa',
        price: 40,
        description: 'crispy dosa filled with spiced potato masala served with chutney and sambar',
        image: getImage('masala dosa'),
      },
      lunch: {
        item: 'special veg sunday thali',
        price: 75,
        description: 'elaborate thali with multiple sabzis, dal, rice, roti, sweet, and salad',
        image: getImage('special veg thali'),
      },
    },
    nonVeg: {
      breakfast: {
        item: 'bread omelette',
        price: 30,
        description: 'classic street-style omelette served with buttered bread',
        image: getImage('bread omelette'),
      },
      lunch: {
        item: 'special chicken sunday thali',
        price: 90,
        description: 'special thali with chicken curry, rice, roti, salad, pickle, and dessert',
        image: getImage('special chicken thali'),
      },
    },
  },
};

// Helper function to get day name from date
export function getDayName(date: Date): keyof WeeklyMenu {
  const days: (keyof WeeklyMenu)[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  return days[date.getDay()];
}

// Get today's menu
export function getTodayMenu(): DayMenu {
  const today = new Date();
  const dayName = getDayName(today);
  return weeklyMenu[dayName];
}

// Get menu for a specific day
export function getDayMenu(dayName: keyof WeeklyMenu): DayMenu {
  return weeklyMenu[dayName];
}

// Get all breakfast items across all days
export function getAllBreakfastItems(): Array<MenuItem & { day: string; isVeg: boolean }> {
  const items: Array<MenuItem & { day: string; isVeg: boolean }> = [];
  const days: (keyof WeeklyMenu)[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  
  days.forEach((day) => {
    items.push({ ...weeklyMenu[day].veg.breakfast, day, isVeg: true });
    items.push({ ...weeklyMenu[day].nonVeg.breakfast, day, isVeg: false });
  });
  
  return items;
}

// Get all lunch items across all days
export function getAllLunchItems(): Array<MenuItem & { day: string; isVeg: boolean }> {
  const items: Array<MenuItem & { day: string; isVeg: boolean }> = [];
  const days: (keyof WeeklyMenu)[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  
  days.forEach((day) => {
    items.push({ ...weeklyMenu[day].veg.lunch, day, isVeg: true });
    items.push({ ...weeklyMenu[day].nonVeg.lunch, day, isVeg: false });
  });
  
  return items;
}

