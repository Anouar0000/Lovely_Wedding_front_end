export const toCssSize = (value) => {
  if (value === undefined || value === null) {
    return undefined;
  }

  return typeof value === "number" ? `${value}px` : value;
};

export const boxStyle = (box = {}) => ({
  top: toCssSize(box.top),
  right: toCssSize(box.right),
  bottom: toCssSize(box.bottom),
  left: toCssSize(box.left),
  width: toCssSize(box.width),
  height: toCssSize(box.height),
  maxWidth: toCssSize(box.maxWidth),
  minHeight: toCssSize(box.minHeight),
  transform: box.transform,
  filter: box.filter,
  textAlign: box.textAlign,
});

export const textStyle = (style = {}) => ({
  color: style.color,
  fontFamily: style.fontFamily,
  fontSize: toCssSize(style.fontSize),
  fontWeight: style.fontWeight,
  fontStyle: style.fontStyle,
  lineHeight: style.lineHeight,
  letterSpacing: style.letterSpacing,
  textTransform: style.textTransform,
  textAlign: style.textAlign,
});
