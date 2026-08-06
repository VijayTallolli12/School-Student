/**
 * Design System — Motion Tokens.
 * Keep everything < 250ms, no flashy effects. Ease curves tuned for a
 * springy but premium feel.
 */
export const motion = {
  /** Fast micro-interactions: press, icon swap. */
  durationFast: 120,
  /** Standard: fade, reveal, sheet. */
  durationBase: 200,
  /** Slightly longer for hero/intro. */
  durationSlow: 260,

  easing: {
    /** Gentle ease-out for entrances. */
    easeOut: 0.22, // ~cubic-bezier(0.22, 1, 0.36, 1)
    /** Subtle overshoot for playful press. */
    press: 0.1,
    /** Linear for continuous loops (spinners). */
    linear: 0,
  },

  spring: {
    pressIn: { toValue: 1, mass: 0.4, damping: 14, stiffness: 260, useNativeDriver: true },
    pressOut: { toValue: 0, mass: 0.4, damping: 12, stiffness: 220, useNativeDriver: true },
    appear: { toValue: 1, mass: 0.8, damping: 16, stiffness: 180, useNativeDriver: true },
  },

  /** Stagger interval between sibling cards entering. */
  stagger: 45,

  /** Skeleton shimmer loop. */
  shimmerDuration: 1100,
} as const;

/** Allowed delay window for entrances. */
export const maxMotionDuration = motion.durationSlow;