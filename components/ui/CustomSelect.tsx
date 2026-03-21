import React, { useState, useEffect } from "react";
import { ChevronDown, CheckCircle2 } from "lucide-react";

interface CustomSelectProps {
    value: any;
    onChange: (val: any) => void;
    options: string[] | { label: string, value: any }[];
    disabled?: boolean;
    placeholder?: string;
    isNull?: boolean;
}

const CustomSelect = ({ 
    value, 
    onChange, 
    options, 
    disabled, 
    placeholder,
    isNull 
}: CustomSelectProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = Array.isArray(options) 
        ? (typeof options[0] === 'string' 
            ? (options as string[]).find(opt => opt === value) 
            : (options as { label: string, value: any }[]).find(opt => opt.value === value))
        : null;

    const displayValue = selectedOption 
        ? (typeof selectedOption === 'string' ? selectedOption : selectedOption.label)
        : placeholder || 'Select...';

    return (
        <div className="relative" ref={containerRef}>
            <button
                type="button"
                disabled={disabled || isNull}
                onClick={() => setIsOpen(!isOpen)}
                className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3 text-sm font-medium text-white flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all disabled:opacity-30 hover:bg-white/[0.04]"
            >
                <span className={selectedOption !== undefined && selectedOption !== null ? 'text-white' : 'text-zinc-500'}>
                    {displayValue}
                </span>
                <ChevronDown className={`h-4 w-4 text-zinc-500 transition-transform duration-200 ${isOpen ? 'rotate-180 text-primary' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full mt-2 left-0 right-0 z-[210] bg-zinc-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 py-1 max-h-60 overflow-y-auto scrollbar-hide">
                    {Array.isArray(options) && options.map((opt, i) => {
                        const optVal = typeof opt === 'string' ? opt : opt.value;
                        const optLabel = typeof opt === 'string' ? opt : opt.label;
                        const isSelected = optVal === value;

                        return (
                            <button
                                key={i}
                                type="button"
                                onClick={() => {
                                    onChange(optVal);
                                    setIsOpen(false);
                                }}
                                className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-all hover:bg-white/5 flex items-center justify-between ${isSelected ? 'text-primary bg-primary/5' : 'text-zinc-400 hover:text-white'}`}
                            >
                                {optLabel}
                                {isSelected && <CheckCircle2 className="h-3.5 w-3.5 text-primary" />}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default CustomSelect;
