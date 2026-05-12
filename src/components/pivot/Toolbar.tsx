type ToolbarProps = {
  sourceName: string;
  onReset: () => void;
};

function Toolbar({ sourceName, onReset }: ToolbarProps) {
  return (
    <header className="pivot-toolbar">
      <div>
        <p className="pivot-toolbar__eyebrow">当前数据源</p>
        <strong>{sourceName}</strong>
      </div>
      <div className="pivot-toolbar__actions">
        <button type="button" onClick={onReset}>
          重置布局
        </button>
        <button type="button" disabled>
          执行查询
        </button>
      </div>
    </header>
  );
}

export default Toolbar;
