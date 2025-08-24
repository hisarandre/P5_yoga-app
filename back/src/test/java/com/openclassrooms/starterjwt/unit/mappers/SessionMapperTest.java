package com.openclassrooms.starterjwt.unit.mappers;

import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.mapper.SessionMapper;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.models.User;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;

import java.util.Date;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class SessionMapperTest {

    private final SessionMapper sessionMapper = Mappers.getMapper(SessionMapper.class);

    @Test
    void givenBasicSessionDto_whenToEntity_thenMapsCorrectly() {
        SessionDto dto = new SessionDto();
        dto.setId(1L);
        dto.setName("Yoga Session");
        dto.setDescription("Basic yoga session");
        dto.setDate(new Date());
        dto.setUsers(Collections.emptyList());

        Session result = sessionMapper.toEntity(dto);

        assertEquals(dto.getId(), result.getId());
        assertEquals(dto.getName(), result.getName());
        assertEquals(dto.getDescription(), result.getDescription());
        assertEquals(dto.getDate(), result.getDate());
    }

    @Test
    void givenListOfDtos_whenToEntity_thenMapsListCorrectly() {
        SessionDto dto1 = new SessionDto();
        dto1.setId(1L);
        dto1.setName("Session 1");
        dto1.setUsers(Collections.emptyList());

        SessionDto dto2 = new SessionDto();
        dto2.setId(2L);
        dto2.setName("Session 2");
        dto2.setUsers(Collections.emptyList());

        List<Session> sessions = sessionMapper.toEntity(Arrays.asList(dto1, dto2));

        assertEquals(2, sessions.size());
        assertEquals("Session 1", sessions.get(0).getName());
        assertEquals("Session 2", sessions.get(1).getName());
    }

    @Test
    void givenSessionWithTeacher_whenToDto_thenReturnsCorrectDto() {
        Teacher teacher = new Teacher();
        teacher.setId(5L);
        teacher.setFirstName("John");
        teacher.setLastName("Doe");

        User user1 = new User();
        user1.setId(1L);
        User user2 = new User();
        user2.setId(2L);

        Session session = new Session();
        session.setId(1L);
        session.setName("Test Session");
        session.setTeacher(teacher);
        session.setUsers(Arrays.asList(user1, user2));

        SessionDto dto = sessionMapper.toDto(session);

        assertEquals(1L, dto.getId());
        assertEquals("Test Session", dto.getName());
        assertEquals(5L, dto.getTeacher_id());
        assertEquals(Arrays.asList(1L, 2L), dto.getUsers());
    }

    @Test
    void givenSessionWithNullUsers_whenToDto_thenReturnsEmptyUserList() {
        Session session = new Session();
        session.setId(1L);
        session.setUsers(null);

        SessionDto dto = sessionMapper.toDto(session);

        assertNotNull(dto.getUsers());
        assertTrue(dto.getUsers().isEmpty());
    }
}