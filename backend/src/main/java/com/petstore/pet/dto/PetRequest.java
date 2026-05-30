package com.petstore.pet.dto;

import com.petstore.pet.PetCategory;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public record PetRequest(
    @NotBlank(message = "Name is required")
    @Size(max = 100, message = "Name must be at most 100 characters")
    String name,

    @NotBlank(message = "Breed is required")
    @Size(max = 100, message = "Breed must be at most 100 characters")
    String breed,

    @NotNull(message = "Age is required")
    @Min(value = 0, message = "Age must be zero or greater")
    Integer age,

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.01", message = "Price must be greater than zero")
    BigDecimal price,

    @NotBlank(message = "Description is required")
    String description,

    @NotBlank(message = "Image URL is required")
    @Size(max = 500, message = "Image URL must be at most 500 characters")
    String imageUrl,

    @NotNull(message = "Availability is required")
    Boolean available,

    @NotNull(message = "Category is required")
    PetCategory category
) {
}
