import React from "react";
import { useResponsive } from './useResponsive';

export const withResponsive = Component => props => {
    const [isMobile, isTablet, isDesktop] = useResponsive();
    
    return (
      <Component {...props} isMobile={isMobile} isTablet={isTablet} isDesktop={isDesktop} />
    )
}