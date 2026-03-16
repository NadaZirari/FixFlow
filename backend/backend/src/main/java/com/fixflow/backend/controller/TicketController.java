package com.fixflow.backend.controller;

import com.fixflow.backend.dto.TicketRequest;
import com.fixflow.backend.dto.TicketResponse;
import com.fixflow.backend.enums.StatutTicket;
import com.fixflow.backend.service.TicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;

    @PostMapping(consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<TicketResponse> createTicket(
            @RequestPart("ticket") TicketRequest request,
            @RequestPart(value = "file", required = false) org.springframework.web.multipart.MultipartFile file
    ) {
        return ResponseEntity.ok(ticketService.createTicket(request, file));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<TicketResponse>> getMyTickets() {
        return ResponseEntity.ok(ticketService.getMyTickets());
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<TicketResponse>> getAllTickets() {
        return ResponseEntity.ok(ticketService.getAllTickets());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @ticketService.findById(#id).user.email == authentication.principal.username")
    public ResponseEntity<TicketResponse> getTicketById(@PathVariable Long id) {
        return ResponseEntity.ok(ticketService.getTicketResponseById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<TicketResponse> updateTicket(
            @PathVariable Long id,
            @RequestBody TicketRequest request
    ) {
        return ResponseEntity.ok(ticketService.updateTicket(id, request));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TicketResponse> updateStatus(
            @PathVariable Long id,
            @RequestParam StatutTicket statut
    ) {
        return ResponseEntity.ok(ticketService.updateStatus(id, statut));
    }
}
