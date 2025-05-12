"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function MovingBorder({
  children,
  duration = 2000,
  className,
  containerClassName,
  borderRadius = "1.75rem",
  borderClassName,
  ...props
}: {
  children: React.ReactNode;
  duration?: number;
  className?: string;
  containerClassName?: string;
  borderRadius?: string;
  borderClassName?: string;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative p-[1px] overflow-hidden rounded-[1.75rem]",
        containerClassName
      )}
      style={{
        borderRadius: borderRadius,
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          borderRadius: borderRadius,
        }}
      >
        <div className="absolute -inset-[100%] animate-[spin_4s_linear_infinite] h-[400%] w-[400%]">
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: duration / 1000,
              ease: "linear",
            }}
            style={{
              width: "100%",
              height: "100%",
              background:
                "conic-gradient(from 0deg, var(--primary-500) 0%, transparent 12.5%, transparent 25%, var(--primary-500) 37.5%, var(--primary-500) 50%, transparent 62.5%, transparent 75%, var(--primary-500) 87.5%)",
            }}
            className={cn(
              "absolute inset-0 opacity-100",
              borderClassName
            )}
          />
        </div>
      </div>

      <div
        className={cn(
          "relative flex justify-center items-center w-full h-full bg-secondary-800 rounded-[calc(1.75rem-1px)] z-10",
          className
        )}
        style={{
          borderRadius: `calc(${borderRadius} - 1px)`,
        }}
        {...props}
      >
        {children}
      </div>
    </div>
  );
}

export function Button({
  borderRadius = "1.75rem",
  className,
  children,
  duration,
  borderClassName,
  ...props
}: {
  borderRadius?: string;
  className?: string;
  children: React.ReactNode;
  duration?: number;
  borderClassName?: string;
} & React.HTMLAttributes<HTMLButtonElement>) {
  return (
    <MovingBorder
      borderRadius={borderRadius}
      containerClassName="w-full"
      duration={duration}
      borderClassName={borderClassName}
    >
      <button
        className={cn(
          "relative h-12 w-full text-center font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50",
          className
        )}
        {...props}
      >
        {children}
      </button>
    </MovingBorder>
  );
} 