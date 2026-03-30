package com.fixflow.backend.service;

import com.fixflow.backend.dto.TicketRequest;
import com.fixflow.backend.dto.TicketResponse;
import com.fixflow.backend.entity.Ticket;
import com.fixflow.backend.entity.User;
import com.fixflow.backend.enums.StatutTicket;
import com.fixflow.backend.entity.Categorie;
import com.fixflow.backend.repository.CategorieRepository;
import com.fixflow.backend.repository.TicketRepository;
import com.fixflow.backend.repository.UserRepository;
import com.fixflow.backend.service.interfaces.ITicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TicketService implements ITicketService {

    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final CategorieRepository categorieRepository;

    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

    public Ticket findById(Long id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket non trouvé avec l'ID: " + id));
    }

    public TicketResponse getTicketResponseById(Long id) {
        return mapToResponse(findById(id));
    }

    @Transactional
    public TicketResponse createTicket(TicketRequest request, MultipartFile file) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        Ticket ticket = new Ticket(request.getTitre(), request.getDescription(), user);
        ticket.setPriorite(request.getPriorite());
        
        if (request.getCategorieId() != null) {
            Categorie categorie = categorieRepository.findById(request.getCategorieId())
                    .orElseThrow(() -> new RuntimeException("Catégorie non trouvée"));
            ticket.setCategorie(categorie);
        }

        if (file != null && !file.isEmpty()) {
            String fileName = storeFile(file);
            ticket.setCheminFichier(fileName);
        }
        
        Ticket savedTicket = ticketRepository.save(ticket);
        return mapToResponse(savedTicket);
    }

    public List<TicketResponse> getMyTickets() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        
        return ticketRepository.findByUser(user).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<TicketResponse> getAllTickets() {
        return ticketRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }


    @Transactional
    public TicketResponse updateTicket(Long id, TicketRequest request) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket non trouvé"));
        
        ticket.setTitre(request.getTitre());
        ticket.setDescription(request.getDescription());
        ticket.setPriorite(request.getPriorite());
        
        if (request.getCategorieId() != null) {
            Categorie categorie = categorieRepository.findById(request.getCategorieId())
                    .orElseThrow(() -> new RuntimeException("Catégorie non trouvée"));
            ticket.setCategorie(categorie);
        }
        
        return mapToResponse(ticketRepository.save(ticket));
    }

    @Transactional
    public TicketResponse updateStatus(Long ticketId, StatutTicket statut) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket non trouvé"));
        
        ticket.setStatut(statut);
        if (statut == StatutTicket.RESOLU) {
            ticket.resoudre();
        } else if (statut == StatutTicket.ARCHIVE) {
            ticket.archiver();
        }
        
        Ticket savedTicket = ticketRepository.save(ticket);


        return mapToResponse(savedTicket);
    }

    private TicketResponse mapToResponse(Ticket ticket) {
        return TicketResponse.builder()
                .id(ticket.getId())
                .titre(ticket.getTitre())
                .description(ticket.getDescription())
                .statut(ticket.getStatut())
                .priorite(ticket.getPriorite())
                .categorieNom(ticket.getCategorie() != null ? ticket.getCategorie().getNom() : null)
                .categorieId(ticket.getCategorie() != null ? ticket.getCategorie().getId() : null)
                .cheminFichier(ticket.getCheminFichier())
                .dateCreation(ticket.getDateCreation())
                .userNom(ticket.getUser().getNom())
                .build();
    }

    private String storeFile(MultipartFile file) {
        try {
            Path path = Paths.get(uploadDir);
            if (!Files.exists(path)) {
                Files.createDirectories(path);
            }
            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path targetLocation = path.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            return fileName;
        } catch (IOException ex) {
            throw new RuntimeException("Impossible de stocker le fichier. Veuillez réessayer !", ex);
        }
    }
}
