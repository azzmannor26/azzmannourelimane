package com.MIRAI_springboot.MIRAI.intern.api;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class RoleAuthorizationConfig {

    // Map to store allowed roles for each endpoint and method pair
    private static final Map<String, Map<String, List<String>>> endpointRoleMap = new HashMap<>();

    static {
        // Define role-based access for endpoints

        // CertificationController endpoints
        addEndpointRoles("GET", "/certifications", List.of("STAGIAIRE", "RH"));
        addEndpointRoles("POST", "/certifications", List.of("STAGIAIRE"));
        addEndpointRoles("PUT", "/certifications/{certificationId}/status", List.of("RH"));


        //endpoints allowed just for supervisors
        addEndpointRoles("POST", "/superviseur/{superviseurId}/tache", List.of("SUPERVISEUR"));
        addEndpointRoles("GET", "/superviseur/{superviseurId}/availabilities", List.of("SUPERVISEUR"));
        addEndpointRoles("POST", "/superviseur/{superviseurId}/availability", List.of("SUPERVISEUR"));
        addEndpointRoles("GET", "/superviseur/{superviseurId}/stagiaire/{stagiaireId}/taches", List.of("SUPERVISEUR"));
        addEndpointRoles("PUT", "/superviseur/{superviseurId}/rapports/{rapportId}/evaluate", List.of("SUPERVISEUR"));
        addEndpointRoles("GET", "/superviseur/{superviseurId}/rapports", List.of("SUPERVISEUR"));
        addEndpointRoles("GET", "/superviseur/{superviseurId}/stagiaires", List.of("SUPERVISEUR"));

    }

    /**
     * Adds allowed roles for a specific HTTP method and endpoint pair.
     *
     * @param method   The HTTP method (e.g., GET, POST, PUT).
     * @param endpoint The endpoint URL (e.g., "/certifications").
     * @param roles    The list of allowed roles for this endpoint.
     */
    private static void addEndpointRoles(String method, String endpoint, List<String> roles) {
        endpointRoleMap.computeIfAbsent(method, k -> new HashMap<>()).put(endpoint, roles);
    }

    /**
     * Retrieves the list of allowed roles for a specific HTTP method and endpoint pair.
     *
     * @param method   The HTTP method (e.g., GET, POST, PUT).
     * @param endpoint The endpoint URL (e.g., "/certifications").
     * @return The list of allowed roles, or an empty list if no roles are defined.
     */
    public static List<String> getAllowedRoles(String method, String endpoint) {
        return endpointRoleMap.getOrDefault(method, new HashMap<>()).getOrDefault(endpoint, List.of());
    }
}
