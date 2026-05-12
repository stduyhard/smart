import type { PivotSourceDefinition } from '../../types/pivot';

type FilterPanelProps = {
  source: PivotSourceDefinition;
  filterFields: string[];
  filterValues: Record<string, string[]>;
  onChange: (field: string, values: string[]) => void;
};

export default function FilterPanel({ source, filterFields, filterValues, onChange }: FilterPanelProps) {
  if (filterFields.length === 0) return null;

  return (
    <div className="pivot-filter-panel">
      {filterFields.map((fieldKey) => {
        const distinctValues = [...new Set(source.rows.map((row: any) => String(row[fieldKey] ?? '')))].sort();
        const selected = filterValues[fieldKey] ?? [];

        return (
          <fieldset key={fieldKey}>
            <legend>过滤: {fieldKey}</legend>
            {distinctValues.map((value) => (
              <label key={value}>
                <input
                  type="checkbox"
                  value={value}
                  checked={selected.includes(value)}
                  onChange={() => {
                    const next = selected.includes(value)
                      ? selected.filter((v) => v !== value)
                      : [...selected, value];
                    onChange(fieldKey, next);
                  }}
                />
                {value}
              </label>
            ))}
          </fieldset>
        );
      })}
    </div>
  );
}
