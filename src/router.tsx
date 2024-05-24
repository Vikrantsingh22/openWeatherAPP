import { createBrowserRouter } from "react-router-dom";
import { Dashboard, Layout } from "./Layout/page";
import Page from "./DashBoard/Page";
import HomePage from "./Home/page";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "weather",
        element: <Page />,
      },
    ],
  },
]);
