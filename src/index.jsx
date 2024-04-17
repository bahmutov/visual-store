import React from "react";
import ReactDOM from "react-dom";
import { Route, BrowserRouter as Router } from "react-router-dom";
import "./index.css";
import Login from "./pages/Login";
import Inventory from "./pages/Inventory";
import InventoryItem from "./pages/InventoryItem";
import Cart from "./pages/Cart";
import CheckOutStepOne from "./pages/CheckOutStepOne";
import CheckOutStepTwo from "./pages/CheckOutStepTwo";
import Finish from "./pages/Finish";
import { ROUTES } from "./utils/Constants";
import PrivateRoute from "./components/PrivateRoute";

const routing = (
  <Router>
    <Route exact path={ROUTES.LOGIN} component={Login} />
    <PrivateRoute path={ROUTES.INVENTORY} component={Inventory} />
    <PrivateRoute path={ROUTES.INVENTORY_LIST} component={InventoryItem} />
    <PrivateRoute path={ROUTES.CART} component={Cart} />
    <PrivateRoute path={ROUTES.CHECKOUT_STEP_ONE} component={CheckOutStepOne} />
    <PrivateRoute path={ROUTES.CHECKOUT_STEP_TWO} component={CheckOutStepTwo} />
    <PrivateRoute path={ROUTES.CHECKOUT_COMPLETE} component={Finish} />
  </Router>
);

ReactDOM.render(routing, document.getElementById("root"));
