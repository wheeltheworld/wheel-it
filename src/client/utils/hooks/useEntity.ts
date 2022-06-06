import axios from "axios";
import { useState } from "react";
import { useAsyncEffect } from "./useAsyncEffect";
import useManifest from "./useManifest";

interface UseEntity {
  moduleName: string;
  modelName: string;
  by?: string;
  value?: string;
}

export const useEntity = ({
  moduleName,
  modelName,
  by,
  value,
}: UseEntity): any => {
  const [entity, setEntity] = useState<any>();
  const { manifest, endpoint } = useManifest();

  useAsyncEffect(async () => {
    if (!manifest) return;
    const url = endpoint({ moduleName, modelName, by, value });
    const { data } = await axios.get(url);
    setEntity(data);
  }, [manifest]);

  return entity;
};
