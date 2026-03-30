package com.fixflow.backend.service.interfaces;

import com.fixflow.backend.dto.TicketRequest;
import com.fixflow.backend.dto.TicketResponse;
import com.fixflow.backend.entity.Ticket;
import com.fixflow.backend.enums.StatutTicket;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ITicketService {
    Ticket findById(Long id);
    TicketResponse getTicketResponseById(Long id);
    TicketResponse createTicket(TicketRequest request, MultipartFile file);
    List<TicketResponse> getMyTickets();
    List<TicketResponse> getAllTickets();
    TicketResponse updateTicket(Long id, TicketRequest request);
    TicketResponse updateStatus(Long ticketId, StatutTicket statut);
}
