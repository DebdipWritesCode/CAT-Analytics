// Vibrant color palette for charts
// All colors are optimized for dark theme visibility

export const CHART_COLORS = {
  // Primary vibrant colors
  primary: [
    '#3b82f6', // Blue
    '#10b981', // Green
    '#f59e0b', // Orange/Amber
    '#8b5cf6', // Purple
    '#ef4444', // Red
  ],
  
  // Secondary vibrant colors
  secondary: [
    '#06b6d4', // Cyan
    '#ec4899', // Pink
    '#14b8a6', // Teal
    '#f97316', // Orange
    '#a855f7', // Violet
  ],
  
  // Extended palette for more series
  extended: [
    '#3b82f6', // Blue
    '#10b981', // Green
    '#f59e0b', // Amber
    '#8b5cf6', // Purple
    '#ef4444', // Red
    '#06b6d4', // Cyan
    '#ec4899', // Pink
    '#14b8a6', // Teal
    '#f97316', // Orange
    '#a855f7', // Violet
    '#22c55e', // Emerald
    '#eab308', // Yellow
  ],
  
  // Section-specific colors
  sections: {
    VARC: '#3b82f6',      // Blue
    DILR: '#10b981',      // Green
    QA: '#f59e0b',        // Orange/Amber
  },
  
  // Semantic colors
  semantic: {
    positive: '#10b981',  // Green
    negative: '#ef4444',  // Red
    warning: '#f59e0b',   // Orange
    info: '#3b82f6',      // Blue
    neutral: '#8b5cf6',   // Purple
  },
  
  // Stacked chart colors (complementary)
  stacked: {
    planned: '#3b82f6',    // Blue
    actual: '#10b981',    // Green
    wasted: '#ef4444',    // Red
    concept: '#8b5cf6',   // Purple
    silly: '#f59e0b',     // Orange
    reading: '#06b6d4',   // Cyan
    time: '#ec4899',      // Pink
  },
};

// Helper function to get color by index
export function getColor(
  index: number,
  palette: 'primary' | 'secondary' | 'extended' = 'primary'
): string {
  const colors = CHART_COLORS[palette];
  return colors[index % colors.length];
}

// Helper function to get section color
export function getSectionColor(section: 'VARC' | 'DILR' | 'QA'): string {
  return CHART_COLORS.sections[section];
}

// Default colors for charts
export const DEFAULT_CHART_COLORS = CHART_COLORS.primary;
