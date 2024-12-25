package com.kachmar.assign_eval.service;

import com.kachmar.assign_eval.dao.entity.Evaluation;
import com.kachmar.assign_eval.dao.repository.EvaluationRepository;
import com.kachmar.assign_eval.dto.evaluation.EvaluationRequest;
import com.kachmar.assign_eval.dto.evaluation.EvaluationResponse;
import com.kachmar.assign_eval.mapper.EvaluationMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EvaluationService {

    private final EvaluationRepository evaluationRepository;
    private final EvaluationMapper evaluationMapper;

    /**
     * Retrieve all evaluations and map them to EvaluationResponse.
     */
    public List<EvaluationResponse> getAllEvaluations() {
        return evaluationRepository.findAll()
                .stream()
                .map(evaluationMapper::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Retrieve a specific evaluation by ID.
     */
    public Optional<EvaluationResponse> getEvaluationById(Long id) {
        return evaluationRepository.findById(id)
                .map(evaluationMapper::toResponse);
    }

    /**
     * Create a new evaluation.
     */
    public EvaluationResponse createEvaluation(EvaluationRequest request) {
        // Map EvaluationRequest to Evaluation entity
        Evaluation evaluation = evaluationMapper.toEntity(request);

        // Save the evaluation
        Evaluation savedEvaluation = evaluationRepository.save(evaluation);

        // Map saved Evaluation to EvaluationResponse
        return evaluationMapper.toResponse(savedEvaluation);
    }

    /**
     * Update an existing evaluation.
     */
    public EvaluationResponse updateEvaluation(Long id, EvaluationRequest updatedRequest) {
        return evaluationRepository.findById(id)
                .map(existingEvaluation -> {
                    Evaluation updatedEvaluation = evaluationMapper.toEntity(updatedRequest);
                    updatedEvaluation.setId(existingEvaluation.getId()); // Retain the same ID
                    Evaluation savedEvaluation = evaluationRepository.save(updatedEvaluation);
                    return evaluationMapper.toResponse(savedEvaluation);
                })
                .orElseThrow(() -> new RuntimeException("Evaluation not found"));
    }

    /**
     * Delete an evaluation by ID.
     */
    public void deleteEvaluation(Long id) {
        if (!evaluationRepository.existsById(id)) {
            throw new RuntimeException("Evaluation not found");
        }
        evaluationRepository.deleteById(id);
    }
}
