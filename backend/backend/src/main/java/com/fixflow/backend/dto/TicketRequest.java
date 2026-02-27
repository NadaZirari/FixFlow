package com.fixflow.backend.dto;

import com.fixflow.backend.enums.PrioriteTicket;
import com.fixflow.backend.enums.CategorieTicket;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TicketRequest {
    private String titre;
    private String description;
    private PrioriteTicket priorite;
    private CategorieTicket categorie;
}
