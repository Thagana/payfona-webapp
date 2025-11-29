export const antdTheme = {
  token: {
    // Primary colors
    colorPrimary: "#31004a",
    colorSuccess: "#198754",
    colorWarning: "#ffc107",
    colorError: "#dc3545",
    colorInfo: "#0dcaf0",

    // Font family
    fontFamily: '"Red Hat Mono", monospace',
    fontSize: 16, // 1rem
    fontWeightStrong: 700,

    // Border radius
    borderRadius: 4, // 0.25rem
    borderRadiusLG: 8, // 0.5rem
    borderRadiusSM: 3, // 0.2rem

    // Background colors
    colorBgContainer: "#ffffff",
    colorBgLayout: "#ffffff",
    colorBgElevated: "#ffffff",

    // Text colors
    colorText: "#1c002b", // $dark
    colorTextHeading: "#31004a", // $primary for headings
    colorTextSecondary: "rgba(28, 0, 43, 0.65)",

    // Border colors
    colorBorder: "#c399d1", // $primary-200
    colorBorderSecondary: "#e1cce8", // $primary-100

    // Line height
    lineHeight: 1.5,
    lineHeightHeading: 1.5,

    // Link colors
    colorLink: "#31004a",
    colorLinkHover: "#1c002b",
    colorLinkActive: "#1c002b",
  },

  components: {
    // Card - matches your .card styles
    Card: {
      headerBg: "#e1cce8", // $primary-100
      colorBorderSecondary: "#c399d1", // $primary-200
      boxShadowTertiary: "0 2px 5px rgba(49, 0, 74, 0.1)",
    },

    // Table - matches your .table styles
    Table: {
      headerBg: "#e1cce8", // $primary-100
      headerColor: "#0e0015", // $primary-700
      rowHoverBg: "rgba(195, 153, 209, 0.5)", // $primary-200 with 0.5 opacity
      rowSelectedBg: "rgba(225, 204, 232, 0.4)", // $primary-100 with 0.4 opacity
      colorBorderSecondary: "#c399d1",
    },

    // Button - matches your Bootstrap button styles
    Button: {
      primaryColor: "#ffffff",
      primaryShadow: "0 0 0 0.25rem rgba(49, 0, 74, 0.25)",
      defaultBorderColor: "#c399d1",
      defaultColor: "#31004a",
      fontWeight: 400,
      fontWeightStrong: 700,
    },

    // Input - matches your .form-control:focus
    Input: {
      activeShadow: "0 0 0 0.25rem rgba(49, 0, 74, 0.25)",
      hoverBorderColor: "#31004a",
      activeBorderColor: "#31004a",
      colorBorder: "#c399d1",
    },

    // Select
    Select: {
      activeShadow: "0 0 0 0.25rem rgba(49, 0, 74, 0.25)",
      colorBorder: "#c399d1",
    },

    // Dropdown - matches your .dropdown-item
    Dropdown: {
      controlItemBgActive: "#31004a",
      controlItemBgHover: "rgba(49, 0, 74, 0.1)",
      colorPrimary: "#31004a",
    },

    // Menu
    Menu: {
      itemSelectedBg: "#e1cce8",
      itemSelectedColor: "#31004a",
      itemActiveBg: "rgba(49, 0, 74, 0.1)",
      itemHoverBg: "rgba(49, 0, 74, 0.05)",
    },

    // Pagination - matches your .pagination styles
    Pagination: {
      itemActiveBg: "#31004a",
      itemLinkBg: "#ffffff",
      itemActiveBgDisabled: "#c399d1",
      colorPrimary: "#31004a",
      colorPrimaryHover: "#1c002b",
    },

    // Badge - matches your .badge styles
    Badge: {
      colorPrimary: "#31004a",
      colorError: "#dc3545",
      colorSuccess: "#198754",
      colorWarning: "#ffc107",
      colorInfo: "#0dcaf0",
    },

    // Progress - matches your .progress-bar
    Progress: {
      defaultColor: "#31004a",
      remainingColor: "#e1cce8",
    },

    // Alert - matches your .alert-primary
    Alert: {
      colorInfoBg: "#e1cce8", // $primary-100
      colorInfoBorder: "#c399d1", // $primary-200
      colorInfoText: "#0a0010", // $primary-800
      colorSuccessBg: "#d1e7dd",
      colorWarningBg: "#fff3cd",
      colorErrorBg: "#f8d7da",
    },

    // Tabs
    Tabs: {
      itemSelectedColor: "#31004a",
      itemHoverColor: "#1c002b",
      inkBarColor: "#31004a",
    },

    // Modal
    Modal: {
      headerBg: "#e1cce8",
      colorBgElevated: "#ffffff",
    },

    // Tooltip
    Tooltip: {
      colorBgSpotlight: "#31004a",
      zIndexPopup: 1070,
    },

    // Popover
    Popover: {
      zIndexPopup: 1060,
    },

    // Switch
    Switch: {
      colorPrimary: "#31004a",
      colorPrimaryHover: "#1c002b",
    },

    // Radio & Checkbox
    Radio: {
      colorPrimary: "#31004a",
    },
    Checkbox: {
      colorPrimary: "#31004a",
    },

    // DatePicker
    DatePicker: {
      activeShadow: "0 0 0 0.25rem rgba(49, 0, 74, 0.25)",
      colorBorder: "#c399d1",
    },

    // Slider
    Slider: {
      trackBg: "#31004a",
      trackHoverBg: "#1c002b",
      handleColor: "#31004a",
    },
  },
};

// Optional: Export color palette for use elsewhere
export const colorPalette = {
  primary: "#31004a",
  secondary: "#6e1aa0",
  tertiary: "#aa53dc",
  success: "#198754",
  info: "#0dcaf0",
  warning: "#ffc107",
  danger: "#dc3545",
  light: "#f8f9fa",
  dark: "#1c002b",

  // Primary shades
  primary100: "#e1cce8",
  primary200: "#c399d1",
  primary300: "#a566ba",
  primary400: "#8733a3",
  primary500: "#31004a",
  primary600: "#27003b",
  primary700: "#1d002c",
  primary800: "#14001e",
  primary900: "#0a000f",
};
