import { useEffect, useState } from "react";

export function UseNetworkStatus() {
  const [isLowDataMode, setIsLowDataMode] = useState(false);

  useEffect(() => {
    const connection =
      navigator.connection || navigator.mozConnection || navigator.webkitConnection;

    if (connection) {
      const checkNetwork = () => {
        setIsLowDataMode(connection.downlink < 1.5 || connection.saveData);
      };
      connection.addEventListener("change", checkNetwork);
      checkNetwork();
      return () => connection.removeEventListener("change", checkNetwork);
    }
  }, []);

  return isLowDataMode;
}
