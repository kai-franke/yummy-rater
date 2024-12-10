import { useState } from "react";
import { ReactNode } from "react";

export default function Error({ children }: { children: ReactNode }) {
  const [error, setError] = useState<string | null>(null);

  return (
    <> 
      {error && <h2>{error}</h2>}
      {children}
    </>
  );
}
