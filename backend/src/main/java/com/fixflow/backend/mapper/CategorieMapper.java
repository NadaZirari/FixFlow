package com.fixflow.backend.mapper;

import com.fixflow.backend.dto.CategorieRequest;
import com.fixflow.backend.dto.CategorieResponse;
import com.fixflow.backend.entity.Categorie;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface CategorieMapper {

    CategorieResponse toResponse(Categorie categorie);

    List<CategorieResponse> toResponseList(List<Categorie> categories);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "tickets", ignore = true)
    Categorie toEntity(CategorieRequest request);
}
