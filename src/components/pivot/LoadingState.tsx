type LoadingStateProps = {
  message?: string;
};

function LoadingState({ message = '正在执行透视查询...' }: LoadingStateProps) {
  return (
    <section className="pivot-loading-state" role="status" aria-live="polite">
      <h2>查询执行中</h2>
      <p>{message}</p>
    </section>
  );
}

export default LoadingState;
