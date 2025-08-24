package com.openclassrooms.starterjwt.unit.security.jwt;

import com.openclassrooms.starterjwt.security.jwt.AuthTokenFilter;
import com.openclassrooms.starterjwt.security.jwt.JwtUtils;
import com.openclassrooms.starterjwt.security.services.UserDetailsServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpHeaders;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import java.io.IOException;
import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuthTokenFilterTest {

    @Mock
    private JwtUtils jwtUtils;

    @Mock
    private UserDetailsServiceImpl userDetailsService;

    @Mock
    private FilterChain filterChain;

    @InjectMocks
    private AuthTokenFilter authTokenFilter;

    private MockHttpServletRequest request;
    private MockHttpServletResponse response;

    @BeforeEach
    void setUp() {
        request = new MockHttpServletRequest();
        response = new MockHttpServletResponse();
        SecurityContextHolder.clearContext();
    }

    @Test
    void givenValidToken_whenDoFilter_thenSetsAuthentication() throws ServletException, IOException {
        String token = "validToken";
        request.addHeader(HttpHeaders.AUTHORIZATION, "Bearer " + token);
        UserDetails userDetails = User
                .withUsername("testUser")
                .password("password")
                .authorities(Collections.emptyList())
                .build();

        when(jwtUtils.validateJwtToken(token)).thenReturn(true);
        when(jwtUtils.getUserNameFromJwtToken(token)).thenReturn("testUser");
        when(userDetailsService.loadUserByUsername("testUser")).thenReturn(userDetails);

        authTokenFilter.doFilter(request, response, filterChain);

        UsernamePasswordAuthenticationToken authentication =
                (UsernamePasswordAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        assertNotNull(authentication);
        verify(jwtUtils, times(1)).validateJwtToken(token);
        verify(userDetailsService, times(1)).loadUserByUsername("testUser");
    }

    @Test
    void givenInvalidToken_whenDoFilter_thenDoesNotSetAuthentication() throws ServletException, IOException {
        String token = "invalidToken";
        request.addHeader(HttpHeaders.AUTHORIZATION, "Bearer " + token);

        when(jwtUtils.validateJwtToken(token)).thenReturn(false);

        authTokenFilter.doFilter(request, response, filterChain);

        assertNull(SecurityContextHolder.getContext().getAuthentication());
        verify(jwtUtils, times(1)).validateJwtToken(token);
        verifyNoInteractions(userDetailsService);
    }

    @Test
    void givenNoAuthorizationHeader_whenDoFilter_thenDoesNotSetAuthentication() throws ServletException, IOException {
        authTokenFilter.doFilter(request, response, filterChain);

        assertNull(SecurityContextHolder.getContext().getAuthentication());
        verifyNoInteractions(jwtUtils, userDetailsService);
    }

    @Test
    void givenInvalidAuthorizationHeaderFormat_whenDoFilter_thenDoesNotSetAuthentication() throws ServletException, IOException {
        request.addHeader(HttpHeaders.AUTHORIZATION, "InvalidTokenFormat");

        authTokenFilter.doFilter(request, response, filterChain);

        assertNull(SecurityContextHolder.getContext().getAuthentication());
        verifyNoInteractions(jwtUtils, userDetailsService);
    }
}