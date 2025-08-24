package com.openclassrooms.starterjwt.unit.controllers;

import com.openclassrooms.starterjwt.controllers.UserController;
import com.openclassrooms.starterjwt.dto.UserDto;
import com.openclassrooms.starterjwt.mapper.UserMapper;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.services.UserService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserControllerTest {

    @InjectMocks
    private UserController userController;

    @Mock
    private UserMapper userMapper;

    @Mock
    private UserService userService;

    @AfterEach
    void clearSecurityContext() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void givenValidId_whenFindById_thenReturnsUser() {
        Long userId = 1L;
        User user = new User();
        UserDto userDto = new UserDto();
        when(userService.findById(userId)).thenReturn(user);
        when(userMapper.toDto(user)).thenReturn(userDto);

        ResponseEntity<?> response = userController.findById(userId.toString());

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(userDto, response.getBody());
        verify(userService, times(1)).findById(userId);
        verify(userMapper, times(1)).toDto(user);
    }

    @Test
    void givenValidId_whenDelete_thenReturnsOk() {
        Long userId = 1L;
        User user = new User();
        user.setEmail("test@example.com");
        UserDetails userDetails = mock(UserDetails.class);
        when(userService.findById(userId)).thenReturn(user);
        when(userDetails.getUsername()).thenReturn("test@example.com");
        SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken(userDetails, null));

        ResponseEntity<?> response = userController.save(userId.toString());

        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(userService, times(1)).findById(userId);
        verify(userService, times(1)).delete(userId);
    }
}