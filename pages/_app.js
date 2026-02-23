import "../styles/globals.css";

import { VotingProvider } from "../context/Voter";
import NavBar from "../components/NavBar/NavBar";
import { Toaster } from "react-hot-toast";

const MyApp = ({ Component, pageProps }) => (
  <VotingProvider>
    <NavBar />
    
    <Toaster/>

    <div className="app_container">
      <Component {...pageProps} />
    </div>
  </VotingProvider>
);

export default MyApp;