package com.fixflow.backend.service;

import com.fixflow.backend.dto.TicketRequest;
import com.fixflow.backend.dto.TicketResponse;
import com.fixflow.backend.dto.UserDto;
import com.fixflow.backend.entity.Ticket;
import com.fixflow.backend.entity.User;
import com.fixflow.backend.enums.StatutTicket;
import com.fixflow.backend.entity.Categorie;
import com.fixflow.backend.repository.CategorieRepository;
import com.fixflow.backend.repository.TicketRepository;
import com.fixflow.backend.repository.UserRepository;
import com.fixflow.backend.service.interfaces.ITicketService;
import com.fixflow.backend.mapper.TicketMapper;
import com.fixflow.backend.mapper.UserMapper;
import com.fixflow.backend.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
    private final TicketMapper ticketMapper;

    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

    public Ticket findById(Long id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket", id));
    }

    public TicketResponse getTicketResponseById(Long id) {
        return ticketMapper.toResponse(findById(id));
    }

    @Transactional
    public TicketResponse createTicket(TicketRequest request, MultipartFile file) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur", "email", email));

        Ticket ticket = ticketMapper.toEntity(request);
        ticket.setUser(user);
        
        if (request.getCategorieId() != null) {
            Categorie categorie = categorieRepository.findById(request.getCategorieId())
                    .orElseThrow(() -> new ResourceNotFoundException("Catégorie", request.getCategorieId()));
            ticket.setCategorie(categorie);
        }

        if (file != null && !file.isEmpty()) {
            String fileName = storeFile(file);
            ticket.setCheminFichier(fileName);
        }
        
        Ticket savedTicket = ticketRepository.save(ticket);
        return ticketMapper.toResponse(savedTicket);
    }

    public List<TicketResponse> getMyTickets() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur", "email", email));
        
        return ticketRepository.findByUser(user).stream()
                .map(ticketMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public Page<TicketResponse> getMyPagedTickets(Pageable pageable) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur", "email", email));
        
        return ticketRepository.findByUser(user, pageable)
                .map(ticketMapper::toResponse);
    }

    public List<TicketResponse> getAllTickets() {
        return ticketRepository.findAll().stream()
                .map(ticketMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public Page<TicketResponse> getPagedTickets(Pageable pageable) {
        return ticketRepository.findAll(pageable)
                .map(ticketMapper::toResponse);
    }


    @Transactional
    public TicketResponse updateTicket(Long id, TicketRequest request) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket", id));
        
        ticket.setTitre(request.getTitre());
        ticket.setDescription(request.getDescription());
        ticket.setPriorite(request.getPriorite());
        
        if (request.getCategorieId() != null) {
            Categorie categorie = categorieRepository.findById(request.getCategorieId())
                    .orElseThrow(() -> new ResourceNotFoundException("Catégorie", request.getCategorieId()));
            ticket.setCategorie(categorie);
        }
        
        return ticketMapper.toResponse(ticketRepository.save(ticket));
    }

    @Transactional
    public TicketResponse updateStatus(Long ticketId, StatutTicket statut) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket", ticketId));
        
        ticket.setStatut(statut);
        if (statut == StatutTicket.RESOLU) {
            ticket.resoudre();
        } else if (statut == StatutTicket.ARCHIVE) {
            ticket.archiver();
        }
        
        Ticket savedTicket = ticketRepository.save(ticket);


        return ticketMapper.toResponse(savedTicket);
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
