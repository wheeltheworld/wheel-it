import axios from "axios";
import { useState } from "react";
import { useAsyncEffect } from "./useAsyncEffect";
import useManifest from "./useManifest";

interface UseChildSearch {
  moduleName: string;
  modelName: string;
  childName: string;
}

export interface Child {
  label: string;
  value: string | number;
}

export const useChildSearch = ({
  moduleName,
  modelName,
  childName,
}: UseChildSearch) => {
  const [options, setOptions] = useState<Child[]>([]);
  const [search, setSearch] = useState("");
  const { endpoint } = useManifest();

  useAsyncEffect(async () => {
    setOptions([]);
    if (search) {
      const { data } = await axios.get(
        `${endpoint({
          moduleName,
          modelName,
          children: childName,
        })}?query=${search || ""}`
      );
      setOptions(data.items);
    }
  }, [modelName, moduleName, childName, search]);

  const onClear = () => {
    setSearch("");
    setOptions([]);
  };

  return { options, onClear, search, onSearch: setSearch };
};
