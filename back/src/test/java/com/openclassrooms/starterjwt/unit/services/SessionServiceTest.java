package com.openclassrooms.starterjwt.unit.services;

import com.openclassrooms.starterjwt.exception.BadRequestException;
import com.openclassrooms.starterjwt.exception.NotFoundException;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.SessionRepository;
import com.openclassrooms.starterjwt.repository.UserRepository;
import com.openclassrooms.starterjwt.services.SessionService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class SessionServiceTest {

    @Mock
    private SessionRepository sessionRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private SessionService sessionService;

    @Test
    void givenValidSession_whenCreate_thenReturnsCreatedSession() {
        Session session = new Session();
        when(sessionRepository.save(session)).thenReturn(session);

        Session result = sessionService.create(session);

        assertEquals(session, result);
        verify(sessionRepository, times(1)).save(session);
    }

    @Test
    void givenSessionsExist_whenFindAll_thenReturnsListOfSessions() {
        List<Session> sessions = Arrays.asList(new Session(), new Session());
        when(sessionRepository.findAll()).thenReturn(sessions);

        List<Session> result = sessionService.findAll();

        assertEquals(sessions, result);
        verify(sessionRepository, times(1)).findAll();
    }

    @Test
    void givenExistingId_whenGetById_thenReturnsSession() {
        Long sessionId = 1L;
        Session session = new Session();
        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(session));

        Session result = sessionService.getById(sessionId);

        assertEquals(session, result);
        verify(sessionRepository, times(1)).findById(sessionId);
    }

    @Test
    void givenValidSessionData_whenUpdate_thenReturnsUpdatedSession() {
        Long sessionId = 1L;
        Session session = Session.builder().id(sessionId).build();
        when(sessionRepository.save(session)).thenReturn(session);

        Session result = sessionService.update(sessionId, session);

        assertEquals(session, result);
        verify(sessionRepository, times(1)).save(session);
    }

    @Test
    void givenValidSessionAndUser_whenParticipate_thenAddsUserToSession() {
        Long sessionId = 1L;
        Long userId = 1L;
        Session session = Session.builder().users(new ArrayList<>()).build();
        User user = new User();
        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(session));
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        sessionService.participate(sessionId, userId);

        assertTrue(session.getUsers().contains(user));
        verify(sessionRepository, times(1)).save(session);
    }

    @Test
    void givenParticipatingUser_whenUnParticipate_thenRemovesUserFromSession() {
        Long sessionId = 1L;
        Long userId = 1L;
        User userToRemove = new User();
        userToRemove.setId(userId);

        User anotherUser = new User();
        anotherUser.setId(2L);

        Session session = Session.builder().users(new ArrayList<>()).build();
        session.getUsers().add(userToRemove);
        session.getUsers().add(anotherUser);
        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(session));

        sessionService.noLongerParticipate(sessionId, userId);

        assertFalse(session.getUsers().contains(userToRemove));
        assertTrue(session.getUsers().contains(anotherUser));
        verify(sessionRepository, times(1)).save(session);
    }

    @Test
    void givenInvalidSessionId_whenParticipate_thenThrowsNotFoundException() {
        Long sessionId = 1L;
        Long userId = 1L;
        User user = new User();
        user.setId(userId);
        when(sessionRepository.findById(sessionId)).thenReturn(Optional.empty());
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        assertThrows(NotFoundException.class, () -> sessionService.participate(sessionId, userId));
    }

    @Test
    void givenNonExistentUserId_whenParticipate_thenThrowsNotFoundException() {
        Long sessionId = 1L;
        Long userId = 1L;
        Session session = Session.builder().users(new ArrayList<>()).build();
        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(session));
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> sessionService.participate(sessionId, userId));
    }

    @Test
    void givenUserAlreadyParticipating_whenParticipate_thenThrowsBadRequestException() {
        Long sessionId = 1L;
        Long userId = 1L;
        User user = new User();
        user.setId(userId);
        Session session = Session.builder().users(Collections.singletonList(user)).build();
        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(session));
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        assertThrows(BadRequestException.class, () -> sessionService.participate(sessionId, userId));
    }

}
