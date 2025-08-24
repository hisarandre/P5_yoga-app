package com.openclassrooms.starterjwt.integration.controllers;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.hamcrest.Matchers.notNullValue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@ActiveProfiles("test")
@AutoConfigureMockMvc
@Transactional
public class UserControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    private User deletableUser;

    @BeforeEach
    void setUp() {
        // User for delete test
        deletableUser = new User();
        deletableUser.setEmail("deletable@test.com");
        deletableUser.setFirstName("Deletable");
        deletableUser.setLastName("User");
        deletableUser.setPassword("password");
        deletableUser.setAdmin(false);
        deletableUser = userRepository.saveAndFlush(deletableUser);
    }

    @Test
    @WithMockUser(username = "deletable@test.com", roles = {"USER"})
    void givenExistingUserId_whenDeleteAndAuthorized_thenReturnsOk() throws Exception {
        mockMvc.perform(delete("/api/user/{id}", deletableUser.getId())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "other@test.com", roles = {"USER"})
    void givenExistingUserId_whenDeleteButUnauthorized_thenReturnsUnauthorized() throws Exception {
        mockMvc.perform(delete("/api/user/{id}", deletableUser.getId())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(username = "yoga@studio.com", roles = {"USER"})
    void givenNonExistingUserId_whenDelete_thenReturnsNotFound() throws Exception {
        mockMvc.perform(delete("/api/user/{id}", 999L)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(username = "yoga@studio.com", roles = {"USER"})
    void givenExistingUserId_whenGetUser_thenReturnsUser() throws Exception {
        mockMvc.perform(get("/api/user/{id}", 1L)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpectAll(
                        jsonPath("$.id").value(1L),
                        jsonPath("$.email").value("yoga@studio.com"),
                        jsonPath("$.firstName").value("Admin"),
                        jsonPath("$.lastName").value("Admin"),
                        jsonPath("$.admin").value(true),
                        jsonPath("$.createdAt").value(notNullValue()),
                        jsonPath("$.updatedAt").value(notNullValue())
                );
    }

    @Test
    @WithMockUser(username = "yoga@studio.com", roles = {"USER"})
    void givenInvalidUserId_whenGetUser_thenReturnsBadRequest() throws Exception {
        mockMvc.perform(get("/api/user/{id}", "invalid-id")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }


}
