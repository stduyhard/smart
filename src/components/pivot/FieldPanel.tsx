import type { PivotSourceModel } from '../../types/pivot';
import FieldChip from './FieldChip';

type FieldPanelProps = {
  source: PivotSourceModel;
};

function FieldPanel({ source }: FieldPanelProps) {
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
            <FieldChip key={field.key} label={field.label} type={field.type} />
          ))}
        </div>
      </div>
      <div className="pivot-field-panel__group">
        <h3>度量</h3>
        <div className="pivot-field-panel__chips">
          {measureFields.map((field) => (
            <FieldChip key={field.key} label={field.label} type={field.type} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default FieldPanel;
