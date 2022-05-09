import React from "react";
import { useEntities } from "./utils/useEntities";

interface ListPageProps {
  moduleName: string;
  modelName: string;
}

const ListPage: React.FC<ListPageProps> = ({ moduleName, modelName }) => {
  const { entities } = useEntities({
    moduleName,
    modelName,
  });
  console.log(entities);
  return <></>;
};

export default ListPage;
