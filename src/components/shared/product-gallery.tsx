"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: string[];
  name: string;
}

export function ProductGallery({ images, name }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4">
      <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedIndex(index)}
            className={cn(
              "w-20 h-20 flex-shrink-0 rounded-[2px] overflow-hidden border-2 transition-all duration-300",
              selectedIndex === index
                ? "border-gold"
                : "border-border hover:border-gold/30"
            )}
          >
            <Image
              src={image}
              alt={`${name} view ${index + 1}`}
              width={80}
              height={80}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>

      <div className="flex-1">
        <div
          className="relative aspect-square bg-card rounded-[2px] overflow-hidden border border-border cursor-crosshair"
          onMouseEnter={() => setIsZoomed(true)}
          onMouseLeave={() => setIsZoomed(false)}
          onMouseMove={handleMouseMove}
        >
          <Image
            src={images[selectedIndex]}
            alt={name}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className={cn(
              "object-cover transition-transform duration-300",
              isZoomed && "scale-[2]"
            )}
            style={
              isZoomed
                ? {
                    transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
                  }
                : undefined
            }
            priority
          />
        </div>
      </div>
    </div>
  );
}
