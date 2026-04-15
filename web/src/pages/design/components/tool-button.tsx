import type React from 'react';

import { cn } from '@/lib/utils';

interface ToolButtonProps {
  icon: React.ReactNode;
  label: string;
  isUpload?: boolean;
  className?: string;
  onClick?: () => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  ref?: React.Ref<HTMLButtonElement>;
  [key: string]: unknown;
}

export default function ToolButton({
  icon,
  label,
  isUpload,
  className,
  onClick,
  onChange,
  ref,
  ...props
}: ToolButtonProps) {
  const buttonClass = cn(
    'flex-1 min-w-[30%] flex flex-col items-center gap-1.5 px-3 py-4 rounded-lg',
    'border border-border hover:bg-secondary transition-colors',
    className,
  );

  const content = (
    <>
      {icon}
      <span className="text-xs font-medium">{label}</span>
    </>
  );

  if (isUpload) {
    return (
      <label className={cn(buttonClass, 'cursor-pointer')}>
        {content}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onChange}
        />
      </label>
    );
  }

  return (
    <button ref={ref} onClick={onClick} className={buttonClass} {...props}>
      {content}
    </button>
  );
}
