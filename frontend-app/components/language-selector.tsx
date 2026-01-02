import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Colors } from '@/constants/theme';
import { useAppearance } from '@/hooks/use-appearance';
import { changeLanguage } from '@/i18n/config';

interface Language {
  code: 'en' | 'hi' | 'mr';
  labelKey: string;
}

const languages: Language[] = [
  { code: 'en', labelKey: 'common.english' },
  { code: 'hi', labelKey: 'common.hindi' },
  { code: 'mr', labelKey: 'common.marathi' },
];

export function LanguageSelector() {
  const { colorScheme } = useAppearance();
  const { i18n, t } = useTranslation();
  const colors = Colors[colorScheme];
  const [modalVisible, setModalVisible] = useState(false);

  const currentLanguage = languages.find((lang) => lang.code === i18n.language) || languages[0];

  const handleSelectLanguage = async (code: 'en' | 'hi' | 'mr') => {
    await changeLanguage(code);
    setModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={[
          styles.button,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
        activeOpacity={0.7}
      >
        <Text style={[styles.buttonText, { color: colors.primary }]}>
          {t(currentLanguage.labelKey)}
        </Text>
        <MaterialIcons name="expand-more" size={16} color={colors.subtext} />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
            <View
            style={[
              styles.modalContent,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
            onStartShouldSetResponder={() => true}
          >
            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {t('common.selectLanguage')}
              </Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
                activeOpacity={0.7}
              >
                <MaterialIcons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <View style={styles.languageList}>
              {languages.map((language) => (
                <TouchableOpacity
                  key={language.code}
                  onPress={() => handleSelectLanguage(language.code)}
                  style={[
                    styles.languageItem,
                    i18n.language === language.code && {
                      backgroundColor: `${colors.primary}15`,
                    },
                  ]}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.languageText,
                      {
                        color:
                          i18n.language === language.code
                            ? colors.primary
                            : colors.text,
                        fontWeight: i18n.language === language.code ? 'bold' : '500',
                      },
                    ]}
                  >
                    {t(language.labelKey)}
                  </Text>
                  {i18n.language === language.code && (
                    <MaterialIcons name="check" size={20} color={colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  languageList: {
    padding: 8,
  },
  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginVertical: 4,
  },
  languageText: {
    fontSize: 16,
  },
});

