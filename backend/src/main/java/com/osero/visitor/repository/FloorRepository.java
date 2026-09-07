package com.osero.visitor.repository;

import com.osero.visitor.domain.Floor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface FloorRepository extends JpaRepository<Floor, UUID> {
    List<Floor> findByBuildingId(UUID buildingId);
}
