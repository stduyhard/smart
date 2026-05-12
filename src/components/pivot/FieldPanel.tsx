import { useDraggable } from '@dnd-kit/core';
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

function DraggableField({ field, onPlaceField }: {
  field: PivotSourceModel['fields'][number];
  onPlaceField: FieldPanelProps['onPlaceField'];
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `field-${field.key}`,
    data: { label: field.key, type: field.type },
  });

  const style = transform ? {
    transform: `translate(${transform.x}px, ${transform.y}px)`,
    opacity: isDragging ? 0.5 : undefined,
    zIndex: isDragging ? 1000 : undefined,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      className="pivot-field-panel__field"
      style={style}
    >
      <div {...listeners} {...attributes} style={{ cursor: 'grab' }}>
        <FieldChip label={field.label} type={field.type} />
      </div>
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
    </div>
  );
}

function FieldPanel({ source, onPlaceField }: FieldPanelProps) {
  const dimensionFields = source.fields.filter((field) => field.type === 'dimension');
  const measureFields = source.fields.filter((field) => field.type === 'measure');

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
            <DraggableField key={field.key} field={field} onPlaceField={onPlaceField} />
          ))}
        </div>
      </div>
      <div className="pivot-field-panel__group">
        <h3>度量</h3>
        <div className="pivot-field-panel__chips">
          {measureFields.map((field) => (
            <DraggableField key={field.key} field={field} onPlaceField={onPlaceField} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default FieldPanel;
