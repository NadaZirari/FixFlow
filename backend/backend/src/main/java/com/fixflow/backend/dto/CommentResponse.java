package com.fixflow.backend.dto;

import com.fixflow.backend.enums.TypeCommentaire;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CommentResponse {
    private Long id;
    private String contenu;
    private LocalDateTime date;
    private TypeCommentaire type;
    private String auteurNom;
}
