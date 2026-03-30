package com.fixflow.backend.dto;

import com.fixflow.backend.enums.PrioriteTicket;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TicketRequest {

    @NotBlank(message = "Le titre est obligatoire")
    @Size(max = 200, message = "Le titre ne doit pas dépasser 200 caractères")
    private String titre;

    @NotBlank(message = "La description est obligatoire")
    @Size(max = 5000, message = "La description ne doit pas dépasser 5000 caractères")
    private String description;

    @NotNull(message = "La priorité est obligatoire")
    private PrioriteTicket priorite;

    private Long categorieId;
}

