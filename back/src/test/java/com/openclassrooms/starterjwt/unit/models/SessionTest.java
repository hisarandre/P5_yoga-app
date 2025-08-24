package com.openclassrooms.starterjwt.unit.models;

import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.models.User;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.Date;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class SessionTest {

    @Test
    void givenValidSession_whenGetData_thenAllDataAreCorrect() {
        Teacher teacher = new Teacher().setId(1L).setFirstName("John").setLastName("Doe");
        User user1 = new User().setId(10L);
        User user2 = new User().setId(11L);

        LocalDateTime now = LocalDateTime.now();
        Date sessionDate = new Date();

        Session session = Session.builder()
                .id(100L)
                .name("Yoga")
                .date(sessionDate)
                .description("Yoga session")
                .teacher(teacher)
                .users(Arrays.asList(user1, user2))
                .createdAt(now)
                .updatedAt(now)
                .build();

        // Check all fields
        assertAll(
                () -> assertEquals(100L, session.getId()),
                () -> assertEquals("Yoga", session.getName()),
                () -> assertEquals(sessionDate, session.getDate()),
                () -> assertEquals("Yoga session", session.getDescription()),
                () -> assertEquals(teacher, session.getTeacher()),
                () -> assertEquals(2, session.getUsers().size()),
                () -> assertTrue(session.getUsers().contains(user1)),
                () -> assertTrue(session.getUsers().contains(user2)),
                () -> assertEquals(now, session.getCreatedAt()),
                () -> assertEquals(now, session.getUpdatedAt())
        );
    }

    @Test
    void givenSession_whenTeacherIsNull_thenTeacherIsNull() {
        Session session = Session.builder()
                .id(1L)
                .name("No Teacher Class")
                .date(new Date())
                .description("Description")
                .teacher(null)
                .build();

        assertNull(session.getTeacher());
    }

    @Test
    void givenSession_whenUsersListIsEmpty_thenUsersListIsEmpty() {
        Session session = Session.builder()
                .id(1L)
                .name("Empty Users")
                .date(new Date())
                .description("Description")
                .users(Collections.emptyList())
                .build();

        assertNotNull(session.getUsers());
        assertTrue(session.getUsers().isEmpty());
    }

    @Test
    void givenSession_whenUsersListIsNull_thenUsersListIsNull() {
        Session session = Session.builder()
                .id(1L)
                .name("Null Users")
                .date(new Date())
                .description("Description")
                .users(null)
                .build();

        assertNull(session.getUsers());
    }

    @Test
    void givenSessions_whenEquals_thenCorrect() {
        Session s1 = new Session().setId(1L);
        Session s2 = new Session().setId(1L);
        Session s3 = new Session().setId(2L);
        Object obj = new Object();

        assertEquals(s1, s2);
        assertNotEquals(s1, s3);
        assertNotEquals(s1, obj);
        assertNotEquals(null, s1);
    }

    @Test
    void givenSessions_whenHashCode_thenCorrect() {
        Session s1 = new Session().setId(1L);
        Session s2 = new Session().setId(1L);
        Session s3 = new Session().setId(2L);

        assertEquals(s1.hashCode(), s2.hashCode());
        assertNotEquals(s1.hashCode(), s3.hashCode());
    }

    @Test
    void givenSessions_whenIdIsNull_thenEqualsHandlesIt() {
        Session s1 = new Session();
        Session s2 = new Session();
        assertEquals(s1, s2);

        Session s3 = new Session().setId(1L);
        assertNotEquals(s1, s3);
    }
}