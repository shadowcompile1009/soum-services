interface SVGProps extends SVGProps<SVGSVGElement> {
  icon: string;
  strokeWidth?: number;
}

declare module 'react-image-gallery/src/components/SVG' {
  const content: React.FC<SVGProps>;
  export default content;
}
