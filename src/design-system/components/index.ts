/**
 * Design System — Component library barrel.
 * Import from "@/design-system/components".
 */
export { DesignText } from "./Text";
export type { TextProps as DesignTextProps } from "./Text";
export type { TypeRole as TextRole } from "@/design-system/typography";
export { PressableScale, FadeInView } from "./Motion";
export { Button } from "./Button";
export type { ButtonProps, ButtonVariant, ButtonSize } from "./Button";
export { Card } from "./Card";
export type { CardProps, CardVariant, CardPadding } from "./Card";
export { Chip } from "./Chip";
export type { ChipProps } from "./Chip";
export { Badge, Tag } from "./Badge";
export type { BadgeProps, TagProps } from "./Badge";
export { Avatar } from "./Avatar";
export type { AvatarProps, AvatarSize } from "./Avatar";
export { SectionHeader } from "./SectionHeader";
export type { SectionHeaderProps } from "./SectionHeader";
export { AppContainer, AppHeader } from "./Screen";
export type { AppContainerProps, AppHeaderProps } from "./Screen";
export { KeyboardScrollView, useRegisterFocusedInput } from "./KeyboardScrollView";
export type { KeyboardScrollViewProps } from "./KeyboardScrollView";
export { SearchBar } from "./SearchBar";
export type { SearchBarProps } from "./SearchBar";
export { EmptyState } from "./EmptyState";
export type { EmptyStateProps } from "./EmptyState";
export { Skeleton, CardSkeleton, LoadingSkeleton } from "./Skeleton";
export { ErrorState, RetryView } from "./ErrorState";
export type { ErrorStateProps } from "./ErrorState";
export { BottomSheet } from "./Modal";
export type { BottomSheetProps } from "./Modal";
export { ToastProvider, useToast } from "./Toast";

export { ProgressRing, ProgressBar } from "./Progress";
export type { ProgressRingProps, ProgressBarProps } from "./Progress";
export { StatCard, QuickActionButton } from "./StatCard";
export type { StatCardProps, QuickActionProps } from "./StatCard";
export { HighlightCard } from "./HighlightCard";
export type { HighlightCardProps } from "./HighlightCard";
export { HeroCard } from "./HeroCard";
export type { HeroCardProps } from "./HeroCard";
export { AttendanceCard } from "./AttendanceCard";
export type { AttendanceSnapshot } from "./AttendanceCard";
export { HomeworkCard } from "./HomeworkCard";
export { ExamResultCard, ExamSection } from "./ExamCard";
export type { ExamSectionProps } from "./ExamCard";
export { FeeSummaryCard, FeeItemCard } from "./FeeCard";
export { NotificationCard, CircularCard } from "./NotificationCard";
export { CalendarEventCard, AchievementCard } from "./CalendarCard";
export type { AchievementItem } from "./CalendarCard";
export { TransportCard } from "./TransportCard";
export type { TransportSnapshot } from "./TransportCard";
export { FloatingActionButton } from "./FloatingActionButton";
export type { FABProps } from "./FloatingActionButton";