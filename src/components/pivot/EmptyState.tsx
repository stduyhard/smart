type EmptyStateProps = {
  visible?: boolean;
  title?: string;
  description?: string;
};

function EmptyState({
  visible = true,
  title = '结果预览',
  description = '拖拽字段到行、列、度量和过滤条件后开始查询。',
}: EmptyStateProps) {
  if (!visible) {
    return null;
  }

  return (
    <section className="pivot-empty-state" aria-label="查询结果空状态">
      <h2>{title}</h2>
      <p>{description}</p>
    </section>
  );
}

export default EmptyState;
