package com.petstore.pet;

import com.petstore.pet.dto.PetDetailDto;
import com.petstore.pet.dto.PetRequest;
import com.petstore.pet.dto.PetSummaryDto;
import jakarta.persistence.EntityNotFoundException;
import java.util.Objects;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class PetService {

    private final PetRepository petRepository;

    public PetService(PetRepository petRepository) {
        this.petRepository = petRepository;
    }

    @Transactional(readOnly = true)
    public Page<PetSummaryDto> findPets(String search, PetCategory category, Pageable pageable) {
        String normalizedSearch = normalizeSearch(search);
        return petRepository.findBySearchAndCategory(normalizedSearch, category, pageable)
            .map(this::toSummaryDto);
    }

    @Transactional(readOnly = true)
    public PetDetailDto findById(Long id) {
        Long requiredId = Objects.requireNonNull(id, "id must not be null");
        Pet pet = petRepository.findById(requiredId)
            .orElseThrow(() -> new EntityNotFoundException("Pet not found"));
        return toDetailDto(pet);
    }

    public PetDetailDto createPet(PetRequest request) {
        Pet pet = new Pet();
        applyRequest(pet, request);
        return toDetailDto(petRepository.save(pet));
    }

    public PetDetailDto updatePet(Long id, PetRequest request) {
        Pet pet = petRepository.findById(Objects.requireNonNull(id, "id must not be null"))
            .orElseThrow(() -> new EntityNotFoundException("Pet not found"));
        applyRequest(pet, request);
        return toDetailDto(petRepository.save(pet));
    }

    public void deletePet(Long id) {
        Pet pet = petRepository.findById(Objects.requireNonNull(id, "id must not be null"))
            .orElseThrow(() -> new EntityNotFoundException("Pet not found"));
        petRepository.delete(pet);
    }

    private void applyRequest(Pet pet, PetRequest request) {
        pet.setName(request.name().trim());
        pet.setBreed(request.breed().trim());
        pet.setAge(request.age());
        pet.setPrice(request.price());
        pet.setDescription(request.description().trim());
        pet.setImageUrl(request.imageUrl().trim());
        pet.setAvailable(request.available());
        pet.setCategory(request.category());
    }

    private String normalizeSearch(String search) {
        if (search == null) {
            return null;
        }

        String trimmed = search.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    private PetSummaryDto toSummaryDto(Pet pet) {
        return new PetSummaryDto(
            pet.getId(),
            pet.getName(),
            pet.getBreed(),
            pet.getPrice(),
            pet.getImageUrl(),
            pet.getAvailable(),
            pet.getCategory()
        );
    }

    private PetDetailDto toDetailDto(Pet pet) {
        return new PetDetailDto(
            pet.getId(),
            pet.getName(),
            pet.getBreed(),
            pet.getAge(),
            pet.getPrice(),
            pet.getDescription(),
            pet.getImageUrl(),
            pet.getAvailable(),
            pet.getCategory()
        );
    }
}
