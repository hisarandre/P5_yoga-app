package com.openclassrooms.starterjwt.unit.payloads.requests;

import com.openclassrooms.starterjwt.payload.request.SignupRequest;
import org.junit.jupiter.api.Test;

import javax.validation.ConstraintViolation;
import javax.validation.Validation;
import javax.validation.Validator;
import javax.validation.ValidatorFactory;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

public class SignupRequestTest {

    private final Validator validator;

    public SignupRequestTest() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        this.validator = factory.getValidator();
    }

    @Test
    public void givenShortLastName_whenValidate_thenViolation() {
        SignupRequest signupRequest = createSampleSignupRequest();
        signupRequest.setLastName("D"); // too short

        Set<ConstraintViolation<SignupRequest>> violations = validator.validate(signupRequest);

        assertFalse(violations.isEmpty());
        ConstraintViolation<SignupRequest> violation = violations.iterator().next();
        assertEquals("lastName", violation.getPropertyPath().toString());
    }

    @Test
    public void givenShortPassword_whenValidate_thenViolation() {
        SignupRequest signupRequest = createSampleSignupRequest();
        signupRequest.setPassword("123"); // too short

        Set<ConstraintViolation<SignupRequest>> violations = validator.validate(signupRequest);

        assertFalse(violations.isEmpty());
        ConstraintViolation<SignupRequest> violation = violations.iterator().next();
        assertEquals("password", violation.getPropertyPath().toString());
    }

    @Test
    public void givenNullEmail_whenValidate_thenViolation() {
        SignupRequest signupRequest = createSampleSignupRequest();
        signupRequest.setEmail(null);

        Set<ConstraintViolation<SignupRequest>> violations = validator.validate(signupRequest);

        assertFalse(violations.isEmpty());
        ConstraintViolation<SignupRequest> violation = violations.iterator().next();
        assertEquals("email", violation.getPropertyPath().toString());
    }

    @Test
    public void givenSameReference_whenEquals_thenTrue() {
        SignupRequest signupRequest = createSampleSignupRequest();
        assertEquals(signupRequest, signupRequest);
    }

    @Test
    public void givenNull_whenEquals_thenFalse() {
        SignupRequest signupRequest = createSampleSignupRequest();
        assertNotEquals(signupRequest, null);
    }

    @Test
    public void givenDifferentClass_whenEquals_thenFalse() {
        SignupRequest signupRequest = createSampleSignupRequest();
        Object obj = new Object();
        assertNotEquals(signupRequest, obj);
    }

    @Test
    public void givenIdenticalValues_whenEquals_thenTrue() {
        SignupRequest signupRequest1 = createSampleSignupRequest();
        SignupRequest signupRequest2 = createSampleSignupRequest();
        assertEquals(signupRequest1, signupRequest2);
    }

    @Test
    public void givenDifferentEmail_whenEquals_thenFalse() {
        SignupRequest signupRequest1 = createSampleSignupRequest();
        SignupRequest signupRequest2 = createSampleSignupRequest();
        signupRequest2.setEmail("different@example.com");
        assertNotEquals(signupRequest1, signupRequest2);
    }

    @Test
    public void givenDifferentFirstName_whenEquals_thenFalse() {
        SignupRequest signupRequest1 = createSampleSignupRequest();
        SignupRequest signupRequest2 = createSampleSignupRequest();
        signupRequest2.setFirstName("Jane");
        assertNotEquals(signupRequest1, signupRequest2);
    }

    @Test
    public void givenDifferentLastName_whenEquals_thenFalse() {
        SignupRequest signupRequest1 = createSampleSignupRequest();
        SignupRequest signupRequest2 = createSampleSignupRequest();
        signupRequest2.setLastName("Smith");
        assertNotEquals(signupRequest1, signupRequest2);
    }

    @Test
    public void givenDifferentPassword_whenEquals_thenFalse() {
        SignupRequest signupRequest1 = createSampleSignupRequest();
        SignupRequest signupRequest2 = createSampleSignupRequest();
        signupRequest2.setPassword("differentPassword123");
        assertNotEquals(signupRequest1, signupRequest2);
    }

    @Test
    public void givenAllNullFields_whenEquals_thenConsistent() {
        SignupRequest signupRequest1 = new SignupRequest();
        signupRequest1.setEmail(null);
        signupRequest1.setFirstName(null);
        signupRequest1.setLastName(null);
        signupRequest1.setPassword(null);

        SignupRequest signupRequest2 = new SignupRequest();
        signupRequest2.setEmail(null);
        signupRequest2.setFirstName(null);
        signupRequest2.setLastName(null);
        signupRequest2.setPassword(null);

        assertEquals(signupRequest1, signupRequest2);
    }

    @Test
    public void givenMixedNullFields_whenEquals_thenFalse() {
        SignupRequest signupRequest1 = new SignupRequest();
        signupRequest1.setEmail("test@example.com");
        signupRequest1.setFirstName(null);
        signupRequest1.setLastName("Doe");
        signupRequest1.setPassword("password123");

        SignupRequest signupRequest2 = new SignupRequest();
        signupRequest2.setEmail("test@example.com");
        signupRequest2.setFirstName("John");
        signupRequest2.setLastName("Doe");
        signupRequest2.setPassword("password123");

        assertNotEquals(signupRequest1, signupRequest2);
    }

    @Test
    public void givenOneNullEmailOtherNot_whenEquals_thenFalse() {
        SignupRequest signupRequest1 = createSampleSignupRequest();
        SignupRequest signupRequest2 = createSampleSignupRequest();
        signupRequest2.setEmail(null);
        assertNotEquals(signupRequest1, signupRequest2);
    }

    @Test
    public void givenIdenticalObjects_whenHashCode_thenEqual() {
        SignupRequest signupRequest1 = createSampleSignupRequest();
        SignupRequest signupRequest2 = createSampleSignupRequest();
        assertEquals(signupRequest1.hashCode(), signupRequest2.hashCode());
    }

    @Test
    public void givenAllNullFields_whenHashCode_thenReturnsValue() {
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setEmail(null);
        signupRequest.setFirstName(null);
        signupRequest.setLastName(null);
        signupRequest.setPassword(null);

        int hashCode = signupRequest.hashCode();
        assertNotNull(hashCode); // Should not throw NPE
    }

    @Test
    public void givenSomeNullFields_whenHashCode_thenReturnsValue() {
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setEmail("test@example.com");
        signupRequest.setFirstName(null);
        signupRequest.setLastName("Doe");
        signupRequest.setPassword(null);

        int hashCode = signupRequest.hashCode();
        assertNotNull(hashCode);
    }

    @Test
    public void givenSignupRequest_whenToString_thenContainsAllFields() {
        SignupRequest signupRequest = createSampleSignupRequest();

        String actual = signupRequest.toString();

        assertNotNull(actual);
        assertTrue(actual.contains("SignupRequest"));
        assertTrue(actual.contains("email=test@example.com"));
        assertTrue(actual.contains("firstName=John"));
        assertTrue(actual.contains("lastName=Doe"));
        assertTrue(actual.contains("password=password123"));
    }

    private SignupRequest createSampleSignupRequest() {
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setEmail("test@example.com");
        signupRequest.setFirstName("John");
        signupRequest.setLastName("Doe");
        signupRequest.setPassword("password123");
        return signupRequest;
    }
}