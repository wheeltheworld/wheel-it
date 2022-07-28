import React from "react";
import axios from "axios";
import FormGenerator from "../components/FormGenerator";
import { useNavigate } from "react-router-dom";
import useManifest from "../utils/hooks/useManifest";
import { useNotification } from "../utils/hooks/useNotification";
import { cleanData, RelationModifies } from "../utils/funcs/cleanData";
import { Heading } from "@chakra-ui/react";

interface CreatePageProps {
  moduleName: string;
  modelName: string;
  modelLabel: string;
}

const CreatePage: React.FC<CreatePageProps> = ({
  moduleName,
  modelName,
  modelLabel,
}) => {
  const { endpoint, manifest, get } = useManifest();
  const navigate = useNavigate();
  const { success, error } = useNotification();

  if (!manifest) {
    return null;
  }

  const model = get({ moduleName, modelName });
  const { fields, label } = model;

  const handleSubmit = async (data: any, modifies: RelationModifies) => {
    try {
      const { data: ent } = await axios.post(
        endpoint({
          modelName,
          moduleName,
        }),
        cleanData(model, data, modifies)
      );
      const indexable = fields.indexables[0]?.name;
      success({
        title: `Success`,
        description: `${label} created successfully`,
      });
      if (indexable) {
        navigate(
          `/_/${moduleName}/${modelName}/${indexable}/${ent[indexable]}`
        );
      } else {
        navigate(`/_/${moduleName}/${modelName}`);
      }
    } catch (e) {
      error({
        title: `Error`,
        description: `${e}`,
      });
    }
  };

  return (
    <>
      <Heading>Create {modelLabel}</Heading>
      <FormGenerator
        onSubmit={handleSubmit}
        moduleName={moduleName}
        modelName={modelName}
      />
    </>
  );
};

export default CreatePage;
