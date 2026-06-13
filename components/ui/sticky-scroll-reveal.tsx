"use client";
import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export const StickyScroll = ({
  content,
  contentClassName,
}: {
  content: {
    title: string;
    description: string;
    content?: React.ReactNode | any;
  }[];
  contentClassName?: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClickOutside = (evt: MouseEvent) => {
    if (
      !dropdownRef?.current?.contains(evt.target as HTMLElement) &&
      !buttonRef?.current?.contains(evt.target as HTMLElement)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const scrollToSection = (index: number) => {
    const element = document.getElementById(`section-${index}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsOpen(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row-reverse gap-8 p-6 lg:p-10 bg-white min-h-screen">
      {/* Mobile Dropdown */}
      <div className="lg:hidden relative">
        <button
          ref={buttonRef}
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-6 py-4 bg-slate-900 text-white rounded-lg font-medium text-lg"
        >
          Read more →
        </button>

        {isOpen && (
          <div
            ref={dropdownRef}
            data-testid="mobile-dropdown"
            className="fixed inset-0 top-0 left-0 right-0 bottom-0 bg-white z-50 overflow-y-auto"
          >
            <div className="flex justify-end p-4 border-b border-gray-200">
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Close menu"
              >
                <svg
                  className="w-6 h-6 text-slate-900"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <nav data-testid="mobile-nav" className="py-4">
              {content.map((item, index) => (
                <button
                  key={item.title + index}
                  onClick={() => scrollToSection(index)}
                  className="w-full text-left px-6 py-6 hover:bg-gray-100 transition-colors text-lg border-b border-gray-200"
                >
                  {item.title}
                </button>
              ))}
            </nav>
          </div>
        )}
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block lg:w-64 flex-shrink-0">
        <nav data-testid="desktop-nav" className="lg:sticky lg:top-10 space-y-4 p-4 rounded-xl border border-gray-200 bg-white">
          {content.map((item, index) => (
            <div
              key={item.title + index}
              onClick={() => scrollToSection(index)}
              className="p-4 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <h3 className="text-lg font-semibold text-slate-900">
                {item.title}
              </h3>
            </div>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 space-y-16">
        {content.map((item, index) => (
          <section
            key={item.title + index}
            id={`section-${index}`}
            className="scroll-mt-20"
          >
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              {item.title}
            </h2>
            <p className="text-lg text-slate-700 mb-8 max-w-3xl">
              {item.description}
            </p>
            {item.content && (
              <div
                className={cn(
                  "w-full h-64 lg:h-80 rounded-lg overflow-hidden bg-[linear-gradient(to_bottom_right,#ffffff,#e0e0e0)]",
                  contentClassName,
                )}
              >
                {item.content}
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
};
