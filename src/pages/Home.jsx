import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Home = () => {
    return (
        <React.Fragment>
            <Header />
            <div className="HomePageHeading"> Welcom to chat application. Please signin or create an account to continue</div>
            <Footer />
        </React.Fragment>
    )
}

export default Home;