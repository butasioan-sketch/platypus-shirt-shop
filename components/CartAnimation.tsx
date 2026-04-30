"use client";

import { useEffect, useState } from "react";

export default function CartAnimation({ show }: { show: boolean }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!visible) return null;

  return (
    <div className="fixed top-10 right-10 bg-green-500 text-white px-4 py-2 rounded-lg font-bold shadow-lg">
      ✅ Hinzugefügt!
    </div>
  );
}
