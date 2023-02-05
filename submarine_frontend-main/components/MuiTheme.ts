import { green, grey } from "@mui/material/colors"
import { createTheme } from "@mui/material/styles"

/**
 * material-ui theme color pallete
 * @see https://material-ui.com/style/color/
 */

declare module '@mui/material/styles/createTheme' {
  interface Theme {
    syscolor: {
      light: React.CSSProperties['color'],
      dark: React.CSSProperties['color'],
      neutral: React.CSSProperties['color'],
      semi: React.CSSProperties['color']
    }
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    syscolor?: {
      light: React.CSSProperties['color'],
      dark: React.CSSProperties['color'],
      neutral: React.CSSProperties['color'],
      semi: React.CSSProperties['color']
    };
  }
}

const MuiTheme = createTheme({
  palette: {
    text: {
      primary: '#FFFFFF',
      secondary: '#AAAAAA',
      disabled: '#AAAAAA',
    },
    primary: {
      light: grey[700],
      main: grey[800],
      dark: grey[900],
    },
    secondary: {
      light: green[300],
      main: green[500],
      dark: green[700],
    },
  },
  syscolor: {
    light: '#00FFCE',
    dark: '#0F4339',
    neutral: '#007B64',
    semi: '#2F9BE9'
  }
})

export { MuiTheme } 