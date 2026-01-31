/**
 * Shared - Components - BottomSheet
 * 
 * Reusable bottom sheet component using @gorhom/bottom-sheet
 */

import React, {useCallback, useMemo, forwardRef} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import GorhomBottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
  BottomSheetProps as GorhomBottomSheetProps,
  BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import {useTheme} from '@shared/theme';

interface BottomSheetProps extends Partial<GorhomBottomSheetProps> {
  title?: string;
  snapPoints?: (string | number)[];
  enableDynamicSizing?: boolean;
  onClose?: () => void;
}

export const BottomSheet = forwardRef<GorhomBottomSheet, BottomSheetProps>(
  ({title, snapPoints: customSnapPoints, enableDynamicSizing, onClose, children, ...props}, ref) => {
    const {colors} = useTheme();

    // Default snap points
    const snapPoints = useMemo(
      () => customSnapPoints || ['25%', '50%', '90%'],
      [customSnapPoints],
    );

    // Backdrop component
    const renderBackdrop = useCallback(
      (backdropProps: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...backdropProps}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.5}
        />
      ),
      [],
    );

    // Handle close
    const handleClose = useCallback(() => {
      onClose?.();
    }, [onClose]);

    return (
      <GorhomBottomSheet
        ref={ref}
        index={-1}
        snapPoints={snapPoints}
        enableDynamicSizing={enableDynamicSizing}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        onClose={handleClose}
        backgroundStyle={{
          backgroundColor: colors.background.card,
        }}
        handleIndicatorStyle={{
          backgroundColor: colors.border.main,
        }}
        {...props}>
        <BottomSheetView style={styles.contentContainer}>
          {title && (
            <View style={styles.header}>
              <Text
                style={[
                  styles.title,
                  {color: colors.text.primary},
                ]}>
                {title}
              </Text>
            </View>
          )}
          {children}
        </BottomSheetView>
      </GorhomBottomSheet>
    );
  },
);

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
});

export default BottomSheet;
