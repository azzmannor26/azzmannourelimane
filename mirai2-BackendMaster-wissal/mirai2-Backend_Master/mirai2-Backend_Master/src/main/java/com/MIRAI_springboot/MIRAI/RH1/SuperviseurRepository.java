package com.MIRAI_springboot.MIRAI.RH1;

import com.MIRAI_springboot.MIRAI.entities.superviseur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SuperviseurRepository extends JpaRepository<superviseur, Long> {
}

