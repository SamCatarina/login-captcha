package com.catarina.auditoria.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.catarina.auditoria.entity.LoginAttempt;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface LoginAttemptRepository extends JpaRepository<LoginAttempt, Long> {
    
    @Query("SELECT COUNT(la) FROM LoginAttempt la WHERE la.username = :username AND la.successful = false AND la.attemptTime > :since")
    Long countFailedAttemptsSince(@Param("username") String username, @Param("since") LocalDateTime since);
    
    @Query("SELECT la FROM LoginAttempt la WHERE la.username = :username ORDER BY la.attemptTime DESC")
    List<LoginAttempt> findByUsernameOrderByAttemptTimeDesc(@Param("username") String username);
    
    @Query("SELECT la FROM LoginAttempt la WHERE la.ipAddress = :ipAddress AND la.attemptTime > :since")
    List<LoginAttempt> findByIpAddressAndAttemptTimeAfter(@Param("ipAddress") String ipAddress, @Param("since") LocalDateTime since);
    
    List<LoginAttempt> findByUsernameAndAttemptTimeAfter(String username, LocalDateTime since);
}
