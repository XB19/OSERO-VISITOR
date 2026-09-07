package com.osero.visitor.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public class LocationDtos {

    public record DepartmentRequest(@NotBlank String name) {}
    public record DepartmentResponse(UUID id, String name) {}

    public record BuildingRequest(@NotBlank String name) {}
    public record BuildingResponse(UUID id, String name) {}

    public record FloorRequest(@NotNull UUID buildingId, @NotBlank String label) {}
    public record FloorResponse(UUID id, UUID buildingId, String buildingName, String label) {}

    public record OfficeRequest(@NotNull UUID floorId, @NotBlank String label) {}
    public record OfficeResponse(UUID id, UUID floorId, String floorLabel, String label) {}
}
