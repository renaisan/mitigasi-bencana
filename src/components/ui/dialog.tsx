import React from 'react';

interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

export const Dialog: React.FC<DialogProps> = ({
  open = false,
  onOpenChange,
  children,
}) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={() => onOpenChange?.(false)}
    >
      <div
        className="w-full max-w-lg rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

interface DialogContentProps {
  children: React.ReactNode;
  className?: string;
}

export const DialogContent: React.FC<DialogContentProps> = ({
  children,
  className = '',
}) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

interface DialogHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const DialogHeader: React.FC<DialogHeaderProps> = ({
  children,
  className = '',
}) => (
  <div className={`mb-4 ${className}`}>
    {children}
  </div>
);

interface DialogTitleProps {
  children: React.ReactNode;
  className?: string;
}

export const DialogTitle: React.FC<DialogTitleProps> = ({
  children,
  className = '',
}) => (
  <h2 className={`text-xl font-bold ${className}`}>
    {children}
  </h2>
);

interface DialogDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export const DialogDescription: React.FC<DialogDescriptionProps> = ({
  children,
  className = '',
}) => (
  <p className={`mt-2 text-sm text-gray-600 ${className}`}>
    {children}
  </p>
);

interface DialogFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const DialogFooter: React.FC<DialogFooterProps> = ({
  children,
  className = '',
}) => (
  <div className={`mt-6 flex justify-end gap-2 ${className}`}>
    {children}
  </div>
);

interface DialogCloseProps {
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const DialogClose: React.FC<DialogCloseProps> = ({
  children = 'Tutup',
  className = '',
  onClick,
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`rounded-lg border px-4 py-2 text-sm hover:bg-gray-100 ${className}`}
  >
    {children}
  </button>
);
