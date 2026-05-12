type LoadingStateProps = {
  message?: string;
};

function LoadingState({ message = '正在执行透视查询...' }: LoadingStateProps) {
  return (
    <section className="pivot-loading-state" role="status" aria-live="polite">
      <div className="pivot-loading-state__spinner" />
      <span>{message}</span>
    </section>
  );
}

export default LoadingState;
