import { useRef } from "react";

const SectionHeader = () => {
  const ref = useRef<HTMLIFrameElement>(null);
  function onLoad() {
    if (ref.current) {
      ref.current.style.height = ref.current.contentWindow?.document.documentElement.scrollHeight + "px";
    }
  }
  return (
    <iframe
      ref={ref}
      src="/section-hero.html"
      scrolling="no"
      height="960px"
      width="100%"
      frameBorder="0"
      onLoad={onLoad}
    />
  );
};

export default SectionHeader;
