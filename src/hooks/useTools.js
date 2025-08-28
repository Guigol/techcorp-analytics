import { useEffect, useState } from "react";
import axios from "axios";

export default function useTools(limit = 10) {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios.get(`https://tt-jsonserver-01.alt-tools.tech/tools?_sort=updated_at&_order=desc&_limit=${limit}`)
      .then(res => {
        setTools(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, [limit]);

  return { tools, loading, error };
}
