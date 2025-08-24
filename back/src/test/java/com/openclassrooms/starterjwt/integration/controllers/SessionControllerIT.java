package com.openclassrooms.starterjwt.integration.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.starterjwt.dto.SessionDto;
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

import java.time.Instant;
import java.util.Arrays;
import java.util.Collections;
import java.util.Date;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@ActiveProfiles("test")
@AutoConfigureMockMvc
@Transactional
public class SessionControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private final long SESSION1_ID = 1L;
    private final long SESSION2_ID = 2L;
    private final long USER1_ID = 1L;
    private final long USER2_ID = 2L;
    private final long TEACHER1_ID = 1L;

    @Test
    @WithMockUser(username = "yoga@studio.com", roles = {"ADMIN"})
    void givenExistingSessionId_whenFindById_thenReturnsSession() throws Exception {
        mockMvc.perform(get("/api/session/{id}", SESSION1_ID)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(SESSION1_ID))
                .andExpect(jsonPath("$.name").value("Yoga"))
                .andExpect(jsonPath("$.description").value("Yoga session"));
    }

    @Test
    @WithMockUser(username = "yoga@studio.com", roles = {"ADMIN"})
    void givenNonExistingSessionId_whenFindById_thenReturnsNotFound() throws Exception {
        mockMvc.perform(get("/api/session/{id}", 999L)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(username = "yoga@studio.com", roles = {"ADMIN"})
    void givenInvalidSessionId_whenFindById_thenReturnsBadRequest() throws Exception {
        mockMvc.perform(get("/api/session/{id}", "invalid-id")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(username = "yoga@studio.com", roles = {"ADMIN"})
    void whenFindAll_thenReturnsSessions() throws Exception {
        mockMvc.perform(get("/api/session")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].id").value(SESSION1_ID))
                .andExpect(jsonPath("$[0].name").value("Yoga"))
                .andExpect(jsonPath("$[1].id").value(SESSION2_ID))
                .andExpect(jsonPath("$[1].name").value("Pilate"));
    }

    @Test
    @WithMockUser(username = "yoga@studio.com", roles = {"ADMIN"})
    void givenValidSessionDto_whenCreate_thenReturnsCreatedSession() throws Exception {
        SessionDto sessionDto = new SessionDto();
        sessionDto.setName("New Yoga Session");
        sessionDto.setDescription("New yoga session description");
        sessionDto.setDate(Date.from(Instant.parse("2025-03-01T10:00:00Z")));
        sessionDto.setTeacher_id(TEACHER1_ID);
        sessionDto.setUsers(Collections.singletonList(USER1_ID));

        mockMvc.perform(post("/api/session")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sessionDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("New Yoga Session"))
                .andExpect(jsonPath("$.description").value("New yoga session description"))
                .andExpect(jsonPath("$.teacher_id").value(TEACHER1_ID))
                .andExpect(jsonPath("$.users").isArray());
    }

    @Test
    @WithMockUser(username = "yoga@studio.com", roles = {"ADMIN"})
    void givenInvalidSessionDto_whenCreate_thenReturnsBadRequest() throws Exception {
        SessionDto invalidSessionDto = new SessionDto(); // Missing required fields

        mockMvc.perform(post("/api/session")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidSessionDto)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(username = "yoga@studio.com", roles = {"ADMIN"})
    void givenValidSessionDto_whenUpdate_thenReturnsUpdatedSession() throws Exception {
        SessionDto sessionDto = new SessionDto();
        sessionDto.setName("Updated Yoga Session");
        sessionDto.setDescription("Updated description");
        sessionDto.setDate(Date.from(Instant.parse("2025-03-01T11:00:00Z")));
        sessionDto.setTeacher_id(TEACHER1_ID);
        sessionDto.setUsers(Arrays.asList(USER1_ID, USER2_ID));

        mockMvc.perform(put("/api/session/{id}", SESSION1_ID)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sessionDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(SESSION1_ID))
                .andExpect(jsonPath("$.name").value("Updated Yoga Session"))
                .andExpect(jsonPath("$.description").value("Updated description"));
    }

    @Test
    @WithMockUser(username = "yoga@studio.com", roles = {"ADMIN"})
    void givenInvalidSessionId_whenUpdate_thenReturnsBadRequest() throws Exception {
        SessionDto sessionDto = new SessionDto();
        sessionDto.setName("Updated Session");
        sessionDto.setDescription("Updated description");
        sessionDto.setDate(new Date());
        sessionDto.setTeacher_id(TEACHER1_ID);

        mockMvc.perform(put("/api/session/{id}", "invalid-id")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sessionDto)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(username = "yoga@studio.com", roles = {"ADMIN"})
    void givenExistingSessionId_whenDelete_thenReturnsOk() throws Exception {
        mockMvc.perform(delete("/api/session/{id}", SESSION1_ID)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

        // Verify deletion
        mockMvc.perform(get("/api/session/{id}", SESSION1_ID)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(username = "yoga@studio.com", roles = {"ADMIN"})
    void givenNonExistingSessionId_whenDelete_thenReturnsNotFound() throws Exception {
        mockMvc.perform(delete("/api/session/{id}", 999L)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(username = "yoga@studio.com", roles = {"ADMIN"})
    void givenExistingSessionAndUser_whenParticipate_thenReturnsOk() throws Exception {
        mockMvc.perform(post("/api/session/{id}/participate/{userId}", SESSION2_ID, USER1_ID)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

        // Verify participation
        mockMvc.perform(get("/api/session/{id}", SESSION2_ID)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.users").isArray());
    }

    @Test
    @WithMockUser(username = "yoga@studio.com", roles = {"ADMIN"})
    void givenNonExistingSession_whenParticipate_thenReturnsNotFound() throws Exception {
        mockMvc.perform(post("/api/session/{id}/participate/{userId}", 999L, USER1_ID)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(username = "yoga@studio.com", roles = {"ADMIN"})
    void givenNonExistingUser_whenParticipate_thenReturnsNotFound() throws Exception {
        mockMvc.perform(post("/api/session/{id}/participate/{userId}", SESSION1_ID, 999L)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(username = "yoga@studio.com", roles = {"ADMIN"})
    void givenExistingSessionAndUser_whenUnParticipate_thenReturnsOk() throws Exception {
        mockMvc.perform(delete("/api/session/{id}/participate/{userId}", SESSION2_ID, USER2_ID)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

        // Verify user removed from participation
        mockMvc.perform(get("/api/session/{id}", SESSION2_ID)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.users").isEmpty());
    }

    @Test
    @WithMockUser(username = "yoga@studio.com", roles = {"ADMIN"})
    void givenNonExistingSession_whenUnParticipate_thenReturnsNotFound() throws Exception {
        mockMvc.perform(delete("/api/session/{id}/participate/{userId}", 999L, USER1_ID)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(username = "yoga@studio.com", roles = {"ADMIN"})
    void givenInvalidSessionId_whenUnParticipate_thenReturnsBadRequest() throws Exception {
        mockMvc.perform(delete("/api/session/{id}/participate/{userId}", "invalid-id", USER1_ID)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(username = "yoga@studio.com", roles = {"ADMIN"})
    void givenInvalidSessionId_whenDelete_thenReturnsBadRequest() throws Exception {
        mockMvc.perform(delete("/api/session/{id}", "invalid-id")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(username = "yoga@studio.com", roles = {"ADMIN"})
    void givenInvalidSessionId_whenParticipate_thenReturnsBadRequest() throws Exception {
        mockMvc.perform(post("/api/session/{id}/participate/{userId}", "invalid-id", USER1_ID)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(username = "yoga@studio.com", roles = {"ADMIN"})
    void givenInvalidUserId_whenParticipate_thenReturnsBadRequest() throws Exception {
        mockMvc.perform(post("/api/session/{id}/participate/{userId}", SESSION1_ID, "invalid-userId")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }
}