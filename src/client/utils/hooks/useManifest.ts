import axios from "axios";
import { useState } from "react";
import type {
  Manifest,
  ManifestModel,
  ManifestModule,
} from "../../../shared/manifest";
import { useAsyncEffect } from "./useAsyncEffect";

declare global {
  interface Window {
    __WHEEL__: {
      manifest: Manifest;
    };
  }
}

const useManifest = () => {
  const [manifest, setManifest] = useState<Manifest | undefined>(
    typeof window !== "undefined" ? window.__WHEEL__?.manifest : undefined
  );
  useAsyncEffect(async () => {
    if (manifest) {
      return;
    }
    const { data: m } = await axios("/_/api/manifest");
    setManifest(m);
    window.__WHEEL__ ??= { manifest: m };
    window.__WHEEL__.manifest ??= m;
  }, []);

  const endpoint = ({
    modelName,
    moduleName,
    by,
    value,
    relationName,
  }: {
    moduleName: string;
    modelName: string;
    by?: string;
    value?: string;
    relationName?: string;
  }) => {
    const base = `/_/api/module/${moduleName}/model/${modelName}`;
    if (by) {
      return `${base}/${by}/${value}`;
    }
    if (relationName) {
      return `${base}/relations/${relationName}`;
    }
    return base;
  };

  function get(p: { modelName: string; moduleName: string }): ManifestModel;
  function get(p: { moduleName: string }): ManifestModule;
  function get(p: {}): Manifest;
  function get({
    moduleName,
    modelName,
  }: {
    moduleName?: string;
    modelName?: string;
  }) {
    if (!moduleName) return manifest;
    if (!modelName) return manifest?.modules[moduleName];
    return manifest?.modules[moduleName]?.models[modelName];
  }

  return { manifest, endpoint, get };
};

export default useManifest;
