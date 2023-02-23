import { BrowserRouter, Switch, Route } from "react-router-dom";
import Coin from "./routers/Coin";
import Coins from "./routers/Coins";

export default function Router() {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Switch>
        <Route path="/:coinId">
          <Coin />
        </Route>
        <Route path="/">
          <Coins />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}
