package com.fixflow.backend.dto;

import com.fixflow.backend.enums.StatutTicket;
import com.fixflow.backend.enums.PrioriteTicket;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TicketResponse {
    private Long id;
    private String titre;
    private String description;
    private StatutTicket statut;
    private PrioriteTicket priorite;
    private String categorieNom;
    private Long categorieId;
    private String cheminFichier;
    @com.fasterxml.jackson.annotation.JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime dateCreation;
    private String userNom;
}
