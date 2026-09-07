package com.osero.visitor.service;

import com.osero.visitor.domain.Building;
import com.osero.visitor.domain.Department;
import com.osero.visitor.domain.Floor;
import com.osero.visitor.domain.Office;
import com.osero.visitor.dto.LocationDtos.*;
import com.osero.visitor.exception.ResourceNotFoundException;
import com.osero.visitor.repository.BuildingRepository;
import com.osero.visitor.repository.DepartmentRepository;
import com.osero.visitor.repository.FloorRepository;
import com.osero.visitor.repository.OfficeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class LocationService {

    private final DepartmentRepository departmentRepository;
    private final BuildingRepository buildingRepository;
    private final FloorRepository floorRepository;
    private final OfficeRepository officeRepository;

    public LocationService(DepartmentRepository departmentRepository, BuildingRepository buildingRepository,
                            FloorRepository floorRepository, OfficeRepository officeRepository) {
        this.departmentRepository = departmentRepository;
        this.buildingRepository = buildingRepository;
        this.floorRepository = floorRepository;
        this.officeRepository = officeRepository;
    }

    // -- Departments --
    public List<DepartmentResponse> listDepartments() {
        return departmentRepository.findAll().stream().map(this::toResponse).toList();
    }

    public DepartmentResponse createDepartment(DepartmentRequest request) {
        Department d = new Department();
        d.setName(request.name());
        return toResponse(departmentRepository.save(d));
    }

    public void deleteDepartment(UUID id) {
        departmentRepository.deleteById(id);
    }

    private DepartmentResponse toResponse(Department d) {
        return new DepartmentResponse(d.getId(), d.getName());
    }

    // -- Buildings --
    public List<BuildingResponse> listBuildings() {
        return buildingRepository.findAll().stream().map(this::toResponse).toList();
    }

    public BuildingResponse createBuilding(BuildingRequest request) {
        Building b = new Building();
        b.setName(request.name());
        return toResponse(buildingRepository.save(b));
    }

    public void deleteBuilding(UUID id) {
        buildingRepository.deleteById(id);
    }

    private BuildingResponse toResponse(Building b) {
        return new BuildingResponse(b.getId(), b.getName());
    }

    // -- Floors --
    public List<FloorResponse> listFloors(UUID buildingId) {
        List<Floor> floors = buildingId != null
                ? floorRepository.findByBuildingId(buildingId)
                : floorRepository.findAll();
        return floors.stream().map(this::toResponse).toList();
    }

    public FloorResponse createFloor(FloorRequest request) {
        Building building = buildingRepository.findById(request.buildingId())
                .orElseThrow(() -> new ResourceNotFoundException("Bâtiment introuvable"));
        Floor f = new Floor();
        f.setBuilding(building);
        f.setLabel(request.label());
        return toResponse(floorRepository.save(f));
    }

    public void deleteFloor(UUID id) {
        floorRepository.deleteById(id);
    }

    private FloorResponse toResponse(Floor f) {
        return new FloorResponse(f.getId(), f.getBuilding().getId(), f.getBuilding().getName(), f.getLabel());
    }

    // -- Offices --
    public List<OfficeResponse> listOffices(UUID floorId) {
        List<Office> offices = floorId != null
                ? officeRepository.findByFloorId(floorId)
                : officeRepository.findAll();
        return offices.stream().map(this::toResponse).toList();
    }

    public OfficeResponse createOffice(OfficeRequest request) {
        Floor floor = floorRepository.findById(request.floorId())
                .orElseThrow(() -> new ResourceNotFoundException("Étage introuvable"));
        Office o = new Office();
        o.setFloor(floor);
        o.setLabel(request.label());
        return toResponse(officeRepository.save(o));
    }

    public void deleteOffice(UUID id) {
        officeRepository.deleteById(id);
    }

    private OfficeResponse toResponse(Office o) {
        return new OfficeResponse(o.getId(), o.getFloor().getId(), o.getFloor().getLabel(), o.getLabel());
    }
}
