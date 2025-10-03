import SpotlightAnimation from "./components/SpotlightAnimation";
import ChallengeBanner from "./components/ChallengeBanner";
import "./animation.css";

export default function Home() {
  return (
    <>
      <ChallengeBanner />
      <div>
        <SpotlightAnimation />
      </div>
    </>
  );
}
