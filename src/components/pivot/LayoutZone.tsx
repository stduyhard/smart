import type { PivotField, PivotZone } from '../../types/pivot';
import FieldChip from './FieldChip';

type LayoutZoneProps = {
  zone: PivotZone;
  title: string;
  fields: readonly PivotField[];
};

function LayoutZone({ zone, title, fields }: LayoutZoneProps) {
  return (
    <section className="pivot-layout-zone" aria-label={title} data-zone={zone}>
      <div className="pivot-layout-zone__header">
        <h3>{title}</h3>
        <span>{fields.length} 项</span>
      </div>
      {fields.length > 0 ? (
        <div className="pivot-layout-zone__content">
          {fields.map((field) => (
            <FieldChip key={field.key} label={field.label} type={field.type} />
          ))}
        </div>
      ) : (
        <p className="pivot-layout-zone__placeholder">拖拽字段到此区域</p>
      )}
    </section>
  );
}

export default LayoutZone;
