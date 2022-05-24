import axios from "axios";
import { useState } from "react";
import { useAsyncEffect } from "./useAsyncEffect";
import useManifest from "./useManifest";

export interface Child {
  value: number | string;
  label: string;
}

interface UseChildEntities {
  moduleName: string;
  modelName: string;
  childName: string;
}

export const useChildEntities = (
  { moduleName, modelName, childName }: UseChildEntities,
  init: Child[]
) => {
  const [options, setOptions] = useState<Child[]>([]);
  const [search, setSearch] = useState("");
  const [children, setChildren] = useState<Child[]>(init || []);
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

  const onSelect = (option: Child) => () => {
    if (!children.find((child) => child.value === option.value)) {
      setChildren([...children, option]);
      setSearch("");
      setOptions([]);
    }
  };

  const onRemove = (option: Child) => () => {
    setChildren(children.filter((o) => o.value !== option.value));
  };

  return { children, options, onSelect, onRemove, search, onSearch: setSearch };
};
