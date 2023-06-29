import { useMediaQuery } from 'react-responsive';

export const useResponsive = () => {
  let isMobile = useMediaQuery({ maxDeviceWidth: 576 });
  let isTablet = useMediaQuery({ minDeviceWidth: 577 });
  let isDesktop = useMediaQuery({ minDeviceWidth: 769 });

  if(typeof document !== 'undefined') {
    const element = document.getElementById('logora_app');
    if (element) {
      const elementWidth =  element.getBoundingClientRect().width.toFixed(2);
      isMobile = elementWidth <= 576;
      isTablet = elementWidth > 576;
      isDesktop = elementWidth >= 769;
    }
  }

  return [isMobile, isTablet, isDesktop];
}