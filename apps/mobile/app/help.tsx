import { useState } from 'react';
import { Linking, ScrollView, StyleSheet, View } from 'react-native';
import type { IconName } from '@rwm/icons';
import { Icon } from '../src/Icon';
import { PressableScale, ScreenHeader, T } from '../src/ui';
import { SUPPORT_EMAIL, SUPPORT_PHONE } from '../src/support';
import { layout } from '../src/theme';
import { useColors } from '../src/ThemeProvider';

const FAQ = [
  { q: 'How do I buy a vehicle?', a: 'Open a listing, choose Buy, then follow checkout: your details, payment method, and a final review. Every listing carries an inspection report.' },
  { q: 'How do auctions work?', a: 'Place a bid at or above the minimum shown. If someone outbids you, you can bid again until the countdown ends. The highest bid at the end wins.' },
  { q: 'Can I rent or lease instead of buying?', a: 'Yes. Listings that allow it show Rent or Lease. Pick the mode on the vehicle page and choose how many days or months you need.' },
  { q: 'How do I track my order?', a: 'Go to Profile, then My orders. Each order shows its stage, from payment to final inspection, delivery and completion.' },
];

function Faq({ q, a, first }: { q: string; a: string; first: boolean }) {
  const colors = useColors();
  const [open, setOpen] = useState(false);
  return (
    <PressableScale onPress={() => setOpen((o) => !o)} accessibilityRole="button" accessibilityState={{ expanded: open }} accessibilityLabel={q} style={{ paddingVertical: 20, paddingHorizontal: 20, gap: 10, borderTopWidth: first ? 0 : StyleSheet.hairlineWidth, borderTopColor: colors.border }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <T style={{ flex: 1 }}>{q}</T>
        <Icon name={open ? 'minus' : 'plus'} size={18} color={colors.text3} />
      </View>
      {open && <T color={colors.text2}>{a}</T>}
    </PressableScale>
  );
}

export default function Help() {
  const colors = useColors();
  const contacts: { icon: IconName; label: string; sub: string; url: string }[] = [
    { icon: 'mail', label: 'Email support', sub: SUPPORT_EMAIL, url: `mailto:${SUPPORT_EMAIL}?subject=RideWithMe%20support` },
    ...(SUPPORT_PHONE ? [{ icon: 'phone' as IconName, label: 'Call us', sub: SUPPORT_PHONE, url: `tel:${SUPPORT_PHONE}` }] : []),
  ];
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader title="Help and support" />
      <ScrollView contentContainerStyle={{ padding: layout.gutter, paddingBottom: 48, gap: layout.section }}>
        <View style={{ gap: 14 }}>
          <T v="title">Common questions</T>
          <View style={{ borderRadius: 24, backgroundColor: colors.surface1, overflow: 'hidden' }}>
            {FAQ.map((f, i) => <Faq key={f.q} q={f.q} a={f.a} first={i === 0} />)}
          </View>
        </View>
        <View style={{ gap: 14 }}>
          <T v="title">Contact us</T>
          <View style={{ borderRadius: 24, backgroundColor: colors.surface1, overflow: 'hidden' }}>
            {contacts.map((c, i) => (
              <PressableScale key={c.label} onPress={() => { Linking.openURL(c.url).catch(() => {}); }} accessibilityRole="link" accessibilityLabel={c.label} style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 20, paddingHorizontal: 20, borderTopWidth: i ? StyleSheet.hairlineWidth : 0, borderTopColor: colors.border }}>
                <Icon name={c.icon} size={20} color={colors.text2} />
                <View style={{ flex: 1 }}><T>{c.label}</T><T v="caption" color={colors.text3}>{c.sub}</T></View>
                <Icon name="chevronRight" size={18} color={colors.text3} />
              </PressableScale>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
