import styled, { createGlobalStyle, css } from "styled-components";
import { device } from "./BreakPoints";
import fontsCss from "./fonts.module.css";

export const GlobalStyles = createGlobalStyle`
 ${fontsCss} // this works as a normal styled css
 
/* Box sizing rules */
*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  font-size: 100%;
}

body {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
  min-height: 100vh;
  text-rendering: optimizeSpeed;
  font-family: ${({ theme }) => theme.fonts.anekMalayalam}, sans-serif;
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.themeText};
  background: ${({ theme }) => theme.colors.background};
  line-height: 1;
  overflow-x: hidden;
  position: relative;
}
h1,
h2,
h3,
h4,
h5,
h6,
p,
ul,
figure,
blockquote,
dl,
caption,
dd {
  padding: 0;
  margin: 0;
}
button {
  border: none;
  background-color: transparent;
  font-family: inherit;
  padding: 0;
  cursor: pointer;
}
/* Remove list styles on ul, ol elements with a list role, which suggests default styling will be removed */
ul[role="list"],
ol[role="list"] {
  list-style: none;
}
li {
  list-style-type: none;
}
/* Set core root defaults */
html:focus-within {
  scroll-behavior: smooth;
}
/* A elements that don't have a class get default styles */
a:not([class]) {
  text-decoration-skip-ink: auto;
}

/* Make images easier to work with */
img,
picture {
  max-width: 100%;
  display: block;
}

/* Inherit fonts for inputs and buttons */
input,
button,
textarea,
select {
  font: inherit;
}
/* Remove all animations, transitions and smooth scroll for people that prefer not to see them */
@media (prefers-reduced-motion: reduce) {
  html:focus-within {
    scroll-behavior: auto;
  }

  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
`;

export const Container = styled.div`
  width: 100%;
  max-width: 1360px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.paddings.container};
`;

export const Box = styled.div`
  margin-top: calc(${({ mt }) => mt} * 1px);
  ${({ flxRight }) =>
    flxRight &&
    css`
      display: flex;
      justify-content: flex-end;
    `}
`;

export const PageCenter = styled.div`
  background: ${({ light, theme }) =>
    light ? `${theme.colors.background}` : `${theme.colors.themeGradient}`};
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  padding-top: 50px;
  ${({ justifyCenter }) =>
    justifyCenter &&
    css`
      justify-content: center;
    `}
`;

export const Flex = styled.div`
  display: flex;
  ${({ center }) =>
    center &&
    css`
      justify-content: center;
      align-items: center;
    `}
  ${({ spaceBetween }) =>
    spaceBetween &&
    css`
      justify-content: space-between;
      align-items: center;
    `}
  ${({ flxEnd }) =>
    flxEnd &&
    css`
      justify-content: flex-end;
      align-items: center;
    `}
  ${({ gap }) =>
    gap &&
    css`
      gap: ${gap};
    `}
`;

export const CenterCardContainer = styled.div`
  background: ${({ theme }) => theme.colors.cardBackground};
  border-radius: 4px;
  min-width: 773px;
  min-height: 620px;
  padding: 50px 10px 60px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  @media ${device.md} {
    min-width: 100%;
  }
`;

export const HighlightedText = styled.span`
  color: ${({ themeText, theme }) =>
    themeText ? theme.colors.themeText : theme.colors.themeColor};
`;

export const LogoContainer = styled.div`
  text-align: center;
  margin-bottom: 50px;
  @media ${device.md} {
    margin-bottom: 30px;
  }
  svg {
    width: 220px;
    rect {
      stroke: ${({ theme }) => theme.colors.appLogo};
    }
    path {
      fill: ${({ theme }) => theme.colors.appLogo};
    }
  }
`;

export const ResizableBox = styled.div`
  width: ${(props) => (typeof props.width === "string" ? props.width : `${props.width}px`)};
`;
