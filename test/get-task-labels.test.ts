import { describe, it, expect } from 'vitest';
import { getTaskLabels } from '@/components/DocTaskDetail';
import type { DocTask } from '@/lib/types';

const makeTask = (status: string, fixes?: any[]): DocTask => ({
  $docSchema: 'energimap-doc/v1',
  type: 'task',
  id: 'TASK-TEST',
  metadata: { title: 'Test', status, dateCreated: '2026-01-01', authorIds: [] },
  sections: [],
  fixes,
});

describe('getTaskLabels', () => {
  describe('status completed', () => {
    it('3 fixes → plural "entregas realizadas" e header "O QUE FOI FEITO"', () => {
      // Arrange
      const task = makeTask('completed', [
        { id: 1, title: 'Fix 1', description: '', files: [] },
        { id: 2, title: 'Fix 2', description: '', files: [] },
        { id: 3, title: 'Fix 3', description: '', files: [] },
      ]);

      // Act
      const result = getTaskLabels(task);

      // Assert
      expect(result.summaryText).toBe('3 entregas realizadas');
      expect(result.headerLabel).toBe('O QUE FOI FEITO');
    });

    it('1 fix → singular "entrega realizada"', () => {
      // Arrange
      const task = makeTask('completed', [
        { id: 1, title: 'Fix 1', description: '', files: [] },
      ]);

      // Act
      const result = getTaskLabels(task);

      // Assert
      expect(result.summaryText).toBe('1 entrega realizada');
      expect(result.headerLabel).toBe('O QUE FOI FEITO');
    });

    it('fixes vazio → "0 entregas realizadas"', () => {
      // Arrange
      const task = makeTask('completed', []);

      // Act
      const result = getTaskLabels(task);

      // Assert
      expect(result.summaryText).toBe('0 entregas realizadas');
      expect(result.headerLabel).toBe('O QUE FOI FEITO');
    });
  });

  describe('status pending / in_progress', () => {
    it('status pending, 2 fixes → plural "etapas planejadas/em andamento" e header "O QUE SERA FEITO"', () => {
      // Arrange
      const task = makeTask('pending', [
        { id: 1, title: 'Fix 1', description: '', files: [] },
        { id: 2, title: 'Fix 2', description: '', files: [] },
      ]);

      // Act
      const result = getTaskLabels(task);

      // Assert
      expect(result.summaryText).toBe('2 etapas planejadas/em andamento');
      expect(result.headerLabel).toBe('O QUE SERA FEITO');
    });

    it('status in_progress, 1 fix → singular "etapa planejada/em andamento"', () => {
      // Arrange
      const task = makeTask('in_progress', [
        { id: 1, title: 'Fix 1', description: '', files: [] },
      ]);

      // Act
      const result = getTaskLabels(task);

      // Assert
      expect(result.summaryText).toBe('1 etapa planejada/em andamento');
      expect(result.headerLabel).toBe('O QUE SERA FEITO');
    });

    it('fixes undefined → "0 etapas planejadas/em andamento"', () => {
      // Arrange
      const task = makeTask('pending', undefined);

      // Act
      const result = getTaskLabels(task);

      // Assert
      expect(result.summaryText).toBe('0 etapas planejadas/em andamento');
      expect(result.headerLabel).toBe('O QUE SERA FEITO');
    });

    it('fixes array vazio → "0 etapas planejadas/em andamento"', () => {
      // Arrange
      const task = makeTask('pending', []);

      // Act
      const result = getTaskLabels(task);

      // Assert
      expect(result.summaryText).toBe('0 etapas planejadas/em andamento');
      expect(result.headerLabel).toBe('O QUE SERA FEITO');
    });
  });

  describe('status desconhecido', () => {
    it('status cancelled → mesmo comportamento que pending', () => {
      // Arrange
      const task = makeTask('cancelled', [{ id: 1, title: 'F', description: 'd', files: [] }]);

      // Act
      const result = getTaskLabels(task);

      // Assert
      expect(result.summaryText).toBe('1 etapa planejada/em andamento');
      expect(result.headerLabel).toBe('O QUE SERA FEITO');
    });
  });
});
