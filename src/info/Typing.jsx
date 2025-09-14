import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

export default function TypingText({ text, startDelay = 1000, speed = 22, className }) {
  const [output, setOutput] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let mounted = true;
    let i = 0;
    let timer;

    const startTyping = () => {
      if (!mounted) return;

      if (i < text.length-1) {
        setOutput((prev) => prev + text[i]);
        i += 1;
        timer = setTimeout(startTyping, speed);
      } else {
        setIsTyping(false);
      }
    };

    // clear output when text changes
    setOutput("");
    setIsTyping(true);
    timer = setTimeout(startTyping, startDelay);

    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, [text, startDelay, speed]);

  return (
    <div className={className} aria-live="polite">
      <div className="type">
        {output}
        {isTyping ? <span className="caret" aria-hidden /> : null}
      </div>
    </div>
  );
}

TypingText.propTypes = {
  text: PropTypes.string.isRequired,
  startDelay: PropTypes.number,
  speed: PropTypes.number,
  className: PropTypes.string,
};
