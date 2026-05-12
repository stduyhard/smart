import FieldChip from './FieldChip';

type LayoutZoneProps = {
  title: string;
  items: string[];
  type: 'dimension' | 'measure';
};

function LayoutZone({ title, items, type }: LayoutZoneProps) {
  return (
    <section className="pivot-layout-zone" aria-label={title}>
      <div className="pivot-layout-zone__header">
        <h3>{title}</h3>
        <span>{items.length} 项</span>
      </div>
      {items.length > 0 ? (
        <div className="pivot-layout-zone__content">
          {items.map((item) => (
            <FieldChip key={item} label={item} type={type} />
          ))}
        </div>
      ) : (
        <p className="pivot-layout-zone__placeholder">拖拽字段到此区域</p>
      )}
    </section>
  );
}

export default LayoutZone;
