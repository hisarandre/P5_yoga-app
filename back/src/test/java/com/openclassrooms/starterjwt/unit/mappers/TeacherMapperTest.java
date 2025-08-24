package com.openclassrooms.starterjwt.unit.mappers;

import com.openclassrooms.starterjwt.dto.TeacherDto;
import com.openclassrooms.starterjwt.mapper.TeacherMapper;
import com.openclassrooms.starterjwt.models.Teacher;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class TeacherMapperTest {

    private final TeacherMapper teacherMapper = Mappers.getMapper(TeacherMapper.class);

    @Test
    void toEntity_and_toDto_mapsCorrectly() {
        TeacherDto dto = new TeacherDto();
        dto.setId(1L);
        dto.setFirstName("John");
        dto.setLastName("Smith");

        Teacher teacher = teacherMapper.toEntity(dto);
        assertEquals(dto.getId(), teacher.getId());
        assertEquals(dto.getFirstName(), teacher.getFirstName());
        assertEquals(dto.getLastName(), teacher.getLastName());

        TeacherDto resultDto = teacherMapper.toDto(teacher);
        assertEquals(teacher.getId(), resultDto.getId());
        assertEquals(teacher.getFirstName(), resultDto.getFirstName());
        assertEquals(teacher.getLastName(), resultDto.getLastName());
    }

    @Test
    void listMapping_handlesNullElements() {
        TeacherDto validDto = new TeacherDto();
        validDto.setId(1L);
        validDto.setFirstName("John");

        List<Teacher> entityList = teacherMapper.toEntity(Arrays.asList(validDto, null));
        assertNotNull(entityList.get(0));
        assertNull(entityList.get(1));

        Teacher teacher = Teacher.builder().id(2L).firstName("Alice").build();
        List<TeacherDto> dtoList = teacherMapper.toDto(Arrays.asList(teacher, null));
        assertNotNull(dtoList.get(0));
        assertNull(dtoList.get(1));
    }
}
