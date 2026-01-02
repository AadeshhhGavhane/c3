import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, Modal, View, Text, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useAppearance } from '@/hooks/use-appearance';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';

export function LogoutButton() {
  const { colorScheme } = useAppearance();
  const colors = Colors[colorScheme];
  const { logout } = useAuth();
  const router = useRouter();
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);

  const handleLogout = async () => {
    try {
      setShowModal(false);
      await logout();
      router.replace('/auth/sign-in');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => setShowModal(true)}
        style={[styles.button, { backgroundColor: colors.surface, borderColor: colors.border }]}
        activeOpacity={0.7}
      >
        <MaterialIcons name="logout" size={20} color={colors.text} />
      </TouchableOpacity>

      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <Pressable
          style={[styles.modalOverlay, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}
          onPress={() => setShowModal(false)}
        >
          <Pressable
            style={[
              styles.modalContent,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {t('auth.logout')}
              </Text>
              <TouchableOpacity
                onPress={() => setShowModal(false)}
                style={styles.closeButton}
                activeOpacity={0.7}
              >
                <MaterialIcons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <Text style={[styles.modalMessage, { color: colors.text }]}>
                {t('auth.logoutConfirm')}
              </Text>
            </View>

            <View style={[styles.modalFooter, { borderTopColor: colors.border }]}>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  styles.cancelButton,
                  { backgroundColor: colors.background, borderColor: colors.border },
                ]}
                onPress={() => setShowModal(false)}
                activeOpacity={0.7}
              >
                <Text style={[styles.cancelButtonText, { color: colors.text }]}>
                  {t('auth.cancel')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.logoutButton, { backgroundColor: colors.primary }]}
                onPress={handleLogout}
                activeOpacity={0.7}
              >
                <Text style={styles.logoutButtonText}>{t('auth.logout')}</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  modalOverlay: {
    flex: 1,
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
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    padding: 16,
  },
  modalMessage: {
    fontSize: 16,
    lineHeight: 24,
  },
  modalFooter: {
    flexDirection: 'row',
    borderTopWidth: 1,
    padding: 16,
    gap: 12,
  },
  modalButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  cancelButton: {
    // Styled via backgroundColor and borderColor
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    // Styled via backgroundColor
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

