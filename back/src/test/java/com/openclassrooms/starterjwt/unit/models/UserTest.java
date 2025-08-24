package com.openclassrooms.starterjwt.unit.models;

import com.openclassrooms.starterjwt.models.User;
import org.junit.jupiter.api.Test;

import javax.validation.ConstraintViolation;
import javax.validation.Validation;
import javax.validation.Validator;
import javax.validation.ValidatorFactory;
import java.time.LocalDateTime;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

public class UserTest {

    private final Validator validator;

    public UserTest() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        this.validator = factory.getValidator();
    }

    @Test
    public void hashCode_shouldBeEquals_GivenTwoUsersWithSameId() {
        User user1 = User.builder()
                .id(1L)
                .email("user1@gmail.com")
                .firstName("user1")
                .lastName("user1")
                .password("user1")
                .admin(false)
                .build();
        User user2 = User.builder()
                .id(1L)
                .email("user2@gmail.com")
                .firstName("user2")
                .lastName("user2")
                .password("user2")
                .admin(true)
                .build();

        assertEquals(user1.hashCode(), user2.hashCode(), "HashCode should be equal for users with the same ID.");
    }

    @Test
    public void hashCode_shouldNotBeEquals_GivenTwoUsersWithDifferentId() {
        User user1 = User.builder()
                .id(1L)
                .email("user1@gmail.com")
                .firstName("user1")
                .lastName("user1")
                .password("user1")
                .admin(false)
                .build();
        User user2 = User.builder()
                .id(2L)
                .email("user2@gmail.com")
                .firstName("user2")
                .lastName("user2")
                .password("user2")
                .admin(false)
                .build();

        assertNotEquals(user1.hashCode(), user2.hashCode(), "HashCode should not be equal for users with different IDs.");
    }

    @Test
    public void equals_shouldReturnTrue_GivenUsersWithSameId() {
        User user1 = User.builder()
                .id(1L)
                .email("user1@gmail.com")
                .firstName("user1")
                .lastName("user1")
                .password("user1")
                .admin(false)
                .build();
        User user2 = User.builder()
                .id(1L)
                .email("user2@gmail.com")
                .firstName("user2")
                .lastName("user2")
                .password("user2")
                .admin(true)
                .build();

        assertEquals(user1, user2, "Users with the same ID should be equal.");
    }

    @Test
    public void equals_shouldReturnFalse_GivenUsersWithDifferentId() {
        User user1 = User.builder()
                .id(1L)
                .email("user1@gmail.com")
                .firstName("user1")
                .lastName("user1")
                .password("user1")
                .admin(false)
                .build();
        User user2 = User.builder()
                .id(2L)
                .email("user2@gmail.com")
                .firstName("user2")
                .lastName("user2")
                .password("user2")
                .admin(false)
                .build();

        assertNotEquals(user1, user2, "Users with different IDs should not be equal.");
    }

    @Test
    public void toString_ShouldContainAllFields() {
        User user = User.builder()
                .id(1L)
                .email("test@example.com")
                .firstName("John")
                .lastName("Doe")
                .password("password123")
                .admin(true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        String toString = user.toString();
        assertTrue(toString.contains("test@example.com"));
        assertTrue(toString.contains("John"));
        assertTrue(toString.contains("Doe"));
        assertTrue(toString.contains("password123"));
        assertTrue(toString.contains("admin=true"));
    }

    @Test
    public void user_ShouldBeCreated_WithValidFields() {
        User user = new User("test@example.com", "Doe", "John", "password123", true);
        assertNotNull(user);
        assertEquals("test@example.com", user.getEmail());
        assertEquals("Doe", user.getLastName());
        assertEquals("John", user.getFirstName());
        assertEquals("password123", user.getPassword());
        assertTrue(user.isAdmin());
    }

    @Test
    public void user_ShouldSupportMethodChaining() {
        User user = new User()
                .setEmail("user@example.com")
                .setFirstName("Jane")
                .setLastName("Doe")
                .setPassword("securepassword")
                .setAdmin(true);

        assertEquals("user@example.com", user.getEmail());
        assertEquals("Jane", user.getFirstName());
        assertEquals("Doe", user.getLastName());
        assertEquals("securepassword", user.getPassword());
        assertTrue(user.isAdmin());
    }

    @Test
    public void user_ShouldNotBeValid_WithInvalidEmail() {
        User user = new User("invalid-email", "Doe", "John", "password123", true);

        Set<ConstraintViolation<User>> violations = validator.validate(user);

        assertFalse(violations.isEmpty(), "Validation should fail for an invalid email.");
    }

    @Test
    public void equals_shouldReturnTrue_WhenComparingSameObject() {
        User user = User.builder()
                .id(1L)
                .email("user1@gmail.com")
                .firstName("user1")
                .lastName("user1")
                .password("user1")
                .admin(false)
                .build();

        assertEquals(user, user, "An object should be equal to itself.");
    }

    @Test
    public void equals_shouldReturnFalse_WhenComparingWithNull() {
        User user = User.builder()
                .id(1L)
                .email("user1@gmail.com")
                .firstName("user1")
                .lastName("user1")
                .password("user1")
                .admin(false)
                .build();

        assertNotEquals(null, user, "User should not be equal to null.");
    }

    @Test
    public void equals_shouldReturnFalse_WhenComparingWithDifferentClass() {
        User user = User.builder()
                .id(1L)
                .email("user1@gmail.com")
                .firstName("user1")
                .lastName("user1")
                .password("user1")
                .admin(false)
                .build();

        String notAUser = "NotAUser";
        assertNotEquals(user, notAUser, "User should not be equal to an object of another class.");
    }

    @Test
    public void hashCode_shouldWork_WhenIdIsNull() {
        User user1 = User.builder()
                .id(null)
                .email("user1@gmail.com")
                .firstName("user1")
                .lastName("user1")
                .password("user1")
                .admin(false)
                .build();

        User user2 = User.builder()
                .id(null)
                .email("user2@gmail.com")
                .firstName("user2")
                .lastName("user2")
                .password("user2")
                .admin(true)
                .build();

        assertEquals(user1.hashCode(), user2.hashCode(), "HashCode should be equal for users with null IDs.");
    }

    @Test
    public void userBuilder_toString_ShouldContainAllFields() {
        User.UserBuilder builder = User.builder()
                .id(1L)
                .email("builder@example.com")
                .firstName("Builder")
                .lastName("User")
                .password("secret")
                .admin(true);

        String builderToString = builder.toString();

        assertTrue(builderToString.contains("builder@example.com"));
        assertTrue(builderToString.contains("Builder"));
        assertTrue(builderToString.contains("User"));
        assertTrue(builderToString.contains("secret"));
        assertTrue(builderToString.contains("admin=true"));
    }

    @Test
    public void equals_shouldReturnTrue_WhenBothIdsAreNull() {
        User user1 = new User();
        User user2 = new User();

        assertEquals(user1, user2, "Users with both null IDs should be equal.");
    }

    @Test
    public void user_ShouldThrowException_WithNullEmail() {
        assertThrows(NullPointerException.class,
                () -> new User(null, "Doe", "John", "password123", true),
                "Should throw NullPointerException when email is null");
    }

    @Test
    public void user_ShouldNotBeValid_WithTooLongEmail() {
        String longEmail = "verylongemailaddressthatexceedsfiftycharacterslimit@example.com"; // Over 50 chars
        User user = new User(longEmail, "Doe", "John", "password123", true);

        Set<ConstraintViolation<User>> violations = validator.validate(user);

        assertFalse(violations.isEmpty(), "Validation should fail for email exceeding 50 characters.");
    }
}