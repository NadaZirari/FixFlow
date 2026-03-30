package com.fixflow.backend.mapper;

import com.fixflow.backend.dto.CommentRequest;
import com.fixflow.backend.dto.CommentResponse;
import com.fixflow.backend.entity.Commentaire;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CommentMapper {

    @Mapping(source = "auteur.nom", target = "auteurNom")
    CommentResponse toResponse(Commentaire commentaire);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "ticket", ignore = true)
    @Mapping(target = "auteur", ignore = true)
    @Mapping(target = "date", ignore = true)
    Commentaire toEntity(CommentRequest request);
}
