import { Route, Routes } from "react-router-dom";
import Landing from "./pages/homePage";
import CoinDetails from "./components/details";
import Layout from "./components/layout";
import SeeMorePage from "./pages/seeMore";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Layout />} >
          <Route index element={<Landing />} />
          <Route  path="/coin/:id" element={<CoinDetails />} />
          <Route path="/see-more/:category" element={<SeeMorePage />} />
        </Route>
       
      </Routes>
       </div>
  );
}

export default App;
