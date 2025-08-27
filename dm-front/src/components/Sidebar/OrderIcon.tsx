interface OrderIconProps {
  width?: number;
  strokeWidth?: number;
}

export function OrderIcon(props: OrderIconProps) {
  const { width = 24, strokeWidth = 1.5 } = props;
  return (
    <svg
      width={width}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15.716 16.223h-7.22M15.716 12.037h-7.22M11.252 7.86H8.497"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        clipRule="evenodd"
        d="m15.909 2.75-7.689.004c-2.76.017-4.469 1.833-4.469 4.603v9.196c0 2.784 1.722 4.607 4.506 4.607l7.689-.003c2.76-.017 4.47-1.834 4.47-4.604V7.357c0-2.784-1.723-4.607-4.507-4.607Z"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
