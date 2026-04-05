package com.fixflow.backend.controller;

import com.fixflow.backend.dto.TicketRequest;
import com.fixflow.backend.dto.TicketResponse;
import com.fixflow.backend.enums.StatutTicket;
import com.fixflow.backend.service.TicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
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
    @PreAuthorize("hasAuthority('ROLE_USER')")
    public ResponseEntity<TicketResponse> createTicketMultipart(
            @RequestPart("ticket") TicketRequest request,
            @RequestPart(value = "file", required = false) org.springframework.web.multipart.MultipartFile file
    ) {
        return ResponseEntity.ok(ticketService.createTicket(request, file));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_USER')")
    public ResponseEntity<TicketResponse> createTicket(@RequestBody TicketRequest request) {
        return ResponseEntity.ok(ticketService.createTicket(request, null));
    }

    public ResponseEntity<List<TicketResponse>> getMyTickets() {
        return ResponseEntity.ok(ticketService.getMyTickets());
    }

    @GetMapping("/my/paged")
    @PreAuthorize("hasAuthority('ROLE_USER')")
    public ResponseEntity<Page<TicketResponse>> getMyTicketsPaged(
            @PageableDefault(sort = "id", direction = org.springframework.data.domain.Sort.Direction.DESC) Pageable pageable
    ) {
        return ResponseEntity.ok(ticketService.getMyPagedTickets(pageable));
    }

    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<TicketResponse>> getAllTickets() {
        return ResponseEntity.ok(ticketService.getAllTickets());
    }

    @GetMapping("/paged")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Page<TicketResponse>> getTicketsPaged(
            @PageableDefault(sort = "id", direction = org.springframework.data.domain.Sort.Direction.DESC) Pageable pageable
    ) {
        return ResponseEntity.ok(ticketService.getPagedTickets(pageable));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or @ticketService.findById(#id).user.email == authentication.principal.username")
    public ResponseEntity<TicketResponse> getTicketById(@PathVariable Long id) {
        return ResponseEntity.ok(ticketService.getTicketResponseById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_USER') and @ticketService.findById(#id).user.email == authentication.principal.username")
    public ResponseEntity<TicketResponse> updateTicket(
            @PathVariable Long id,
            @RequestBody TicketRequest request
    ) {
        return ResponseEntity.ok(ticketService.updateTicket(id, request));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<TicketResponse> updateStatus(
            @PathVariable Long id,
            @RequestParam StatutTicket statut
    ) {
        return ResponseEntity.ok(ticketService.updateStatus(id, statut));
    }
}
