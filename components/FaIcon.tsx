import type { CSSProperties } from "react";

type FaIconProps = {
  icon: string;
  className?: string;
  style?: CSSProperties;
  brand?: boolean;
};

export default function FaIcon({ icon, className = "", style, brand = false }: FaIconProps) {
  const prefix = brand ? "fa-brands" : "fa-solid";
  return <i className={`${prefix} fa-${icon} ${className}`.trim()} style={style} aria-hidden />;
}
