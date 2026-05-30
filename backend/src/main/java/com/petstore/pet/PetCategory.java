package com.petstore.pet;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum PetCategory {
    CATS,
    DOGS,
    FISH,
    BIRDS;

    @JsonCreator
    public static PetCategory fromJson(String raw) {
        return fromQuery(raw);
    }

    public static PetCategory fromQuery(String raw) {
        if (raw == null) {
            throw new IllegalArgumentException("Invalid category value. Allowed: CATS, DOGS, FISH, BIRDS");
        }

        for (PetCategory category : values()) {
            if (category.name().equalsIgnoreCase(raw.trim())) {
                return category;
            }
        }

        throw new IllegalArgumentException("Invalid category value. Allowed: CATS, DOGS, FISH, BIRDS");
    }

    @JsonValue
    public String toJson() {
        return name();
    }
}
