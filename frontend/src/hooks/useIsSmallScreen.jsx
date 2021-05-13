import { useMediaQuery } from "react-responsive";

export function useIsSmallScreen() {
    return useMediaQuery({ maxWidth: 800 });
}
