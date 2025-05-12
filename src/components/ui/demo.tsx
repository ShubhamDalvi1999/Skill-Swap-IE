"use client";

import React from "react";
import { Button } from "./moving-border";

export default function MovingBorderDemo() {
  return (
    <div className="flex items-center justify-center min-h-[200px] w-full max-w-md mx-auto">
      <Button className="bg-gray-900 text-white border-none">
        Sign up
      </Button>
    </div>
  );
} 