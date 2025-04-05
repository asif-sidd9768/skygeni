import { useContext } from "react";
import { ThemeContext } from "../theme/ThemeContext";

export const useThemeContext = () => useContext(ThemeContext);
