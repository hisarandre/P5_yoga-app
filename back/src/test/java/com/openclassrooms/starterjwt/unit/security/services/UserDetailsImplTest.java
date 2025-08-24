package com.openclassrooms.starterjwt.unit.security.services;

import com.openclassrooms.starterjwt.security.services.UserDetailsImpl;
import org.junit.jupiter.api.Test;

import java.util.Collection;
import java.util.HashSet;

import org.springframework.security.core.GrantedAuthority;

import static org.junit.jupiter.api.Assertions.*;

class UserDetailsImplTest {

    @Test
    void givenSameObject_whenEquals_thenReturnsTrue() {
        UserDetailsImpl user = UserDetailsImpl.builder()
                .id(1L)
                .username("john")
                .firstName("John")
                .lastName("Doe")
                .admin(false)
                .password("secret")
                .build();

        assertEquals(user, user);
    }

    @Test
    void givenNullObject_whenEquals_thenReturnsFalse() {
        UserDetailsImpl user = UserDetailsImpl.builder()
                .id(1L)
                .username("john")
                .firstName("John")
                .lastName("Doe")
                .admin(false)
                .password("secret")
                .build();

        assertNotEquals(null, user);
    }

    @Test
    void givenDifferentClass_whenEquals_thenReturnsFalse() {
        UserDetailsImpl user = UserDetailsImpl.builder()
                .id(1L)
                .username("john")
                .firstName("John")
                .lastName("Doe")
                .admin(false)
                .password("secret")
                .build();

        assertNotEquals("some string", user);
    }

    @Test
    void givenSameId_whenEquals_thenReturnsTrue() {
        UserDetailsImpl user1 = UserDetailsImpl.builder()
                .id(1L)
                .username("john")
                .build();
        UserDetailsImpl user2 = UserDetailsImpl.builder()
                .id(1L)
                .username("jane")
                .build();

        assertEquals(user1, user2);
    }

    @Test
    void givenDifferentId_whenEquals_thenReturnsFalse() {
        UserDetailsImpl user1 = UserDetailsImpl.builder()
                .id(1L)
                .username("john")
                .build();
        UserDetailsImpl user2 = UserDetailsImpl.builder()
                .id(2L)
                .username("john")
                .build();

        assertNotEquals(user1, user2);
    }

    @Test
    void givenOneNullId_whenEquals_thenReturnsFalse() {
        UserDetailsImpl user1 = UserDetailsImpl.builder()
                .id(null)
                .username("john")
                .build();
        UserDetailsImpl user2 = UserDetailsImpl.builder()
                .id(2L)
                .username("john")
                .build();

        assertNotEquals(user1, user2);
    }

    @Test
    void givenNullComparison_whenEquals_thenReturnsFalse() {
        UserDetailsImpl user = UserDetailsImpl.builder().id(1L).build();

        assertNotEquals(null, user);
    }

    @Test
    void givenDifferentClassType_whenEquals_thenReturnsFalse() {
        UserDetailsImpl user = UserDetailsImpl.builder().id(1L).build();
        Object other = new Object();

        assertNotEquals(user, other);
    }

    @Test
    void givenUserDetails_whenGetAuthorities_thenReturnsEmptyHashSet() {
        UserDetailsImpl user = UserDetailsImpl.builder().id(1L).build();

        Collection<? extends GrantedAuthority> authorities = user.getAuthorities();

        assertNotNull(authorities);
        assertTrue(authorities.isEmpty());
        assertEquals(HashSet.class, authorities.getClass());
    }

    @Test
    void givenUserDetails_whenCheckAccountStatus_thenAllStatusMethodsReturnTrue() {
        UserDetailsImpl user = UserDetailsImpl.builder().id(1L).build();

        assertTrue(user.isAccountNonExpired());
        assertTrue(user.isAccountNonLocked());
        assertTrue(user.isCredentialsNonExpired());
        assertTrue(user.isEnabled());
    }

    @Test
    void givenBothNullIds_whenEquals_thenReturnsTrue() {
        UserDetailsImpl user1 = UserDetailsImpl.builder()
                .id(null)
                .username("john")
                .build();
        UserDetailsImpl user2 = UserDetailsImpl.builder()
                .id(null)
                .username("jane")
                .build();

        assertEquals(user1, user2);
    }
}