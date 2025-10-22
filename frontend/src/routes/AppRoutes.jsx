import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import PrivateRoute from "./PrivateRoute";
import Layout from "../pages/Layout";
import Home from "../pages/Home/home";
import QuestionDetails from "../pages/Home/QuestionDetails";
import AskQuestion from "../pages/AskQuestion/AskQuestion";
import Dashboard from "../pages/Dashboard/Dashboard";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                path: "",
                element: (
                    <PrivateRoute>
                        <Home />
                    </PrivateRoute>
                ),
            },
            {
                path: "question/:id",
                element: (
                    <PrivateRoute>
                        <QuestionDetails />
                    </PrivateRoute>
                ),
            },
            {
                path: "ask-questions/",
                element: (
                    <PrivateRoute>
                        <AskQuestion />
                    </PrivateRoute>
                ),
            },
            {
                path: "dashboard/",
                element: (
                    <PrivateRoute roleRequired={1}>
                        <Dashboard />
                    </PrivateRoute>
                ),
            }
        ]
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    }
]);

export default router;