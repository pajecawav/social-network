import { useMediaQuery } from "react-responsive";

export const useIsSmallScreen = () => {
    return useMediaQuery({ maxWidth: 768 });
};
