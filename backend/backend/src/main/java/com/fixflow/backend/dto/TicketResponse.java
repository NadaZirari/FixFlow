package com.fixflow.backend.dto;

import com.fixflow.backend.enums.StatutTicket;
import com.fixflow.backend.enums.PrioriteTicket;
import com.fixflow.backend.enums.CategorieTicket;
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
    private CategorieTicket categorie;
    private String cheminFichier;
    private LocalDateTime dateCreation;
    private String userNom;
}
