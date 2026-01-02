import React, { useState } from 'react';
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
import { getFormattedDate, getWeekDays } from '@/utils/date-utils';
import { getDayMenu } from '@/constants/mock-data';
import { useTranslation } from 'react-i18next';
import { translateMenuItem, translateDescription } from '@/utils/translations';

const MAX_WIDTH = 448;

export default function WeeklyScreen() {
  const { colorScheme } = useAppearance();
  const { t, i18n } = useTranslation();
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const currentLang = i18n.language;
  const weekDays = getWeekDays();
  const today = getFormattedDate(new Date(), t);
  const todayDay = weekDays.find((d) => d.isToday);
  const [selectedDay, setSelectedDay] = useState(
    todayDay?.shortName || weekDays[2].shortName
  );

  const selectedDayData = weekDays.find((d) => d.shortName === selectedDay) || weekDays[0];
  const selectedDayKey = selectedDayData.dayKey || 'monday';
  const dayMenu = getDayMenu(selectedDayKey);

  const breakfastItems = [
    {
      id: 'veg-breakfast',
      name: translateMenuItem(dayMenu.veg.breakfast.item),
      price: t('common.price', { price: dayMenu.veg.breakfast.price }),
      image: dayMenu.veg.breakfast.image,
      description: translateDescription(dayMenu.veg.breakfast.item, dayMenu.veg.breakfast.description),
      isVeg: true,
    },
    {
      id: 'nonveg-breakfast',
      name: translateMenuItem(dayMenu.nonVeg.breakfast.item),
      price: t('common.price', { price: dayMenu.nonVeg.breakfast.price }),
      image: dayMenu.nonVeg.breakfast.image,
      description: translateDescription(dayMenu.nonVeg.breakfast.item, dayMenu.nonVeg.breakfast.description),
      isVeg: false,
    },
  ];

  const lunchItems = [
    {
      id: 'veg-lunch',
      name: translateMenuItem(dayMenu.veg.lunch.item),
      price: t('common.price', { price: dayMenu.veg.lunch.price }),
      image: dayMenu.veg.lunch.image,
      description: translateDescription(dayMenu.veg.lunch.item, dayMenu.veg.lunch.description),
      isVeg: true,
    },
    {
      id: 'nonveg-lunch',
      name: translateMenuItem(dayMenu.nonVeg.lunch.item),
      price: t('common.price', { price: dayMenu.nonVeg.lunch.price }),
      image: dayMenu.nonVeg.lunch.image,
      description: translateDescription(dayMenu.nonVeg.lunch.item, dayMenu.nonVeg.lunch.description),
      isVeg: false,
    },
  ];

  const renderMenuItem = (item: typeof breakfastItems[0]) => (
    <View
      key={item.id}
      style={[
        styles.menuItem,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
    >
      <ExpoImage
        source={{ uri: item.image }}
        style={styles.menuItemImage}
        contentFit="cover"
      />
      <View style={styles.menuItemContent}>
        <View style={styles.menuItemHeader}>
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
          <Text style={[styles.menuItemName, { color: colors.text }]} numberOfLines={1}>
            {item.name}
          </Text>
        </View>
        <Text style={[styles.menuItemDesc, { color: colors.subtext }]}>
          {item.description}
        </Text>
        <Text style={[styles.menuItemPrice, { color: colors.primary }]}>
          {item.price}
        </Text>
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
      {/* Header */}
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
            {t('common.planWeek')}{'\n'}
            <Text style={{ color: colors.primary }}>{t('common.checkMenu')}</Text>
          </Text>
        </View>
      </View>

      {/* Main Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Day Selector */}
        <View style={styles.daySelectorContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.daySelector}
          >
          {weekDays.map((day) => {
            const dayTranslationKey = day.dayKey.substring(0, 3);
            const translatedDayName = t(`days.${dayTranslationKey}`, { defaultValue: day.shortName });
            return (
              <TouchableOpacity
                key={day.shortName}
                onPress={() => setSelectedDay(day.shortName)}
                style={[
                  styles.dayButton,
                  selectedDay === day.shortName && {
                    backgroundColor: colors.primary,
                    borderWidth: 0,
                  },
                  selectedDay !== day.shortName && {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  },
                ]}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.dayText,
                    selectedDay === day.shortName && {
                      color: '#ffffff',
                      fontSize: 14,
                      fontWeight: 'bold',
                    },
                    selectedDay !== day.shortName && {
                      color: colors.subtext,
                      fontWeight: '500',
                    },
                  ]}
                >
                  {translatedDayName}
                </Text>
              </TouchableOpacity>
            );
          })}
          </ScrollView>
        </View>
        {/* Breakfast Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIcon, { backgroundColor: `${colors.primary}1A` }]}>
              <MaterialIcons name="bakery-dining" size={20} color={colors.primary} />
            </View>
            <View>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('common.breakfast')}</Text>
              <Text style={[styles.sectionTime, { color: colors.subtext }]}>
                {t('time.breakfast')}
              </Text>
            </View>
          </View>
          <View style={styles.menuList}>
            {breakfastItems.map(renderMenuItem)}
          </View>
        </View>

        {/* Lunch Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIcon, { backgroundColor: `${colors.primary}1A` }]}>
              <MaterialIcons name="lunch-dining" size={20} color={colors.primary} />
            </View>
            <View>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('common.lunch')}</Text>
              <Text style={[styles.sectionTime, { color: colors.subtext }]}>
                {t('time.lunch')}
              </Text>
            </View>
          </View>
          <View style={styles.menuList}>
            {lunchItems.map(renderMenuItem)}
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
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
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
  daySelectorContainer: {
    marginBottom: 24,
  },
  daySelector: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 8,
  },
  dayButton: {
    minWidth: 72,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  dayText: {
    fontSize: 12,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 20,
  },
  sectionTime: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
  menuList: {
    gap: 16,
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
    borderRadius: 32,
  },
  menuItemContent: {
    flex: 1,
    minWidth: 0,
  },
  menuItemHeader: {
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
  menuItemName: {
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 20,
  },
  menuItemDesc: {
    fontSize: 12,
    marginBottom: 4,
  },
  menuItemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 4,
  },
});

