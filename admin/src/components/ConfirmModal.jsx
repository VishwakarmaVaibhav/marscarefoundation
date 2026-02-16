'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { X, AlertTriangle } from 'lucide-react';

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message, isDangerous = false, isLoading = false }) {
    if (!isOpen) return null;

    return (
        <Dialog.Root open={isOpen} onOpenChange={onClose}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fade-in" />
                <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[#1A1A2E] border border-white/10 rounded-2xl p-6 shadow-2xl z-50 animate-scale-in">
                    <div className="flex items-center justify-between mb-4">
                        <Dialog.Title className="text-xl font-bold text-white flex items-center gap-2">
                            {isDangerous && <AlertTriangle className="w-6 h-6 text-red-500" />}
                            {title}
                        </Dialog.Title>
                        <Dialog.Close asChild>
                            <button
                                onClick={onClose}
                                className="text-white/40 hover:text-white transition-colors"
                                disabled={isLoading}
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </Dialog.Close>
                    </div>

                    <Dialog.Description className="text-white/70 mb-8 leading-relaxed">
                        {message}
                    </Dialog.Description>

                    <div className="flex justify-end gap-3 transition-opacity duration-200">
                        <button
                            onClick={onClose}
                            disabled={isLoading}
                            className="px-5 py-2.5 rounded-xl text-white/70 hover:bg-white/10 hover:text-white font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isLoading}
                            className={`px-6 py-2.5 rounded-xl text-white font-bold transition-all transform hover:scale-105 ${isDangerous
                                    ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/20'
                                    : 'bg-gradient-to-r from-mars-orange to-mars-red shadow-lg shadow-mars-orange/20'
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            {isLoading ? 'Processing...' : (isDangerous ? 'Yes, Delete' : 'Confirm')}
                        </button>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
