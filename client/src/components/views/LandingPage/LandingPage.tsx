import axios from "axios";
import { useEffect } from "react";

function LandingPage() {
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/hi")
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  }, []);
  return <div>LandingPage</div>;
}

export default LandingPage;
