type FieldChipProps = {
  label: string;
  type: 'dimension' | 'measure';
};

function FieldChip({ label, type }: FieldChipProps) {
  return (
    <span className={`pivot-field-chip pivot-field-chip--${type}`}>
      <span className="pivot-field-chip__type">{type === 'measure' ? 'M' : 'D'}</span>
      <span>{label}</span>
    </span>
  );
}

export default FieldChip;
