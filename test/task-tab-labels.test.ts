import { describe, it, expect } from 'vitest';
import { getFixesTabLabel, shouldShowFixesTab } from '@/components/DocDetail';

describe('getFixesTabLabel', () => {
  it('status completed → label "Entregas"', () => {
    // Arrange / Act
    const result = getFixesTabLabel('completed');

    // Assert
    expect(result).toBe('Entregas');
  });

  it('status pending → label "Etapas"', () => {
    // Arrange / Act
    const result = getFixesTabLabel('pending');

    // Assert
    expect(result).toBe('Etapas');
  });

  it('status in_progress → label "Etapas"', () => {
    // Arrange / Act
    const result = getFixesTabLabel('in_progress');

    // Assert
    expect(result).toBe('Etapas');
  });

  it('status active → label "Etapas"', () => {
    // Arrange / Act
    const result = getFixesTabLabel('active');

    // Assert
    expect(result).toBe('Etapas');
  });
});

describe('shouldShowFixesTab', () => {
  it('fixes com 3 items → tab visível', () => {
    // Arrange
    const fixes = [{ id: 1 }, { id: 2 }, { id: 3 }];

    // Act
    const result = shouldShowFixesTab(fixes);

    // Assert
    expect(result).toBe(true);
  });

  it('fixes vazio [] → tab oculta', () => {
    // Arrange
    const fixes: any[] = [];

    // Act
    const result = shouldShowFixesTab(fixes);

    // Assert
    expect(result).toBe(false);
  });

  it('fixes undefined → tab oculta', () => {
    // Arrange / Act
    const result = shouldShowFixesTab(undefined);

    // Assert
    expect(result).toBe(false);
  });

  it('fixes null → tab oculta', () => {
    // Arrange / Act
    const result = shouldShowFixesTab(null);

    // Assert
    expect(result).toBe(false);
  });
});
