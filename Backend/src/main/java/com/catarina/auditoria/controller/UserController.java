package com.catarina.auditoria.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.catarina.auditoria.dto.request.UserRegistrationRequest;
import com.catarina.auditoria.dto.response.ApiResponse;
import com.catarina.auditoria.entity.User;
import com.catarina.auditoria.service.UserService;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class UserController {
    private final UserService userService;
    @PostMapping("/register")
    public ResponseEntity<ApiResponse> registerUser(@Valid @RequestBody UserRegistrationRequest request) {
        try {
            User user = userService.registerUser(request);
            
            Map<String, Object> userData = new HashMap<>();
            userData.put("id", user.getId());
            userData.put("username", user.getUsername());
            userData.put("email", user.getEmail());
            userData.put("createdAt", user.getCreatedAt());
            
            return ResponseEntity.ok(ApiResponse.success("Usuário registrado com sucesso", userData));
            
        } catch (RuntimeException e) {
            log.warn("Erro ao registrar usuário: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("Erro interno ao registrar usuário", e);
            return ResponseEntity.internalServerError().body(ApiResponse.error("Erro interno do servidor"));
        }
    }
}
