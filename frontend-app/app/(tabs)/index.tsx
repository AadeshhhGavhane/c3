import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
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
import { getTodayMenu } from '@/constants/mock-data';
import { capitalizeWords } from '@/utils/string-utils';
import { useTranslation } from 'react-i18next';
import { translateMenuItem, translateDescription } from '@/utils/translations';

const MAX_WIDTH = 448;

export default function TodayScreen() {
  const { colorScheme } = useAppearance();
  const { t, i18n } = useTranslation();
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const currentLang = i18n.language;
  
  const today = getFormattedDate(new Date(), t);
  const todayMenu = getTodayMenu();

  // Convert menu data to display format with translations
  const breakfastItems = [
    {
      id: 'veg-breakfast',
      name: translateMenuItem(todayMenu.veg.breakfast.item),
      price: t('common.price', { price: todayMenu.veg.breakfast.price }),
      image: todayMenu.veg.breakfast.image,
      description: translateDescription(todayMenu.veg.breakfast.item, todayMenu.veg.breakfast.description),
      badge: 'veg' as const,
      isLive: true,
    },
    {
      id: 'nonveg-breakfast',
      name: translateMenuItem(todayMenu.nonVeg.breakfast.item),
      price: t('common.price', { price: todayMenu.nonVeg.breakfast.price }),
      image: todayMenu.nonVeg.breakfast.image,
      description: translateDescription(todayMenu.nonVeg.breakfast.item, todayMenu.nonVeg.breakfast.description),
      badge: 'non-veg' as const,
    },
  ];

  const lunchItems = [
    {
      id: 'veg-lunch',
      name: translateMenuItem(todayMenu.veg.lunch.item),
      price: t('common.price', { price: todayMenu.veg.lunch.price }),
      image: todayMenu.veg.lunch.image,
      description: translateDescription(todayMenu.veg.lunch.item, todayMenu.veg.lunch.description),
      badge: 'veg' as const,
      isLive: true,
    },
    {
      id: 'nonveg-lunch',
      name: translateMenuItem(todayMenu.nonVeg.lunch.item),
      price: t('common.price', { price: todayMenu.nonVeg.lunch.price }),
      image: todayMenu.nonVeg.lunch.image,
      description: translateDescription(todayMenu.nonVeg.lunch.item, todayMenu.nonVeg.lunch.description),
      badge: 'non-veg' as const,
    },
  ];

  const getBadgeInfo = (badge?: string) => {
    switch (badge) {
      case 'chef-special':
        return { label: "Chef's Special", color: '#16a34a' };
      case 'bestseller':
        return { label: 'Bestseller', color: '#16a34a' };
      case 'veg':
        return { label: t('common.veg'), color: '#16a34a' };
      case 'non-veg':
        return { label: t('common.nonVeg'), color: '#dc2626' };
      default:
        return null;
    }
  };

  const renderMenuItem = (item: typeof breakfastItems[0]) => {
    const badgeInfo = getBadgeInfo(item.badge);
    return (
      <TouchableOpacity
        style={[
          styles.menuItem,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
        activeOpacity={0.7}
      >
        <ExpoImage
          source={{ uri: item.image }}
          style={styles.menuItemImage}
          contentFit="cover"
        />
        <View style={styles.menuItemContent}>
          <View style={styles.menuItemHeader}>
            {badgeInfo && (
              <View
                style={[
                  styles.vegIndicator,
                  { borderColor: badgeInfo.color },
                ]}
              >
                <View
                  style={[
                    styles.vegIndicatorInner,
                    { backgroundColor: badgeInfo.color },
                  ]}
                />
              </View>
            )}
            <Text style={[styles.menuItemName, { color: colors.text }]}>
              {item.name}
            </Text>
          </View>
          {item.description && (
            <Text style={[styles.menuItemDesc, { color: colors.subtext }]}>
              {item.description}
            </Text>
          )}
        </View>
        <View style={styles.menuItemPrice}>
          <Text style={[styles.menuItemPriceText, { color: colors.primary }]}>
            {item.price}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

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
      {/* Sticky Header */}
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
            {t('common.hungry')}{'\n'}
            <Text style={{ color: colors.primary }}>{t('common.whatsCooking')}</Text>
          </Text>
        </View>
      </View>

      {/* Main Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Breakfast Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <MaterialIcons name="bakery-dining" size={24} color={colors.primary} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('common.breakfast')}</Text>
            </View>
            <View style={[styles.timeBadge, { backgroundColor: `${colors.border}80` }]}>
              <Text style={[styles.timeText, { color: colors.subtext }]}>
                {t('time.breakfast')}
              </Text>
            </View>
          </View>
          <View style={styles.menuList}>
            {breakfastItems.map((item) => (
              <View key={item.id}>{renderMenuItem(item)}</View>
            ))}
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        {/* Lunch Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <MaterialIcons name="restaurant" size={24} color={colors.primary} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('common.lunch')}</Text>
            </View>
            <View style={[styles.timeBadge, { backgroundColor: `${colors.border}80` }]}>
              <Text style={[styles.timeText, { color: colors.subtext }]}>
                {t('time.lunch')}
              </Text>
            </View>
          </View>
          <View style={styles.menuList}>
            {lunchItems.map((item) => (
              <View key={item.id}>{renderMenuItem(item)}</View>
            ))}
          </View>
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
    marginBottom: 16,
  },
  headerDateContainer: {
    flex: 1,
    minWidth: 0,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
    gap: 32,
  },
  section: {
    gap: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  timeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  timeText: {
    fontSize: 12,
    fontWeight: '500',
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
  menuList: {
    gap: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  menuItemImage: {
    width: 64,
    height: 64,
    borderRadius: 12,
  },
  menuItemContent: {
    flex: 1,
    minWidth: 0,
  },
  menuItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  menuItemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  menuItemDesc: {
    fontSize: 12,
  },
  menuItemPrice: {
    alignItems: 'flex-end',
  },
  menuItemPriceText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    width: '100%',
  },
});
