import { useNotification } from './useNotification'

/**
 * SaaS Phase 1: Centralized notification system
 * Maps to the existing useNotification composable
 */
export function useNotify() {
    const { showSuccess, showError, showInfo, showWarning } = useNotification()

    const notifySuccess = (message, context = {}) => {
        showSuccess(message, context)
    }

    const notifyError = (message, context = {}) => {
        showError(message, context)
    }

    const notifyInfo = (message, context = {}) => {
        showInfo(message, context)
    }

    const notifyWarning = (message, context = {}) => {
        showWarning(message, context)
    }

    return {
        notifySuccess,
        notifyError,
        notifyInfo,
        notifyWarning
    }
}
