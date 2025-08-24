package com.openclassrooms.starterjwt.unit.mappers;

import com.openclassrooms.starterjwt.dto.UserDto;
import com.openclassrooms.starterjwt.mapper.UserMapper;
import com.openclassrooms.starterjwt.models.User;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class UserMapperTest {

    private final UserMapper userMapper = Mappers.getMapper(UserMapper.class);

    @Test
    void singleMapping_toDto_and_toEntity() {
        // Create User with all required fields
        User user = User.builder()
                .id(1L)
                .firstName("John")
                .lastName("Doe")
                .email("john@test.com")
                .password("password123")
                .build();

        UserDto dto = userMapper.toDto(user);
        assertEquals(user.getFirstName(), dto.getFirstName());
        assertEquals(user.getLastName(), dto.getLastName());
        assertEquals(user.getEmail(), dto.getEmail());

        User entity = userMapper.toEntity(dto);
        assertEquals(dto.getFirstName(), entity.getFirstName());
        assertEquals(dto.getLastName(), entity.getLastName());
        assertEquals(dto.getEmail(), entity.getEmail());
    }

    @Test
    void listMapping_handlesNullElements() {
        // Entity list with a null element
        User user = User.builder()
                .id(1L)
                .firstName("John")
                .lastName("Doe")
                .email("john@test.com")
                .password("password123")
                .build();
        List<User> entityList = Arrays.asList(user, null);

        // Convert entity list to DTO list
        List<UserDto> dtoList = userMapper.toDto(entityList);

        assertNotNull(dtoList.get(0));
        assertNull(dtoList.get(1));

        // DTO list with a null element
        UserDto dto = new UserDto();
        dto.setFirstName("Jane");
        dto.setLastName("Smith");
        dto.setEmail("jane@test.com");
        dto.setPassword("password123");
        List<UserDto> dtoListWithNull = Arrays.asList(dto, null);

        // Convert DTO list to entity list
        List<User> entityListFromDto = userMapper.toEntity(dtoListWithNull);

        assertNotNull(entityListFromDto.get(0));
        assertNull(entityListFromDto.get(1));
    }
}