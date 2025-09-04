package com.catarina.auditoria.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {

    private String message;
    private Boolean success;
    private String token;
    private String sessionToken;
    private Boolean requiresTwoFactor;
    private String email;
    private String captchaImage;
}
