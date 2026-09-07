package com.osero.visitor.repository;

import com.osero.visitor.domain.Office;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface OfficeRepository extends JpaRepository<Office, UUID> {
    List<Office> findByFloorId(UUID floorId);
}
