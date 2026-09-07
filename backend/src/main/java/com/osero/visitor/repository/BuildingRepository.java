package com.osero.visitor.repository;

import com.osero.visitor.domain.Building;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface BuildingRepository extends JpaRepository<Building, UUID> {
}
