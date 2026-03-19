import { useState } from "react";

const useGeolocation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getLocation = () => {
    return new Promise((resolve, reject) => {
      setLoading(true);
      setError(null);

      if (!navigator.geolocation) {
        setError("Geolocation not supported");
        setLoading(false);
        reject(new Error("Geolocation not supported"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLoading(false);
          resolve({
            longitude: position.coords.longitude,
            latitude: position.coords.latitude,
          });
        },
        (err) => {
          setLoading(false);
          setError(err.message);
          reject(err);
        }
      );
    });
  };

  return { getLocation, loading, error };
};

export default useGeolocation;