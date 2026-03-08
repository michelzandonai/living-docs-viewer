import { describe, it, expect } from 'vitest';
import { parseFileBadge } from '@/components/DocTaskDetail';

describe('parseFileBadge', () => {
  describe('(NOVO)', () => {
    it('retorna badge NEW e remove a keyword do path', () => {
      // Arrange
      const filePath = 'src/components/MyComponent.tsx (NOVO)';

      // Act
      const result = parseFileBadge(filePath);

      // Assert
      expect(result.path).toBe('src/components/MyComponent.tsx');
      expect(result.badge).toBeDefined();
      expect(result.badge!.label).toBe('NEW');
    });

    it('badge.color é a classe completa emerald', () => {
      // Arrange
      const filePath = 'src/utils/helper.ts (NOVO)';

      // Act
      const { badge } = parseFileBadge(filePath);

      // Assert
      expect(badge!.color).toBe('bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300');
    });
  });

  describe('(MODIFICA)', () => {
    it('retorna badge MOD e remove a keyword do path', () => {
      // Arrange
      const filePath = 'src/services/api.ts (MODIFICA)';

      // Act
      const result = parseFileBadge(filePath);

      // Assert
      expect(result.path).toBe('src/services/api.ts');
      expect(result.badge).toBeDefined();
      expect(result.badge!.label).toBe('MOD');
    });

    it('badge.color é a classe completa amber', () => {
      // Arrange
      const filePath = 'src/services/api.ts (MODIFICA)';

      // Act
      const { badge } = parseFileBadge(filePath);

      // Assert
      expect(badge!.color).toBe('bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300');
    });
  });

  describe('(reescrito)', () => {
    it('retorna badge MOD e remove a keyword do path', () => {
      // Arrange
      const filePath = 'src/hooks/useData.ts (reescrito)';

      // Act
      const result = parseFileBadge(filePath);

      // Assert
      expect(result.path).toBe('src/hooks/useData.ts');
      expect(result.badge).toBeDefined();
      expect(result.badge!.label).toBe('MOD');
    });

    it('badge.color é a classe completa amber', () => {
      // Arrange
      const filePath = 'src/hooks/useData.ts (reescrito)';

      // Act
      const { badge } = parseFileBadge(filePath);

      // Assert
      expect(badge!.color).toBe('bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300');
    });
  });

  describe('(NAO MUDA)', () => {
    it('retorna badge REF e remove a keyword do path', () => {
      // Arrange
      const filePath = 'src/types/index.ts (NAO MUDA)';

      // Act
      const result = parseFileBadge(filePath);

      // Assert
      expect(result.path).toBe('src/types/index.ts');
      expect(result.badge).toBeDefined();
      expect(result.badge!.label).toBe('REF');
    });

    it('badge.color é a classe completa zinc', () => {
      // Arrange
      const filePath = 'src/types/index.ts (NAO MUDA)';

      // Act
      const { badge } = parseFileBadge(filePath);

      // Assert
      expect(badge!.color).toBe('bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400');
    });
  });

  describe('sem keyword', () => {
    it('retorna path original sem badge', () => {
      // Arrange
      const filePath = 'src/components/Button.tsx';

      // Act
      const result = parseFileBadge(filePath);

      // Assert
      expect(result.path).toBe('src/components/Button.tsx');
      expect(result.badge).toBeUndefined();
    });
  });

  describe('path vazio', () => {
    it('retorna path vazio sem badge', () => {
      // Arrange
      const filePath = '';

      // Act
      const result = parseFileBadge(filePath);

      // Assert
      expect(result.path).toBe('');
      expect(result.badge).toBeUndefined();
    });
  });

  describe('múltiplas keywords', () => {
    it('retorna primeiro match quando path tem multiplas keywords', () => {
      // Arrange
      const filePath = 'src/file.ts (NOVO) (MODIFICA)';

      // Act
      const result = parseFileBadge(filePath);

      // Assert — includes('(NOVO)') é testado primeiro na implementação
      expect(result.badge?.label).toBe('NEW');
    });
  });
});
