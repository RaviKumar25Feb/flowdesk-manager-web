import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollToTop({ scrollRef }) {
  const location = useLocation();

  useEffect(() => {
    if (!scrollRef?.current) return;

    if (location.state?.section === "password") {
      return;
    }

    scrollRef.current.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [location.pathname]);

  return null;
}

export default ScrollToTop;
