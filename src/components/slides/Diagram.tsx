/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

interface DiagramProps {
  imgLight: string;
  imgDark: string;
  alt: string;
  height: number;
  width: number;
  children: string;
  captionPosition: 'top' | 'bottom' | null;
}

function Caption({ text }: { text: string }) {
  return (
    <div className='mt-1'>
      <figcaption
        className='figure-caption fst-italic'
        //className2='p-1 sm:p-2 mt-0 sm:mt-0 text-gray-40 text-base lg:text-lg text-center leading-tight table-caption'
      >
        {text}
      </figcaption>
    </div>
  );
}

export function Diagram({
  imgLight,
  imgDark,
  alt,
  height,
  width,
  children,
}: /*
  captionPosition,
*/
DiagramProps) {
  return (
    <figure className='flex flex-col px-0 p-0 sm:p-10 first:mt-0 mt-10 sm:mt-0 justify-center items-center'>
      <div className='dark-image'>
        <img src={imgDark} alt={alt} height={height} width={width} />
      </div>
      <div className='light-image'>
        <img src={imgLight} alt={alt} height={height} width={width} />
      </div>
      <Caption text={children} />
    </figure>
  );
}

export default Diagram;
