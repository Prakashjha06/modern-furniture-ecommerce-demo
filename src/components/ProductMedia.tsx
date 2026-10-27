import React, { useState } from 'react';
import { Product } from '../types/furniture';
import { resolveProductImage } from '../utils/assetMap';

interface ProductMediaProps {
  product: Product;
  mode?: 'photo' | 'blueprint' | 'material';
  selectedColorName?: string;
  className?: string;
}

export const ProductMedia: React.FC<ProductMediaProps> = ({
  product,
  mode = 'photo',
  selectedColorName,
  className = '',
}) => {
  const [imgError, setImgError] = useState(false);
  const resolvedSrc = resolveProductImage(product.image, product.category);

  const selectedColor =
    product.colors.find((c) => c.name === selectedColorName) || product.colors[0];

  if (mode === 'blueprint') {
    const { widthCm, depthCm, heightCm } = product.dimensions;
    const maxDim = Math.max(widthCm, heightCm, 120);
    const boxW = Math.max(120, Math.round((widthCm / maxDim) * 280));
    const boxH = Math.max(90, Math.round((heightCm / maxDim) * 190));
    const startX = Math.round((480 - boxW) / 2);
    const startY = Math.round((330 - boxH) / 2);

    return (
      <div
        className={`relative flex items-center justify-center bg-[#F4F1EA] select-none ${className}`}
      >
        <svg
          viewBox="0 0 480 360"
          className="w-full h-full text-[#1C1B19]"
          role="img"
          aria-label={`Architectural dimension diagram for ${product.name}: ${product.dimensions.label}`}
        >
          <defs>
            <pattern id={`grid-${product.id}`} width="24" height="24" patternUnits="userSpaceOnUse">
              <path
                d="M 24 0 L 0 0 0 24"
                fill="none"
                stroke="#E4DFD5"
                strokeWidth="0.8"
              />
            </pattern>
          </defs>
          <rect width="480" height="360" fill={`url(#grid-${product.id})`} />

          {/* Header technical label */}
          <text
            x="28"
            y="34"
            fontSize="11"
            fontFamily="Plus Jakarta Sans, sans-serif"
            fontWeight="600"
            fill="#66615B"
          >
            Architectural Front Elevation · {product.sku}
          </text>

          {/* Main front elevation frame */}
          <rect
            x={startX}
            y={startY}
            width={boxW}
            height={boxH}
            rx="4"
            fill="#FAF9F6"
            stroke="#2C3E35"
            strokeWidth="2.2"
          />
          <rect
            x={startX + 12}
            y={startY + 12}
            width={Math.max(24, boxW - 24)}
            height={Math.max(24, boxH - 28)}
            fill="none"
            stroke="#8C857B"
            strokeDasharray="4 4"
            strokeWidth="1.1"
          />
          {/* Timber Legs */}
          <line
            x1={startX + 16}
            y1={startY + boxH}
            x2={startX + 16}
            y2={startY + boxH + 18}
            stroke="#2C3E35"
            strokeWidth="3"
          />
          <line
            x1={startX + boxW - 16}
            y1={startY + boxH}
            x2={startX + boxW - 16}
            y2={startY + boxH + 18}
            stroke="#2C3E35"
            strokeWidth="3"
          />

          {/* Width callout */}
          <line
            x1={startX}
            y1={startY - 18}
            x2={startX + boxW}
            y2={startY - 18}
            stroke="#1C1B19"
            strokeWidth="1.2"
          />
          <line x1={startX} y1={startY - 24} x2={startX} y2={startY - 12} stroke="#1C1B19" />
          <line
            x1={startX + boxW}
            y1={startY - 24}
            x2={startX + boxW}
            y2={startY - 12}
            stroke="#1C1B19"
          />
          <text
            x={startX + boxW / 2}
            y={startY - 26}
            textAnchor="middle"
            fontSize="12"
            fontWeight="600"
            fontFamily="Plus Jakarta Sans, sans-serif"
            fill="#1C1B19"
          >
            Width: {widthCm} cm
          </text>

          {/* Height callout */}
          <line
            x1={startX + boxW + 20}
            y1={startY}
            x2={startX + boxW + 20}
            y2={startY + boxH + 18}
            stroke="#1C1B19"
            strokeWidth="1.2"
          />
          <text
            x={startX + boxW + 28}
            y={startY + (boxH + 18) / 2 + 4}
            fontSize="12"
            fontWeight="600"
            fontFamily="Plus Jakarta Sans, sans-serif"
            fill="#1C1B19"
          >
            H: {heightCm} cm
          </text>

          {/* Depth footer label */}
          <text
            x="240"
            y="334"
            textAnchor="middle"
            fontSize="12"
            fontWeight="500"
            fontFamily="Plus Jakarta Sans, sans-serif"
            fill="#66615B"
          >
            Overall Depth: {depthCm} cm · Scale Studio Blueprint
          </text>
        </svg>
      </div>
    );
  }

  if (mode === 'material') {
    return (
      <div
        className={`flex flex-col justify-between bg-[#F2EFE9] border border-[#E5E0D8] p-8 ${className}`}
      >
        <div className="flex items-center justify-between text-xs text-[#66615B]">
          <span>Material & Finish Sample</span>
          <span className="font-mono-num">{product.sku}</span>
        </div>

        <div className="my-6 flex items-center gap-6">
          <div
            className="w-24 h-24 rounded-lg border border-black/15 shadow-sm shrink-0"
            style={{ backgroundColor: selectedColor?.hex || '#9B6B43' }}
            aria-hidden="true"
          />
          <div>
            <p className="text-xs text-[#66615B]">Selected Finish</p>
            <p className="text-lg font-semibold text-[#1C1B19] mt-0.5">
              {selectedColor?.name || 'Natural Finish'}
            </p>
            <p className="text-sm text-[#66615B] mt-2 leading-relaxed">{product.material}</p>
          </div>
        </div>

        <div className="pt-4 border-t border-[#E5E0D8] flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#66615B]">
          <span>Low-VOC Plant Hardwax Oil</span>
          <span aria-hidden="true">·</span>
          <span>Kiln-Dried Timber</span>
          <span aria-hidden="true">·</span>
          <span>10-Year Structural Warranty</span>
        </div>
      </div>
    );
  }

  // Crop variation classes so secondary items in the 12-item catalog frame uniquely
  let cropTransform = 'object-center';
  if (product.cropStyle === 'zoom-left') {
    cropTransform = 'object-left scale-[1.12]';
  } else if (product.cropStyle === 'zoom-right') {
    cropTransform = 'object-right scale-[1.12]';
  } else if (product.cropStyle === 'zoom-center') {
    cropTransform = 'object-center scale-[1.16]';
  }

  if (imgError) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-[#EFECE6] text-[#66615B] p-6 text-center ${className}`}
      >
        <svg
          className="w-10 h-10 mb-2 stroke-[#2C3E35]"
          viewBox="0 0 24 24"
          fill="none"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <path d="M4 16v3M20 16v3M3 13a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3H3v-3Z" />
          <path d="M5 11V8a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v3" />
        </svg>
        <span className="text-sm font-medium text-[#1C1B19]">{product.name}</span>
        <span className="text-xs text-[#66615B] mt-1">
          {product.category} · {product.dimensions.label}
        </span>
      </div>
    );
  }

  return (
    <div className={`overflow-hidden bg-[#EFECE6] ${className}`}>
      <img
        src={resolvedSrc}
        alt={`${product.name} — ${product.material}`}
        referrerPolicy="no-referrer"
        loading="lazy"
        onError={() => setImgError(true)}
        className={`w-full h-full object-cover transition-transform duration-200 ease-out ${cropTransform}`}
      />
    </div>
  );
};
