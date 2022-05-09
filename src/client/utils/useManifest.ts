import axios from "axios";
import { useState } from "react";
import type { Manifest } from "src/shared/manifest";
import { useAsyncEffect } from "./useAsyncEffect";

declare global {
  interface Window {
    __WHEEL__: {
      manifest: Manifest;
    };
  }
}

const useManifest = () => {
  const [manifest, setManifest] = useState<Manifest>();

  useAsyncEffect(async () => {
    if (window.__WHEEL__.manifest) {
      setManifest(window.__WHEEL__.manifest);
      return;
    }
    const { data: manifest } = await axios("/_/api/manifest");
    setManifest(manifest);
    window.__WHEEL__.manifest = manifest;
  }, []);

  const endpoint = ({
    modelName,
    moduleName,
    by,
    value,
  }: {
    moduleName: string;
    modelName: string;
    by?: string;
    value?: string;
  }) => {
    const base = `/_/api/${moduleName}/${modelName}`;
    if (by) {
      return `${base}/${by}/${value}`;
    }
    return base;
  };

  return { manifest, endpoint };
};

export default useManifest;
