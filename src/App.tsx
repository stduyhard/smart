import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { routerConfig } from './router';

const appRouter = createBrowserRouter(routerConfig);

function App() {
  return <RouterProvider router={appRouter} />;
}

export default App;
