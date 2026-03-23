import { create } from 'zustand';

interface ModalOptions {
  title: string;
  message: string;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  type?: 'danger' | 'warning' | 'info';
  isAlert?: boolean;
  confirmValue?: string;
}

interface ModalState {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
  confirmLabel: string;
  cancelLabel: string;
  type: 'danger' | 'warning' | 'info';
  isAlert: boolean;
  confirmValue?: string;
  open: (options: ModalOptions) => void;
  close: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  title: '',
  message: '',
  onConfirm: () => {},
  confirmLabel: 'Confirm',
  cancelLabel: 'Cancel',
  type: 'info',
  isAlert: false,
  confirmValue: undefined,
  open: (options) => set({ 
    isOpen: true, 
    title: options.title,
    message: options.message,
    onConfirm: options.onConfirm || (() => {}),
    onCancel: options.onCancel,
    confirmLabel: options.confirmLabel || (options.isAlert ? 'OK' : 'Confirm'),
    cancelLabel: options.cancelLabel || 'Cancel',
    type: options.type || 'info',
    isAlert: !!options.isAlert,
    confirmValue: options.confirmValue
  }),
  close: () => set({ isOpen: false }),
}));
