import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Image as ExpoImage } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';
import { useAppearance } from '@/hooks/use-appearance';
import { ThemeToggle } from '@/components/theme-toggle';
import { LogoutButton } from '@/components/logout-button';
import { BottomNav } from '@/components/bottom-nav';
import { LanguageSelector } from '@/components/language-selector';
import { getFormattedDate } from '@/utils/date-utils';
import { getAllBreakfastItems, getAllLunchItems } from '@/constants/mock-data';
import { useTranslation } from 'react-i18next';
import { translateMenuItem, translateDescription } from '@/utils/translations';

const MAX_WIDTH = 448;

export default function CatalogScreen() {
  const { colorScheme } = useAppearance();
  const { t, i18n } = useTranslation();
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const currentLang = i18n.language;
  const today = getFormattedDate(new Date(), t);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedVegFilter, setSelectedVegFilter] = useState('');

  const categories = [t('common.all'), t('common.breakfast'), t('common.lunch')];
  const vegFilters = [t('common.all'), t('common.veg'), t('common.nonVeg')];

  // Auto-select "All" for both filters on mount and when language changes
  useEffect(() => {
    setSelectedCategory(t('common.all'));
    setSelectedVegFilter(t('common.all'));
  }, [t]);

  const stoneColors = colors.stone || {
    200: colorScheme === 'dark' ? '#44403c' : '#e7e5e4',
    300: colorScheme === 'dark' ? '#57534e' : '#d6d3d1',
    400: colorScheme === 'dark' ? '#78716c' : '#a8a29e',
    500: colorScheme === 'dark' ? '#a8a29e' : '#78716c',
    600: colorScheme === 'dark' ? '#d6d3d1' : '#57534e',
    700: colorScheme === 'dark' ? '#e7e5e4' : '#44403c',
    800: colorScheme === 'dark' ? '#f5f5f4' : '#292524',
  };

  // Get all items from mock data
  const allBreakfastItems = getAllBreakfastItems();
  const allLunchItems = getAllLunchItems();

  // Convert to catalog format with translations
  const allCatalogItems = [
    ...allBreakfastItems.map((item) => ({
      id: `breakfast-${item.day}-${item.isVeg ? 'veg' : 'nonveg'}`,
      name: translateMenuItem(item.item),
      description: translateDescription(item.item, item.description),
      price: t('common.price', { price: item.price }),
      image: item.image,
      category: 'breakfast' as const,
      isVeg: item.isVeg,
    })),
    ...allLunchItems.map((item) => ({
      id: `lunch-${item.day}-${item.isVeg ? 'veg' : 'nonveg'}`,
      name: translateMenuItem(item.item),
      description: translateDescription(item.item, item.description),
      price: t('common.price', { price: item.price }),
      image: item.image,
      category: 'lunch' as const,
      isVeg: item.isVeg,
    })),
  ];

  const filteredItems = allCatalogItems.filter((item) => {
    // Category filter
    const categoryMatch =
      selectedCategory === t('common.all') || 
      (selectedCategory === t('common.breakfast') && item.category === 'breakfast') ||
      (selectedCategory === t('common.lunch') && item.category === 'lunch');
    
    // Veg/Non-Veg filter
    const vegMatch =
      selectedVegFilter === t('common.all') ||
      (selectedVegFilter === t('common.veg') && item.isVeg) ||
      (selectedVegFilter === t('common.nonVeg') && !item.isVeg);
    
    return categoryMatch && vegMatch;
  });


  const renderCatalogItem = (item: CatalogItem) => (
    <View
      key={item.id}
      style={[
        styles.catalogItem,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
    >
      <View style={styles.catalogImageContainer}>
        <ExpoImage
          source={{ uri: item.image }}
          style={styles.catalogImage}
          contentFit="cover"
        />
      </View>
      <View style={styles.catalogContent}>
        <View style={styles.catalogHeader}>
          <View style={styles.catalogTitleRow}>
            <View
              style={[
                styles.vegIndicator,
                { borderColor: item.isVeg ? '#16a34a' : '#dc2626' },
              ]}
            >
              <View
                style={[
                  styles.vegIndicatorInner,
                  { backgroundColor: item.isVeg ? '#16a34a' : '#dc2626' },
                ]}
              />
            </View>
            <Text style={[styles.catalogName, { color: colors.text }]}>{item.name}</Text>
          </View>
        </View>
        <Text style={[styles.catalogDesc, { color: stoneColors[500] }]} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.catalogFooter}>
          <Text style={[styles.catalogPrice, { color: colors.primary }]}>{item.price}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingBottom: 80,
        },
      ]}
    >
      {/* Top App Bar */}
      <View
          style={[
            styles.header,
            {
              backgroundColor: colors.background,
              paddingTop: Math.max(insets.top + 8, 32),
              borderBottomColor: colors.border,
            },
          ]}
      >
        <View style={styles.headerTop}>
          <View style={styles.headerDateContainer}>
            <Text style={[styles.headerLabel, { color: colors.subtext }]}>{t('common.today')}</Text>
            <Text style={[styles.headerDate, { color: colors.text }]} numberOfLines={1}>{today.shortDayName}, {today.shortDate}</Text>
          </View>
          <View style={styles.headerRight}>
            <LanguageSelector />
            <ThemeToggle />
            <LogoutButton />
          </View>
        </View>
        <View style={styles.headline}>
          <Text style={[
            styles.headlineText,
            { color: colors.text },
            (currentLang === 'hi' || currentLang === 'mr') && { paddingTop: 2, lineHeight: 34 }
          ]}>
            {t('common.explore')}{'\n'}
            <Text style={{ color: colors.primary }}>{t('common.browseCatalog')}</Text>
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Sticky Categories */}
        <View
          style={[
            styles.categoriesContainer,
            {
              backgroundColor: colors.background,
            },
          ]}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categories}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                onPress={() => setSelectedCategory(category)}
                style={[
                  styles.categoryButton,
                  selectedCategory === category && {
                    backgroundColor: colors.primary,
                  },
                  selectedCategory !== category && {
                    backgroundColor: stoneColors[200],
                  },
                ]}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === category && {
                      color: '#ffffff',
                    },
                    selectedCategory !== category && {
                      color: stoneColors[600],
                    },
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Veg/Non-Veg Filter */}
        <View
          style={[
            styles.categoriesContainer,
            {
              backgroundColor: colors.background,
            },
          ]}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categories}
          >
            {vegFilters.map((filter) => (
              <TouchableOpacity
                key={filter}
                onPress={() => setSelectedVegFilter(filter)}
                style={[
                  styles.categoryButton,
                  selectedVegFilter === filter && {
                    backgroundColor: colors.primary,
                  },
                  selectedVegFilter !== filter && {
                    backgroundColor: stoneColors[200],
                  },
                ]}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.categoryText,
                    selectedVegFilter === filter && {
                      color: '#ffffff',
                    },
                    selectedVegFilter !== filter && {
                      color: stoneColors[600],
                    },
                  ]}
                >
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Catalog List */}
        <View style={styles.catalogList}>
          {filteredItems.length > 0 && (
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                {selectedCategory === t('common.all') ? t('common.allItems') : selectedCategory}
              </Text>
              <Text style={[styles.sectionTime, { color: stoneColors[500] }]}>
                {selectedCategory === t('common.breakfast') ? t('time.breakfastCatalog') : t('time.lunchCatalog')}
              </Text>
            </View>
          )}
          {filteredItems.map(renderCatalogItem)}
        </View>
      </ScrollView>

      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    maxWidth: MAX_WIDTH,
    alignSelf: 'center',
    width: '100%',
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerDateContainer: {
    flex: 1,
    minWidth: 0,
  },
  headerLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  headerDate: {
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 24,
    letterSpacing: -0.3,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headline: {
    paddingTop: 16,
    paddingBottom: 8,
  },
  headlineText: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
    lineHeight: 32,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  categoriesContainer: {
    paddingTop: 8,
    paddingBottom: 8,
  },
  categories: {
    paddingHorizontal: 16,
    gap: 16,
  },
  categoryButton: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  catalogList: {
    paddingHorizontal: 16,
    paddingTop: 24,
    gap: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  sectionTime: {
    fontSize: 12,
    fontWeight: '500',
  },
  catalogItem: {
    flexDirection: 'row',
    gap: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  catalogImageContainer: {
    width: 96,
    height: 96,
    borderRadius: 12,
    overflow: 'hidden',
  },
  catalogImage: {
    width: '100%',
    height: '100%',
  },
  catalogContent: {
    flex: 1,
    justifyContent: 'space-between',
    gap: 4,
  },
  catalogHeader: {
    marginBottom: 4,
  },
  catalogTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  vegIndicator: {
    width: 16,
    height: 16,
    borderRadius: 2,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vegIndicatorInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  catalogName: {
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 20,
  },
  catalogDesc: {
    fontSize: 12,
    marginBottom: 8,
  },
  catalogFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  catalogPrice: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

