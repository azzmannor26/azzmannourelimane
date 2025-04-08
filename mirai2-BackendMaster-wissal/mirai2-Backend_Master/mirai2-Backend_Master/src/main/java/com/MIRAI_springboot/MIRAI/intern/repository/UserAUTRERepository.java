package com.MIRAI_springboot.MIRAI.intern.repository;

import com.MIRAI_springboot.MIRAI.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserAUTRERepository extends JpaRepository<User, Long> {

    @Query(value = "SELECT id, username, password, email, role FROM users WHERE username = :username AND crypt(:password, password) = password", nativeQuery = true)
    List<Object[]> findByUsernameAndPasswordRaw(@Param("username") String username, @Param("password") String password);

}
