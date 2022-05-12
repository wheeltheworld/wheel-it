import axios from "axios";
import { useState } from "react";
import { useAsyncEffect } from "./useAsyncEffect";
import useManifest from "./useManifest";

interface UseEntities {
  moduleName: string;
  modelName: string;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
  amount?: number;
  page?: number;
  query?: string;
}

interface List {
  items: any[];
  total: number;
  pages: number;
  amount: number;
  page: number;
}

export const useEntities = ({
  sortBy,
  sortOrder,
  moduleName,
  modelName,
  amount = 25,
  page = 0,
  query,
}: UseEntities) => {
  const [loading, setLoading] = useState(true);

  const [list, setList] = useState<List>();
  const { endpoint } = useManifest();

  useAsyncEffect(async () => {
    setLoading(true);
    const { data } = await axios.get(
      `${endpoint({
        moduleName,
        modelName,
      })}?${query ? `query=${query}&` : ""}${
        sortBy ? `sortBy=${sortBy}&` : ""
      }${
        sortOrder ? `sortOrder=${sortOrder}&` : ""
      }limit=${amount}&page=${page}`
    );
    setList(data);
    setLoading(false);
  }, [page, sortBy, sortOrder, amount, moduleName, modelName]);

  return { ...list, loading };
};
