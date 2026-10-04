import { PrayerTimeItem } from '../types';

export function getTodayPrayerTimes(now: Date = new Date()): {
  prayers: PrayerTimeItem[];
  nextPrayer: PrayerTimeItem;
} {
  // Approximate standard prayer times for general educational prototype
  // 5 standard prayers
  const schedule = [
    { nameAr: 'صلاة الفجر', nameEn: 'Fajr', hours: 4, minutes: 45 },
    { nameAr: 'صلاة الشروق', nameEn: 'Sunrise', hours: 6, minutes: 12 },
    { nameAr: 'صلاة الظهر', nameEn: 'Dhuhr', hours: 12, minutes: 15 },
    { nameAr: 'صلاة العصر', nameEn: 'Asr', hours: 15, minutes: 30 },
    { nameAr: 'صلاة المغرب', nameEn: 'Maghrib', hours: 18, minutes: 0 },
    { nameAr: 'صلاة العشاء', nameEn: 'Isha', hours: 19, minutes: 30 },
  ];

  const currentHours = now.getHours();
  const currentMinutes = now.getMinutes();
  const currentTotalMinutes = currentHours * 60 + currentMinutes;

  let nextFound = false;
  let nextPrayerItem: PrayerTimeItem | null = null;

  const prayers: PrayerTimeItem[] = schedule.map((p) => {
    const prayerTotalMinutes = p.hours * 60 + p.minutes;
    const isPassed = currentTotalMinutes >= prayerTotalMinutes;
    let isNext = false;
    let remainingMinutes = 0;

    if (!isPassed && !nextFound) {
      isNext = true;
      nextFound = true;
      remainingMinutes = prayerTotalMinutes - currentTotalMinutes;
    }

    const timeString = `${p.hours % 12 || 12}:${p.minutes.toString().padStart(2, '0')} ${p.hours >= 12 ? 'م' : 'ص'}`;

    const item: PrayerTimeItem = {
      nameAr: p.nameAr,
      nameEn: p.nameEn,
      timeString,
      isPassed,
      isNext,
      remainingMinutes: isNext ? remainingMinutes : undefined,
    };

    if (isNext) {
      nextPrayerItem = item;
    }

    return item;
  });

  // If all prayers passed today, next prayer is Fajr tomorrow
  if (!nextPrayerItem) {
    const fajrMinutesTomorrow = (24 * 60 - currentTotalMinutes) + (4 * 60 + 45);
    nextPrayerItem = {
      nameAr: 'صلاة الفجر',
      nameEn: 'Fajr',
      timeString: '4:45 ص (غداً)',
      isPassed: false,
      isNext: true,
      remainingMinutes: fajrMinutesTomorrow,
    };
  }

  return {
    prayers,
    nextPrayer: nextPrayerItem,
  };
}

export function formatRemainingTime(minutes: number): string {
  if (minutes < 60) {
    return `متبقي ${minutes} دقيقة`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMins = minutes % 60;
  if (remainingMins === 0) {
    return `متبقي ${hours} ${hours === 1 ? 'ساعة' : hours === 2 ? 'ساعتان' : 'ساعات'}`;
  }
  return `متبقي ${hours} س و ${remainingMins} د`;
}
