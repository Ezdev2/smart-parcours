import { reactive, readonly } from 'vue';

const confirmState = reactive({
  isVisible: false,
  message: '',
  title: 'Confirmation',
  confirmText: 'Confirmer',
  cancelText: 'Annuler',
  resolve: null,
  reject: null,
  isAlert: false, // Nouveau champ pour différencier alerte et confirmation
});

export function useConfirm() {
  const showConfirm = (title, message, confirmText = 'Confirmer', cancelText = 'Annuler') => {
    confirmState.isVisible = true;
    confirmState.title = title;
    confirmState.message = message;
    confirmState.confirmText = confirmText;
    confirmState.cancelText = cancelText;
    confirmState.isAlert = false; // C'est une confirmation
    return new Promise((resolve, reject) => {
      confirmState.resolve = resolve;
      confirmState.reject = reject;
    });
  };

  const showAlert = (title, message, okText = 'Ok') => {
    confirmState.isVisible = true;
    confirmState.title = title;
    confirmState.message = message;
    confirmState.confirmText = okText; // Utilise confirmText comme texte "OK"
    confirmState.cancelText = ''; // Pas de bouton annuler pour une alerte
    confirmState.isAlert = true; // C'est une alerte
    return new Promise((resolve) => {
      confirmState.resolve = resolve;
      // Pas de reject pour une alerte, car il n'y a pas de "choix" à annuler.
    });
  };

  const confirmAction = () => {
    if (confirmState.resolve) {
      confirmState.resolve(true);
    }
    closeDialog();
  };

  const cancelAction = () => {
    if (confirmState.reject && !confirmState.isAlert) { // Seulement pour confirmation
      confirmState.reject(false);
    } else if (confirmState.resolve && confirmState.isAlert) { // Pour les alertes, le bouton OK agit comme un resolve
        confirmState.resolve(true);
    }
    closeDialog();
  };

  const closeDialog = () => {
    confirmState.isVisible = false;
    confirmState.title = 'Confirmation';
    confirmState.message = '';
    confirmState.confirmText = 'Confirmer';
    confirmState.cancelText = 'Annuler';
    confirmState.resolve = null;
    confirmState.reject = null;
    confirmState.isAlert = false;
  };

  return {
    confirmState: readonly(confirmState), // Rendre l'état en lecture seule pour éviter les mutations directes
    showConfirm,
    showAlert,
    confirmAction,
    cancelAction,
    closeDialog,
  };
}