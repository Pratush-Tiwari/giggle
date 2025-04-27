export const colors = {
  light: {
    primary: {
      50: '#f0f9ff', // Sky 50 - Lightest blue
      100: '#e0f2fe', // Sky 100 - Very light blue
      200: '#bae6fd', // Sky 200 - Light blue
      300: '#7dd3fc', // Sky 300 - Medium light blue
      400: '#38bdf8', // Sky 400 - Medium blue
      500: '#0ea5e9', // Sky 500 - Base blue
      600: '#0284c7', // Sky 600 - Dark blue
      700: '#0369a1', // Sky 700 - Darker blue
      800: '#075985', // Sky 800 - Very dark blue
      900: '#0c4a6e', // Sky 900 - Darkest blue
      950: '#082f49', // Sky 950 - Deepest blue
    },
    neutral: {
      50: '#f8fafc', // Slate 50 - Lightest gray
      100: '#f1f5f9', // Slate 100 - Very light gray
      200: '#e2e8f0', // Slate 200 - Light gray
      300: '#cbd5e1', // Slate 300 - Medium light gray
      400: '#94a3b8', // Slate 400 - Medium gray
      500: '#64748b', // Slate 500 - Base gray
      600: '#475569', // Slate 600 - Dark gray
      700: '#334155', // Slate 700 - Darker gray
      800: '#1e293b', // Slate 800 - Very dark gray
      900: '#0f172a', // Slate 900 - Darkest gray
      950: '#000000', // Slate 950 - Deepest gray
    },
    success: {
      50: '#f0fdf4', // Green 50 - Lightest green
      100: '#dcfce7', // Green 100 - Very light green
      200: '#bbf7d0', // Green 200 - Light green
      300: '#86efac', // Green 300 - Medium light green
      400: '#4ade80', // Green 400 - Medium green
      500: '#22c55e', // Green 500 - Base green
      600: '#16a34a', // Green 600 - Dark green
      700: '#15803d', // Green 700 - Darker green
      800: '#166534', // Green 800 - Very dark green
      900: '#14532d', // Green 900 - Darkest green
      950: '#052e16', // Green 950 - Deepest green
    },
    warning: {
      50: '#fffbeb', // Yellow 50 - Lightest yellow
      100: '#fef3c7', // Yellow 100 - Very light yellow
      200: '#fde68a', // Yellow 200 - Light yellow
      300: '#fcd34d', // Yellow 300 - Medium light yellow
      400: '#fbbf24', // Yellow 400 - Medium yellow
      500: '#f59e0b', // Yellow 500 - Base yellow
      600: '#d97706', // Yellow 600 - Dark yellow
      700: '#b45309', // Yellow 700 - Darker yellow
      800: '#92400e', // Yellow 800 - Very dark yellow
      900: '#78350f', // Yellow 900 - Darkest yellow
      950: '#451a03', // Yellow 950 - Deepest yellow
    },
    error: {
      50: '#fef2f2', // Red 50 - Lightest red
      100: '#fee2e2', // Red 100 - Very light red
      200: '#fecaca', // Red 200 - Light red
      300: '#fca5a5', // Red 300 - Medium light red
      400: '#f87171', // Red 400 - Medium red
      500: '#ef4444', // Red 500 - Base red
      600: '#dc2626', // Red 600 - Dark red
      700: '#b91c1c', // Red 700 - Darker red
      800: '#991b1b', // Red 800 - Very dark red
      900: '#7f1d1d', // Red 900 - Darkest red
      950: '#450a0a', // Red 950 - Deepest red
    },
  },
  dark: {
    primary: {
      50: '#082f49', // Darker blue for lightest
      100: '#0c4a6e', // Dark blue for very light
      200: '#075985', // Dark blue for light
      300: '#0369a1', // Dark blue for medium light
      400: '#0284c7', // Dark blue for medium
      500: '#0ea5e9', // Base blue stays same
      600: '#38bdf8', // Light blue for dark
      700: '#7dd3fc', // Lighter blue for darker
      800: '#bae6fd', // Very light blue for very dark
      900: '#e0f2fe', // Lightest blue for darkest
      950: '#f0f9ff', // Lightest blue for deepest
    },
    neutral: {
      50: '#0f172a', // Dark gray for lightest
      100: '#1e293b', // Dark gray for very light
      200: '#334155', // Dark gray for light
      300: '#475569', // Dark gray for medium light
      400: '#64748b', // Base gray stays same
      500: '#94a3b8', // Light gray for base
      600: '#cbd5e1', // Lighter gray for dark
      700: '#e2e8f0', // Very light gray for darker
      800: '#f1f5f9', // Lightest gray for very dark
      900: '#f8fafc', // Lightest gray for darkest
      950: '#ffffff', // White for deepest
    },
    success: {
      50: '#052e16', // Dark green for lightest
      100: '#14532d', // Dark green for very light
      200: '#166534', // Dark green for light
      300: '#15803d', // Dark green for medium light
      400: '#16a34a', // Dark green for medium
      500: '#22c55e', // Base green stays same
      600: '#4ade80', // Light green for dark
      700: '#86efac', // Lighter green for darker
      800: '#bbf7d0', // Very light green for very dark
      900: '#dcfce7', // Lightest green for darkest
      950: '#f0fdf4', // Lightest green for deepest
    },
    warning: {
      50: '#451a03', // Dark yellow for lightest
      100: '#78350f', // Dark yellow for very light
      200: '#92400e', // Dark yellow for light
      300: '#b45309', // Dark yellow for medium light
      400: '#d97706', // Dark yellow for medium
      500: '#f59e0b', // Base yellow stays same
      600: '#fbbf24', // Light yellow for dark
      700: '#fcd34d', // Lighter yellow for darker
      800: '#fde68a', // Very light yellow for very dark
      900: '#fef3c7', // Lightest yellow for darkest
      950: '#fffbeb', // Lightest yellow for deepest
    },
    error: {
      50: '#450a0a', // Dark red for lightest
      100: '#7f1d1d', // Dark red for very light
      200: '#991b1b', // Dark red for light
      300: '#b91c1c', // Dark red for medium light
      400: '#dc2626', // Dark red for medium
      500: '#ef4444', // Base red stays same
      600: '#f87171', // Light red for dark
      700: '#fca5a5', // Lighter red for darker
      800: '#fecaca', // Very light red for very dark
      900: '#fee2e2', // Lightest red for darkest
      950: '#fef2f2', // Lightest red for deepest
    },
  },
} as const;

export type ColorPalette = typeof colors;
