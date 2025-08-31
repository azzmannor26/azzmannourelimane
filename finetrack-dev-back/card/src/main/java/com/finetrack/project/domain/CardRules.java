package com.finetrack.project.domain;


import lombok.*;

import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CardRules {
    private Long monthlyLimit;    // cents
    private Long perTxLimit;      // cents
    private List<String> allowedMcc;  // e.g. ["Taxi","Restaurants","Hotels"]
    // window(s) fields can be added later
}

