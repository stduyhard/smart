function SettingsPanel() {
  return (
    <aside className="pivot-panel pivot-settings-panel" aria-labelledby="pivot-settings-title">
      <div className="pivot-panel__header">
        <h2 id="pivot-settings-title">设置</h2>
        <p>后续任务会补充排序、格式和结果呈现配置。</p>
      </div>
      <dl className="pivot-settings-panel__list">
        <div>
          <dt>展示方式</dt>
          <dd>汇总表</dd>
        </div>
        <div>
          <dt>排序</dt>
          <dd>默认</dd>
        </div>
        <div>
          <dt>状态</dt>
          <dd>等待查询</dd>
        </div>
      </dl>
    </aside>
  );
}

export default SettingsPanel;
