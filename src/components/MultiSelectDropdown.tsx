"use client";

import { useEffect, useRef, useState } from "react";

type MultiSelectOption = {
  value: string;
  label: string;
};

type MultiSelectDropdownProps = {
  id: string;
  label: string;
  name?: string;
  options: MultiSelectOption[];
  values: string[];
  onToggle: (value: string) => void;
};

export default function MultiSelectDropdown({
  id,
  label,
  name,
  options,
  values,
  onToggle,
}: MultiSelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setIsOpen(false);
      triggerRef.current?.focus();
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen]);

  const selectedOption = values.length === 1
    ? options.find((option) => option.value === values[0])
    : null;
  const summary = values.length === 0
    ? "選択してください"
    : selectedOption?.label ?? `${values.length}件選択中`;

  return (
    <div className={`multi-select${isOpen ? " is-open" : ""}`} ref={rootRef}>
      <span className="multi-select__label" id={`${id}-label`}>{label}</span>
      <button
        ref={triggerRef}
        type="button"
        className="multi-select__trigger"
        aria-expanded={isOpen}
        aria-controls={`${id}-options`}
        aria-labelledby={`${id}-label ${id}-summary`}
        onClick={() => setIsOpen((current) => !current)}
      >
        <span
          id={`${id}-summary`}
          className={values.length === 0 ? "is-placeholder" : undefined}
        >
          {summary}
        </span>
        <svg viewBox="0 0 12 8" aria-hidden="true">
          <path d="M1 1l5 5 5-5" />
        </svg>
      </button>
      <div
        id={`${id}-options`}
        className="multi-select__panel"
        hidden={!isOpen}
      >
        {options.map((option) => (
          <label className="multi-select__option" key={option.value}>
            <input
              type="checkbox"
              name={name}
              value={option.value}
              checked={values.includes(option.value)}
              onChange={() => onToggle(option.value)}
            />
            <span className="multi-select__checkbox" aria-hidden="true" />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
