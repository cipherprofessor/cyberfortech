/**
 * Converts a hex color string to RGB values for CSS variables
 * @param hex Color in hexadecimal format (e.g., "#007bff")
 * @returns RGB values as a string (e.g., "0, 123, 255")
 */
export const hexToRgb = (hex: string): string => {
    // Remove the # if present
    const sanitizedHex = hex.startsWith('#') ? hex.slice(1) : hex;
    
    // Parse the hex values
    const r = parseInt(sanitizedHex.slice(0, 2), 16);
    const g = parseInt(sanitizedHex.slice(2, 4), 16);
    const b = parseInt(sanitizedHex.slice(4, 6), 16);
    
    // Return as RGB string
    return `${r}, ${g}, ${b}`;
  };
  
  /**
   * Creates CSS variables for a color and its RGB values
   * @param color Color in hexadecimal format
   * @returns Object with CSS variable styles
   */
  export const createColorVars = (color: string): React.CSSProperties => {
    return {
      '--service-color': color,
      '--service-color-rgb': hexToRgb(color)
    } as React.CSSProperties;
  };
  
  /**
   * Determines if a color is light or dark
   * @param hex Color in hexadecimal format
   * @returns boolean - true if color is light, false if dark
   */
  export const isLightColor = (hex: string): boolean => {
    const rgb = hexToRgb(hex).split(',').map(Number);
    // Calculate relative luminance using the formula
    // Luminance = 0.299*R + 0.587*G + 0.114*B
    const luminance = (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) / 255;
    return luminance > 0.5;
  };
  
  /**
   * Creates a contrasting text color based on background color
   * @param bgColor Background color in hexadecimal format
   * @returns Contrasting text color (black or white)
   */
  export const getContrastColor = (bgColor: string): string => {
    return isLightColor(bgColor) ? '#000000' : '#ffffff';
  };
  
  /**
   * Creates a lighter version of a color
   * @param hex Color in hexadecimal format
   * @param amount Amount to lighten (0-1)
   * @returns Lightened color in hex format
   */
  export const lightenColor = (hex: string, amount: number = 0.2): string => {
    const rgb = hexToRgb(hex).split(',').map(Number);
    
    // Lighten each channel
    const r = Math.min(255, Math.round(rgb[0] + (255 - rgb[0]) * amount));
    const g = Math.min(255, Math.round(rgb[1] + (255 - rgb[1]) * amount));
    const b = Math.min(255, Math.round(rgb[2] + (255 - rgb[2]) * amount));
    
    // Convert back to hex
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };
  
  /**
   * Creates a darker version of a color
   * @param hex Color in hexadecimal format
   * @param amount Amount to darken (0-1)
   * @returns Darkened color in hex format
   */
  export const darkenColor = (hex: string, amount: number = 0.2): string => {
    const rgb = hexToRgb(hex).split(',').map(Number);
    
    // Darken each channel
    const r = Math.max(0, Math.round(rgb[0] * (1 - amount)));
    const g = Math.max(0, Math.round(rgb[1] * (1 - amount)));
    const b = Math.max(0, Math.round(rgb[2] * (1 - amount)));
    
    // Convert back to hex
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };