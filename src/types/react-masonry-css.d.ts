declare module 'react-masonry-css' {
  import * as React from 'react';
  
  export interface MasonryProps {
    breakpointCols?: number | { [key: string]: number };
    className?: string;
    columnClassName?: string;
    children?: React.ReactNode;
  }
  
  declare const Masonry: React.FC<MasonryProps>;
  
  export default Masonry;
} 