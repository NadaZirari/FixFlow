package com.fixflow.backend.dto;

import com.fixflow.backend.enums.TypeCommentaire;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CommentRequest {
    private String contenu;
    private TypeCommentaire type;
}
