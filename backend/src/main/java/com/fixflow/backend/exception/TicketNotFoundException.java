package com.fixflow.backend.exception;

public class TicketNotFoundException extends ResourceNotFoundException {

    public TicketNotFoundException(Long id) {
        super("Ticket", id);
    }
}
