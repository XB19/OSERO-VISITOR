package com.osero.visitor.service;

import com.osero.visitor.domain.Employee;
import com.osero.visitor.dto.AuthDtos.LoginRequest;
import com.osero.visitor.dto.AuthDtos.LoginResponse;
import com.osero.visitor.security.EmployeeUserDetails;
import com.osero.visitor.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthService(AuthenticationManager authenticationManager, JwtService jwtService) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    public LoginResponse login(LoginRequest request) {
        var authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password()));

        Employee employee = ((EmployeeUserDetails) authentication.getPrincipal()).getEmployee();

        String token = jwtService.generateToken(employee.getProfessionalEmail(), Map.of(
                "role", employee.getRole().name(),
                "employeeId", employee.getId().toString(),
                "fullName", employee.getFullName()
        ));

        return new LoginResponse(
                token,
                employee.getId().toString(),
                employee.getFullName(),
                employee.getRole().name()
        );
    }
}
