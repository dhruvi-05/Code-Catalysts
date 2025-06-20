import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  const now = new Date();
  const diffInHours = Math.abs(now.getTime() - d.getTime()) / (1000 * 60 * 60);
  
  if (diffInHours < 1) {
    return 'Just now';
  } else if (diffInHours < 24) {
    return `${Math.floor(diffInHours)}h`;
  } else if (diffInHours < 24 * 7) {
    return `${Math.floor(diffInHours / 24)}d`;
  } else {
    return d.toLocaleDateString();
  }
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

export function generateColor(index: number): string {
  const colors = [
    'hsl(207, 90%, 54%)', // LinkedIn blue
    'hsl(154, 87%, 40%)', // Green
    'hsl(271, 91%, 65%)', // Purple  
    'hsl(25, 95%, 53%)',  // Orange
    'hsl(348, 83%, 60%)', // Red
    'hsl(48, 96%, 53%)',  // Yellow
  ];
  return colors[index % colors.length];
}

export function calculateSkillGrowth(timeline: Array<{ level: number; recordedAt: Date }>): number {
  if (timeline.length < 2) return 0;
  
  const sorted = timeline.sort((a, b) => new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime());
  const first = sorted[0];
  const last = sorted[sorted.length - 1];
  
  return last.level - first.level;
}

export function groupBy<T, K extends keyof any>(array: T[], key: (item: T) => K): Record<K, T[]> {
  return array.reduce((groups, item) => {
    const group = key(item);
    groups[group] = groups[group] || [];
    groups[group].push(item);
    return groups;
  }, {} as Record<K, T[]>);
}
