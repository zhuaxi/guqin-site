type GuqinGlyphProps = {
  name: string;
  size?: number;
};

function SvgWrap({
  children,
  size = 32,
}: {
  children: React.ReactNode;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{ display: "block" }}
    >
      {children}
    </svg>
  );
}

export default function GuqinGlyph({
  name,
  size = 32,
}: GuqinGlyphProps) {
  switch (name) {
    case "勾":
      return (
        <SvgWrap size={size}>
          <path
            d="M28 18 C58 18, 72 24, 72 48 C72 72, 56 84, 34 86"
            fill="none"
            stroke="#1f1712"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </SvgWrap>
      );

    case "抹":
      return (
        <SvgWrap size={size}>
          <path
            d="M30 18 L30 82"
            stroke="#1f1712"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M18 34 L78 28"
            stroke="#1f1712"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M22 58 L76 54"
            stroke="#1f1712"
            strokeWidth="8"
            strokeLinecap="round"
          />
        </SvgWrap>
      );

    case "挑":
      return (
        <SvgWrap size={size}>
          <path
            d="M32 18 L30 78"
            stroke="#1f1712"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M30 58 C48 52, 62 42, 78 20"
            fill="none"
            stroke="#1f1712"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </SvgWrap>
      );

    case "剔":
      return (
        <SvgWrap size={size}>
          <path
            d="M36 18 L36 78"
            stroke="#1f1712"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M62 20 L62 70"
            stroke="#1f1712"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M54 80 L74 60"
            stroke="#1f1712"
            strokeWidth="8"
            strokeLinecap="round"
          />
        </SvgWrap>
      );

    case "打":
      return (
        <SvgWrap size={size}>
          <path
            d="M48 18 L48 80"
            stroke="#1f1712"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M24 30 L74 30"
            stroke="#1f1712"
            strokeWidth="8"
            strokeLinecap="round"
          />
        </SvgWrap>
      );

    case "托":
      return (
        <SvgWrap size={size}>
          <path
            d="M46 18 L46 76"
            stroke="#1f1712"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M30 34 C40 26, 58 24, 70 28"
            fill="none"
            stroke="#1f1712"
            strokeWidth="8"
            strokeLinecap="round"
          />
        </SvgWrap>
      );

    case "劈":
      return (
        <SvgWrap size={size}>
          <path
            d="M32 18 L32 82"
            stroke="#1f1712"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M34 18 C62 18, 74 26, 74 44"
            fill="none"
            stroke="#1f1712"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </SvgWrap>
      );

    default:
      return (
        <div
          style={{
            width: size,
            height: size,
            fontSize: size * 0.8,
            lineHeight: `${size}px`,
            textAlign: "center",
            color: "#1f1712",
          }}
        >
          {name}
        </div>
      );
  }
}
