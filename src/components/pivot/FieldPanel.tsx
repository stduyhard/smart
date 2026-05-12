import type { PivotSourceModel } from '../../types/pivot';
import FieldChip from './FieldChip';

type FieldPanelProps = {
  source: PivotSourceModel;
  onPlaceField: (fieldKey: string, zone: 'rows' | 'columns' | 'measures' | 'filters') => void;
};

const zoneLabels = {
  rows: '行',
  columns: '列',
  measures: '度量',
  filters: '过滤条件',
} as const;

function FieldPanel({ source, onPlaceField }: FieldPanelProps) {
  const dimensionFields = source.fields.filter((field) => field.type === 'dimension');
  const measureFields = source.fields.filter((field) => field.type === 'measure');

  function renderFieldActions(field: PivotSourceModel['fields'][number]) {
    return (
      <div className="pivot-field-panel__actions">
        {field.allowedZones.map((zone) => (
          <button
            key={`${field.key}-${zone}`}
            type="button"
            onClick={() => onPlaceField(field.key, zone)}
          >
            添加 {field.label} 到 {zoneLabels[zone]}
          </button>
        ))}
      </div>
    );
  }

  return (
    <section className="pivot-panel pivot-field-panel" aria-labelledby="pivot-field-panel-title">
      <div className="pivot-panel__header">
        <h2 id="pivot-field-panel-title">字段列表</h2>
        <p>{source.description}</p>
      </div>
      <div className="pivot-field-panel__group">
        <h3>维度</h3>
        <div className="pivot-field-panel__chips">
          {dimensionFields.map((field) => (
            <div key={field.key} className="pivot-field-panel__field">
              <FieldChip label={field.label} type={field.type} />
              {renderFieldActions(field)}
            </div>
          ))}
        </div>
      </div>
      <div className="pivot-field-panel__group">
        <h3>度量</h3>
        <div className="pivot-field-panel__chips">
          {measureFields.map((field) => (
            <div key={field.key} className="pivot-field-panel__field">
              <FieldChip label={field.label} type={field.type} />
              {renderFieldActions(field)}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FieldPanel;
