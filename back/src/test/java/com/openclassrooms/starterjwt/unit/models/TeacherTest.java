package com.openclassrooms.starterjwt.unit.models;

import com.openclassrooms.starterjwt.models.Teacher;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

public class TeacherTest {

    @Test
    void givenValidTeacher_whenGetData_thenAllDataAreCorrect() {
        LocalDateTime now = LocalDateTime.now();

        Teacher teacher = Teacher.builder()
                .id(1L)
                .firstName("John")
                .lastName("Doe")
                .createdAt(now)
                .updatedAt(now)
                .build();

        assertAll(
                () -> assertEquals(1L, teacher.getId()),
                () -> assertEquals("John", teacher.getFirstName()),
                () -> assertEquals("Doe", teacher.getLastName()),
                () -> assertEquals(now, teacher.getCreatedAt()),
                () -> assertEquals(now, teacher.getUpdatedAt())
        );
    }

    @Test
    void givenTeacher_whenUseSetters_thenGettersReturnCorrectValues() {
        Teacher teacher = new Teacher();
        LocalDateTime now = LocalDateTime.now();

        teacher.setId(100L)
                .setFirstName("New")
                .setLastName("Teacher")
                .setCreatedAt(now)
                .setUpdatedAt(now);

        assertAll(
                () -> assertEquals(100L, teacher.getId()),
                () -> assertEquals("New", teacher.getFirstName()),
                () -> assertEquals("Teacher", teacher.getLastName()),
                () -> assertEquals(now, teacher.getCreatedAt()),
                () -> assertEquals(now, teacher.getUpdatedAt())
        );
    }

    @Test
    void givenTwoTeachersWithSameId_whenEquals_thenShouldReturnTrue() {
        Teacher teacher1 = Teacher.builder()
                .id(1L)
                .firstName("John")
                .lastName("Doe")
                .build();

        Teacher teacher2 = Teacher.builder()
                .id(1L)
                .firstName("Jane")
                .lastName("Smith")
                .build();

        assertEquals(teacher1, teacher2);
    }

    @Test
    void givenTwoTeachersWithDifferentId_whenEquals_thenShouldReturnFalse() {
        Teacher teacher1 = Teacher.builder().id(1L).firstName("John").lastName("Doe").build();
        Teacher teacher2 = Teacher.builder().id(2L).firstName("Jane").lastName("Smith").build();

        assertNotEquals(teacher1, teacher2);
    }

    @Test
    void givenSameTeacherObject_whenEquals_thenShouldReturnTrue() {
        Teacher teacher = Teacher.builder().id(1L).firstName("John").lastName("Doe").build();
        assertEquals(teacher, teacher);
    }

    @Test
    void givenTeacher_whenComparedWithNull_thenShouldReturnFalse() {
        Teacher teacher = Teacher.builder().id(1L).firstName("John").lastName("Doe").build();
        assertNotEquals(null, teacher);
    }

    @Test
    void givenTeacher_whenComparedWithDifferentClass_thenShouldReturnFalse() {
        Teacher teacher = Teacher.builder().id(1L).firstName("John").lastName("Doe").build();
        String notATeacher = "NotATeacher";
        assertNotEquals(teacher, notATeacher);
    }

    @Test
    void givenTwoTeachersWithSameId_whenHashCode_thenShouldBeEqual() {
        Teacher teacher1 = Teacher.builder()
                .id(1L)
                .firstName("John")
                .lastName("Doe")
                .build();

        Teacher teacher2 = Teacher.builder()
                .id(1L)
                .firstName("Jane")
                .lastName("Smith")
                .build();

        assertEquals(teacher1.hashCode(), teacher2.hashCode());
    }

    @Test
    void givenTwoTeachersWithDifferentId_whenHashCode_thenShouldNotBeEqual() {
        Teacher teacher1 = Teacher.builder().id(1L).firstName("John").lastName("Doe").build();
        Teacher teacher2 = Teacher.builder().id(2L).firstName("Jane").lastName("Smith").build();

        assertNotEquals(teacher1.hashCode(), teacher2.hashCode());
    }

    @Test
    void givenTeachersWithNullIds_whenEquals_thenShouldReturnTrue() {
        Teacher teacher1 = new Teacher();
        Teacher teacher2 = new Teacher();

        assertEquals(teacher1, teacher2);
    }

    @Test
    void givenTeachersWithNullIds_whenHashCode_thenShouldBeEqual() {
        Teacher teacher1 = Teacher.builder().id(null).firstName("John").lastName("Doe").build();
        Teacher teacher2 = Teacher.builder().id(null).firstName("Jane").lastName("Smith").build();

        assertEquals(teacher1.hashCode(), teacher2.hashCode());
    }

    @Test
    void givenOneIdNull_whenEquals_thenShouldReturnFalse() {
        Teacher teacher1 = new Teacher();
        teacher1.setId(null);
        Teacher teacher2 = new Teacher();
        teacher2.setId(1L);

        assertNotEquals(teacher1, teacher2);
    }

    @Test
    void givenTeacher_whenToString_thenShouldContainAllFields() {
        LocalDateTime now = LocalDateTime.now();
        Teacher teacher = Teacher.builder()
                .id(1L)
                .firstName("John")
                .lastName("Doe")
                .createdAt(now)
                .updatedAt(now)
                .build();

        String toString = teacher.toString();
        assertTrue(toString.contains("John"));
        assertTrue(toString.contains("Doe"));
        assertTrue(toString.contains("createdAt"));
        assertTrue(toString.contains("updatedAt"));
    }

    @Test
    void givenTeacher_whenSetCreatedAt_thenShouldUpdateValue() {
        Teacher teacher = new Teacher();
        LocalDateTime now = LocalDateTime.now();
        teacher.setCreatedAt(now);
        assertEquals(now, teacher.getCreatedAt());
    }

    @Test
    void givenTeacher_whenSetUpdatedAt_thenShouldUpdateValue() {
        Teacher teacher = new Teacher();
        LocalDateTime now = LocalDateTime.now();
        teacher.setUpdatedAt(now);
        assertEquals(now, teacher.getUpdatedAt());
    }
}