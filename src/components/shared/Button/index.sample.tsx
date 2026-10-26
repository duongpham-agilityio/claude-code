import type { ButtonHTMLAttributes } from "react";

interface ButtonSampleProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

export const ButtonSample = (props: ButtonSampleProps) => {
  return <button {...props} />;
};
