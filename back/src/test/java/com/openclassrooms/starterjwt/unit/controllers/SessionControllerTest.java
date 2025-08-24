package com.openclassrooms.starterjwt.unit.controllers;

import com.openclassrooms.starterjwt.controllers.SessionController;
import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.mapper.SessionMapper;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.services.SessionService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class SessionControllerTest {

    @InjectMocks
    private SessionController sessionController;

    @Mock
    private SessionService sessionService;

    @Mock
    private SessionMapper sessionMapper;

    @Test
    void givenValidId_whenFindById_thenReturnsSession() {
        Long sessionId = 1L;
        Session session = new Session();
        SessionDto sessionDto = new SessionDto();
        when(sessionService.getById(sessionId)).thenReturn(session);
        when(sessionMapper.toDto(session)).thenReturn(sessionDto);

        ResponseEntity<?> response = sessionController.findById(sessionId.toString());

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(sessionDto, response.getBody());
        verify(sessionService, times(1)).getById(sessionId);
        verify(sessionMapper, times(1)).toDto(session);
    }

    @Test
    void givenExistingSessions_whenFindAll_thenReturnsListOfSessions() {
        List<Session> sessions = Collections.singletonList(new Session());
        List<SessionDto> sessionDtos = Collections.singletonList(new SessionDto());
        when(sessionService.findAll()).thenReturn(sessions);
        when(sessionMapper.toDto(sessions)).thenReturn(sessionDtos);

        ResponseEntity<?> response = sessionController.findAll();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(sessionDtos, response.getBody());
        verify(sessionService, times(1)).findAll();
        verify(sessionMapper, times(1)).toDto(sessions);
    }

    @Test
    void givenValidSessionDto_whenCreate_thenReturnsCreatedSession() {
        SessionDto sessionDto = new SessionDto();
        Session session = new Session();
        when(sessionMapper.toEntity(sessionDto)).thenReturn(session);
        when(sessionService.create(session)).thenReturn(session);
        when(sessionMapper.toDto(session)).thenReturn(sessionDto);

        ResponseEntity<?> response = sessionController.create(sessionDto);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(sessionDto, response.getBody());
        verify(sessionMapper, times(1)).toEntity(sessionDto);
        verify(sessionService, times(1)).create(session);
        verify(sessionMapper, times(1)).toDto(session);
    }

    @Test
    void givenValidSessionInfo_whenUpdate_thenReturnsUpdatedSession() {
        Long sessionId = 1L;
        SessionDto sessionDto = new SessionDto();
        Session session = new Session();
        when(sessionMapper.toEntity(sessionDto)).thenReturn(session);
        when(sessionService.update(sessionId, session)).thenReturn(session);
        when(sessionMapper.toDto(session)).thenReturn(sessionDto);

        ResponseEntity<?> response = sessionController.update(sessionId.toString(), sessionDto);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(sessionDto, response.getBody());
        verify(sessionMapper, times(1)).toEntity(sessionDto);
        verify(sessionService, times(1)).update(sessionId, session);
        verify(sessionMapper, times(1)).toDto(session);
    }

    @Test
    void givenValidId_whenDelete_thenReturnsOk() {
        Long sessionId = 1L;
        Session session = new Session();
        when(sessionService.getById(sessionId)).thenReturn(session);

        ResponseEntity<?> response = sessionController.save(sessionId.toString());

        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(sessionService, times(1)).getById(sessionId);
        verify(sessionService, times(1)).delete(sessionId);
    }

    @Test
    void givenValidSessionAndUserId_whenParticipate_thenReturnsOk() {
        long sessionId = 1L;
        long userId = 1L;

        ResponseEntity<?> response = sessionController.participate(Long.toString(sessionId), Long.toString(userId));

        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(sessionService, times(1)).participate(sessionId, userId);
    }

    @Test
    void givenValidIds_whenUnParticipate_thenReturnsOk() {
        long sessionId = 1L;
        long userId = 1L;

        ResponseEntity<?> response = sessionController.noLongerParticipate(Long.toString(sessionId), Long.toString(userId));

        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(sessionService, times(1)).noLongerParticipate(sessionId, userId);
    }
}