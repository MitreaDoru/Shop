import type { Props } from "../types/modal";

const ConfirmModal: React.FC<Props> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="confirm-modal">
        <div className="confirm-modal__header">
          <h3 className="confirm-modal__title">{title}</h3>
        </div>
        <div className="confirm-modal__body">
          <p className="confirm-modal__message">{message}</p>
        </div>
        <div className="confirm-modal__footer">
          <button
            className="confirm-modal__btn confirm-modal__btn--cancel"
            onClick={onCancel}
          >
            Anulează
          </button>
          <button
            className="confirm-modal__btn confirm-modal__btn--confirm"
            onClick={onConfirm}
          >
            Confirmă
          </button>
        </div>
      </div>
    </div>
  );
};
export default ConfirmModal;
