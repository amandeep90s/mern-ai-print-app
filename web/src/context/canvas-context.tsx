import { Canvas } from 'fabric';
import React, { useState } from 'react';

import type { ProductColorType } from '@/types/product';

interface ListingDataType {
  selectedColors: ProductColorType[];
  title: string;
  description: string;
  sellingPrice: number;
  artworkUrl: string;
  artworkPlacement: {
    top: number;
    left: number;
    width: number;
    height: number;
    refDisplayWidth: number;
  };
}

export type ListingDataKey = keyof ListingDataType;

interface CanvasContextType {
  canvasEditor: Canvas | null;
  setCanvasEditor: (canvas: Canvas | null) => void;
  listingData: ListingDataType;
  setListingData: (listingData: ListingDataType) => void;
  updatedListingState: (key: ListingDataKey, value: unknown) => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const CanvasContext = React.createContext<CanvasContextType | null>(
  null,
);

export function CanvasProvider({
  children,
  basePrice,
}: {
  children: React.ReactNode;
  basePrice?: number;
}) {
  const [canvasEditor, setCanvasEditor] = useState<Canvas | null>(null);
  const [listingData, setListingData] = useState<ListingDataType>({
    selectedColors: [],
    title: '',
    description: '',
    sellingPrice: basePrice ?? 0,
    artworkUrl: '',
    artworkPlacement: {
      top: 0,
      left: 0,
      width: 0,
      height: 0,
      refDisplayWidth: 662, // This is the width of the design area in the editor, used as a reference for scaling artwork placement
    },
  });

  const updatedListingState = (key: ListingDataKey, value: unknown) => {
    setListingData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <CanvasContext.Provider
      value={{
        canvasEditor,
        setCanvasEditor,
        listingData,
        setListingData,
        updatedListingState,
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
}
