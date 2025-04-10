import React from 'react'
import { Button, Modal } from 'react-bootstrap'

export const BasicModal = ({show, handleClose, children, title, onSubmit}) => {
  return (
    <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {children}
        </Modal.Body>
        <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
            Volver
        </Button>
        <Button variant="warning" onClick={onSubmit}>
            Confirmar
        </Button>
        </Modal.Footer>
    </Modal>
  )
}
