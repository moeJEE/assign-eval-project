package com.kachmar.assign_eval.controller;

import com.kachmar.assign_eval.dto.evaluation.EvaluationRequest;
import com.kachmar.assign_eval.dto.evaluation.EvaluationResponse;
import com.kachmar.assign_eval.service.EvaluationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("evaluations")
@RequiredArgsConstructor
public class EvaluationController {

    private final EvaluationService evaluationService;

    @GetMapping
    public ResponseEntity<List<EvaluationResponse>> getAllEvaluations() {
        return ResponseEntity.ok(evaluationService.getAllEvaluations());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EvaluationResponse> getEvaluationById(@PathVariable Long id) {
        return evaluationService.getEvaluationById(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new RuntimeException("Evaluation not found"));
    }

    @PostMapping
    public ResponseEntity<EvaluationResponse> createEvaluation(@Valid @RequestBody EvaluationRequest request) {
        return ResponseEntity.ok(evaluationService.createEvaluation(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EvaluationResponse> updateEvaluation(
            @PathVariable Long id, @Valid @RequestBody EvaluationRequest updatedRequest) {
        return ResponseEntity.ok(evaluationService.updateEvaluation(id, updatedRequest));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvaluation(@PathVariable Long id) {
        evaluationService.deleteEvaluation(id);
        return ResponseEntity.noContent().build();
    }
}
