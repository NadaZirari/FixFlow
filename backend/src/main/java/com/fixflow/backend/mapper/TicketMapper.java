package com.fixflow.backend.mapper;

import com.fixflow.backend.dto.TicketRequest;
import com.fixflow.backend.dto.TicketResponse;
import com.fixflow.backend.entity.Ticket;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TicketMapper {

    @Mapping(source = "categorie.nom", target = "categorieNom")
    @Mapping(source = "categorie.id", target = "categorieId")
    @Mapping(source = "user.nom", target = "userNom")
    TicketResponse toResponse(Ticket ticket);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "categorie", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "commentaires", ignore = true)
    @Mapping(target = "dateCreation", ignore = true)
    @Mapping(target = "dateResolution", ignore = true)
    @Mapping(target = "statut", ignore = true)
    @Mapping(target = "cheminFichier", ignore = true)
    Ticket toEntity(TicketRequest request);
}
