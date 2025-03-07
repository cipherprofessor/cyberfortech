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