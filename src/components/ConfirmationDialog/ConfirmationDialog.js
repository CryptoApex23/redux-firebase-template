import React from 'react';
import ReactDOM from 'react-dom';
import './ConfirmationDialog.css'; // Create a CSS file for styling

const ConfirmationDialog = ({ isOpen, onConfirm, onCancel, message }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="confirmation-dialog-overlay">
      <div className="confirmation-dialog">
        <p>{message}</p>
        <button onClick={onConfirm}>Yes</button>
        <button onClick={onCancel}>No</button>
      </div>
    </div>,
    document.body
  );
};

export default ConfirmationDialog;
