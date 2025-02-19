package com.kachmar.assign_eval.dao.repository;

import com.kachmar.assign_eval.dao.entity.Token;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TokenRepository extends JpaRepository<Token, Integer> {

    Optional<Token> findByToken(String token);
}